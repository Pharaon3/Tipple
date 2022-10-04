import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { isServer } from 'store';
import { redirectToNotFound } from 'lib/location';
import { ssrComponent } from 'lib/ssrHelper';
import registerBundleCollectionRedux from 'app/resources/api/bundleCollection';
import { displayAddressSelect } from 'app/resources/action/Address';
import { addBundleToCart } from 'app/resources/action/Cart';
import Page from 'app/components/Page';
import Spinner from 'app/components/Spinner';
import ActionBar from 'app/components/ActionBar';
import PrivacyPolicy from 'app/components/PrivacyPolicy';
import styles from './BundleBuilder.module.scss';
import { INTERACTIONS } from 'lib/analytics/collection';
import { AnalyticsEvents } from 'lib/analytics';
import config from 'app/config';

const bundleRedux = registerBundleCollectionRedux('BUNDLE_BUILDER', ['GET']);

const toCurrency = (value) => {
    value = parseFloat(value + '');
    if (!isNaN(value)) {
        return value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return '';
}

class BundleBuilder extends Component {

    constructor() {
        super();
        this.state = {
            totalQuantity: 0,
            quantity: {},
            loaded: false
        };
    }

    analyticsFired = false;

    componentDidMount() {
        window.scrollTo(0, 0);

        // Fire off page view event. This has to be done here instead of App.jsx because it depends on if collections exist.
        if (typeof window !== 'undefined' && !this.analyticsFired) {
            global.tippleAnalytics.trigger(AnalyticsEvents.app_pageview, { 'page': { 'path': 'bundle-builder', }, 'data': { 'appUrl': this.props?.history?.location?.pathname } });
            this.analyticsFired = true;
        }
    }

    componentWillUnmount() {
        this.props.bundleActions.clear();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.slug !== this.props.match.params.slug) {
            await BundleBuilder.getBundle(this.props);
        }
        const bundle = this.props.bundle;
        if (!this.state.loaded && bundle?.item) {
            this.setState({
                ...this.state,
                loaded: true
            });
            
            global.tippleAnalytics.trigger(AnalyticsEvents.product_list_viewed, 
                {
                    list_id: bundle.item.id + '',
                    collection: bundle.item.name,
                    collectionId: bundle.item.id,
                    promotion_ref: bundle.item.bundleReferencePath,
                    query: '',
                    from: 'Bundle Builder',
                    sort: 'default',
                    type: 'BUNDLE_BUILDER'
                }
            );
        }

        if (prevProps.currentStoreId !== this.props.currentStoreId) {
            BundleBuilder.getBundle(this.props);
        }
    }

    static async getInitialProps(props) {
        if (props.bundle.item !== undefined && props.bundle.item !== null) {
            return;
        }
        return BundleBuilder.getBundle(props);
    }

    static async getBundle(props) {
        return await props.bundleActions.get(props.match.params.slug, props.auth, {
            storeId: props.currentStoreId,
            zoneId: props.addressZoneId
        });
    }

    goBack = () => {
        let shouldRedirectToHome = !this.props.hasCart || this.props.history.location.pathname === '/' || this.props.history.length === 1;

        this.props.history.push(shouldRedirectToHome ? '/' : this.props.history.goBack());
    }

    handleItemAdd = (product, position) => {
        const id = product.id + '';
        this.setState({
            ...this.state,
            totalQuantity: this.state.totalQuantity + 1,
            quantity: {
                ...this.state.quantity,
                [id]: (this.state.quantity[id] ?? 0) + 1
            }
        });

        global.tippleAnalytics.trigger(
            AnalyticsEvents.collection_interaction, 
            {
                interaction: INTERACTIONS.ITEM_ADDED,
                id: this.props.bundle?.item?.id,
                name: this.props.bundle?.item?.name,
                from: 'Bundle Builder',
                item_id: id,
                item_name: product.name,
                item_position: position,
                item_type: 'PRODUCT',
                promotion_ref: this.props.bundle?.item?.bundleReferencePath,
                type: 'BUNDLE_BUILDER'
            }
        );
    };

    handleItemSubstract = (product, position) => {
        const id = product.id + '';
        if (this.state.quantity[id] && this.state.quantity[id] > 0) {
            this.setState({
                ...this.state,
                totalQuantity: this.state.totalQuantity - 1,
                quantity: {
                    ...this.state.quantity,
                    [id]: this.state.quantity[id] -1
                }
            });

            global.tippleAnalytics.trigger(
                AnalyticsEvents.collection_interaction, 
                {
                    interaction: INTERACTIONS.ITEM_REMOVED,
                    id: this.props.bundle?.item?.id,
                    name: this.props.bundle?.item?.name,
                    from: 'Bundle Builder',
                    item_id: id,
                    item_name: product.name,
                    item_position: position,
                    item_type: 'PRODUCT',
                    promotion_ref: this.props.bundle?.item?.bundleReferencePath,
                    type: 'BUNDLE_BUILDER'
                }
            );
        }
    }

    getTotalCost = () => {
        if (this.props.bundle?.item) {
            if (this.props.bundle.item.fixedTotal) {
                return this.props.bundle.item.fixedTotal;
            }
            const selectedIds = Object.keys(this.state.quantity);

            return this.props.bundle.item.products.reduce((sum, product) => {
                const id = product.id + ''
                if (selectedIds.includes(id) && this.state.quantity[id] > 0) {
                    const price = product.defaultPack.salePrice > 0 ? product.defaultPack.salePrice : product.defaultPack.price;
                    return sum + (price * this.state.quantity[id]);
                }
                return sum;
            }, 0);
        }
        return 0;
    }

    withinQty = () => {
        const bundle = this.props.bundle;
        if (bundle.item) {
            return this.state.totalQuantity >= bundle.item?.minQuantity &&
                this.state.totalQuantity <= bundle.item?.maxQuantity;
        } 
        return false;
    }

    goToCheckout = () => {
        this.props.history.push('/cart');
    }

    addToCart = () => {
        const bundle = this.props.bundle;
        if (bundle.item?.status === 'ACTIVE' && this.withinQty()) {
            const selectedIds = Object.keys(this.state.quantity);
            this.props.addBundleToCart(
                this.props.match.params.slug,
                selectedIds.map(productId => {
                    const product = bundle.item.products.find(product => (product.id + '') === (productId + ''));
                    const quantity = this.state.quantity[productId + ''];
                    if (product && quantity > 0) {
                        const price = product.defaultPack.salePrice > 0 ? product.defaultPack.salePrice : product.defaultPack.price;

                        global.tippleAnalytics.trigger(AnalyticsEvents.add_to_cart, { 
                            product: product,
                            addToCart: {
                                packSize: product.defaultPack.packSize,
                                quantity: quantity,
                                cart_id: this.props.cartId,
                                price: price
                            },
                            promotion_ref: bundle.item.bundleReferencePath
                        });

                        return {
                            productId,
                            packSize: product.defaultPack.packSize,
                            quantity
                        }
                    }
                    return null;
                }).filter(p => p),
                this.props.auth
            ).then(() => {
                this.goBack();           
            });
        }
    }

    render() {

        const bundle = this.props.bundle;

        if (!bundle && bundle.hasRequested === true) {
            if (isServer) {
                return <Redirect to={{ pathname: '/notfound', state: { code: 301 } }}/>;
            } else {
                redirectToNotFound();
                return <React.Fragment />;
            }
        }

        const pageTitle = bundle.item ? 
            `Tipple - ${bundle.item.heading?.title ?? bundle.item.name} Delivered Fast` : 
            'Something Delicious - Powered by Tipple';
        
        const selectedLabel = this.state.totalQuantity + (
            this.state.totalQuantity <= bundle.item?.minQuantity ? `/${bundle.item?.minQuantity}` : ''
        ) + ' Selected';

        const withinQty = this.withinQty();

        const available = bundle.item?.status === 'ACTIVE';
        
        const ableToAddToCart = withinQty && available && !this.props.isAddingBundle;

        return (
            <Page id="bundle-builder" title={pageTitle} description="....">
                <div className={styles.bundlebuilder}>
                    <Wrapper back={this.goBack} ready={bundle.hasRequested}>
                        <Header 
                            {...bundle.item?.heading} 
                            back={this.goBack} 
                            description={bundle.item?.description} 
                        />
                        {bundle.item?.products && <ul className={styles.list}>
                            {bundle.item.products.map((product, i) => 
                                <Item 
                                    key={`bundle_product_${product.id}`} 
                                    product={product} 
                                    quantity={this.state.quantity[product.id]}
                                    onAdd={() => this.handleItemAdd(product, i+1)}
                                    onSubtract={() => this.handleItemSubstract(product, i+1)}
                                    disabled={bundle.item?.maxQuantity && this.state.totalQuantity >= bundle.item?.maxQuantity}
                                    unavailable={!available}
                                />
                            )}
                        </ul>}
                        <ActionBar className={styles['action-bar']}>
                            <div>
                                <span>{selectedLabel}</span>
                                Total: 
                                <span>{toCurrency(this.getTotalCost())}</span>
                            </div>
                            <div>
                                <button className={styles['btn-checkout']} onClick={this.goToCheckout}>Checkout</button>
                                {!this.props.hasCart ? <button onClick={this.props.displayAddressSelect} className={styles['btn-add-to-cart']}>
                                    Check Availability Near You
                                </button> : (available ? <button onClick={this.addToCart} disabled={!ableToAddToCart} className={classNames(styles['btn-add-to-cart'], !ableToAddToCart && styles['disabled'])}>
                                    Add to Cart
                                </button> : <button disabled={true} className={classNames(styles['btn-disabled'])}>
                                    Out of Stock
                                </button>)}
                            </div>
                        </ActionBar>
                        <PrivacyPolicy section={'product'} />
                    </Wrapper>
                </div>
            </Page>
        );
    }
}

function Wrapper({ children, ready, back }) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-offset-2 col-sm-8 clearfix hidden-xs hidden-sm">
                    <div className="row">
                        <div className="col-sm-4 mb-24">
                            <button className="btn btn-primary btn-block bn-lg btn-cancel" onClick={back}>&lt; Back</button>
                        </div>
                        <div className="col-sm-8"/>
                    </div>
                </div>
                <div className="content-wrapper mt-0">
                    <div className="details mb-24">
                        {!ready && <Spinner />}
                        {ready && <div>
                            <div className="container">
                                <div className="content-container">
                                    <div className="row">
                                        <div className="product-holder content mb-24 col-xs-12 col-sm-offset-2 col-sm-8 content-height">
                                            <section className={classNames('row', styles.wrapper)}>{children}</section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Header({ title, subtitle = "This deal is currently unavailable", back, textColor = "#757575", backgroundColor, imageSrc, description }) {
    return (
        <header className={styles.header}>
            <div className={styles['header-lead']} style={{
                    'backgroundColor': backgroundColor, 
                    'backgroundImage': `${imageSrc ? `url(${imageSrc})` : ''}`
                }}
            >
                <div>
                    <button onClick={back}>
                        <i style={{'color': textColor ?? 'var(--grey-900)'}} className="material-icons">&#xE5c4;</i>
                    </button>
                </div>
                {title && <h1 style={{'color': textColor ?? 'var(--grey-900)'}}>{title}</h1>}
                {subtitle && <p style={{'color': textColor ?? 'var(--grey-900)'}}>{subtitle}</p>}
            </div>
            {description && <div className={styles['header-description']}>
                {description}
            </div>}
        </header>
    );
}

function Item({ product, disabled, quantity, onAdd, onSubtract, unavailable }) {
    const outOfStock = product.defaultPack?.status !== 'ACTIVE' || unavailable;
    const isDisabled = disabled || outOfStock;
    const packSize = product.defaultPack.packSize
    return (
        <li>
            <img src={product.primaryImageSrc} alt={product.name} />
            <section>
                <header>{product.name}{packSize > 1 && ` ${packSize}pk`}</header>
                <div>
                    <span>{toCurrency(product.defaultPack.salePrice)}</span>
                    <span>{toCurrency(product.defaultPack.price)}</span>
                </div>
            </section>
            <div>
                <button 
                    onClick={onSubtract}
                    disabled={outOfStock} 
                    className={classNames(
                        (outOfStock && styles['disabled']),
                        !(!outOfStock && quantity > 0) && styles['hidden']
                    )}
                >
                    <i className="material-icons">&#xE15B;</i>
                </button>
                <span className={classNames(!(!outOfStock && quantity > 0) && styles['hidden'])}>{quantity}</span>
                <button 
                    onClick={onAdd}
                    disabled={isDisabled}
                    className={classNames(isDisabled && styles['disabled'], outOfStock && styles['out-of-stock'])}
                >
                    <i className="material-icons">&#xE145;</i>
                </button>
            </div>
        </li>
    );
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    currentUser: state.auth.currentUser,
    hasCart: state.cart.currentCart !== null,
    storePath: state.cart.currentCart?.storePath ?? null,
    cartId: state.cart?.currentCart?.id,
    currentStoreId: state.cart?.currentCart?.storeId ?? state.theme.defaultStoreId ?? config.defaultStoreId,
    addressZoneId: state.cart?.currentCart?.address?.zoneId ?? null,
    bundle: state.BUNDLE_BUILDER,
    isAddingBundle: state.cart.isAddingBundle
});

const mapDispatchToProps = (dispatch) => ({
    bundleActions: bindActionCreators(bundleRedux.actionCreators, dispatch),
    addBundleToCart: bindActionCreators(addBundleToCart, dispatch),
    displayAddressSelect: bindActionCreators(displayAddressSelect, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ssrComponent(BundleBuilder));