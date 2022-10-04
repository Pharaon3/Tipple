import React, { Component } from 'react';
import Page from 'app/components/Page';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ssrComponent } from 'lib/ssrHelper';
import { Redirect, Link } from 'react-router-dom';
import classNames from 'classnames';

import formatCurrency from 'lib/currency';
import { isServer } from 'store';
import { redirectToNotFound } from 'lib/location';
import { decodeSearchParams } from 'lib/searchParams';
import { imageUrl } from 'lib/util/image';
import { productUrlFromSlug } from 'lib/util/product';

import Cookies from 'js-cookie';

import Spinner from 'app/components/Spinner';
import PrivacyPolicy from 'app/components/PrivacyPolicy';
import AgeVerification from 'app/components/AgeVerification';
import VariantGroup from 'app/components/product/VariantGroup';
import PackQtySelector from 'app/components/product/PackQtySelector';
import AddToCartButtons from 'app/components/product/AddToCartButtons';

import config from 'app/config';
import { displayAddressSelect } from 'app/resources/action/Address';

import registerProductRedux from 'app/resources/api/product';
import { displayLoginPopup } from 'app/resources/action/Login';
import { AnalyticsEvents } from 'lib/analytics';
import { addToCart } from 'app/resources/action/Cart';

import styles from './ProductDetails.module.scss';

const productRedux = registerProductRedux('PRODUCT_DETAILS', ['GET']);

const VARIANT_GROUP_TYPES_ALLOWED = ['SINGLE', 'ADDON'];

class ProductDetails extends Component {

    constructor() {
        super();

        this.state = {
            selectedPackSize: null,
            quantity: 1,
            isOver18: false,
            addTotal: 0,    // Total $ per item including variants
            variantsTotal: 0,   // Total $ of variants only (not including base price)
            validVariantGroups: []
        };

        // Keep track of this quietly, we don't need re-renders.
        this.itemQuantities = [];
        this.itemQuantitiesInitialised = false;
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        const ageVerificationToken = Cookies.get(config.ageVerificationCookie);
        if (ageVerificationToken === 'verified' && !this.state.isOver18) {
            this.setState(() => ({
                isOver18: true
            }));
        }

        let sp = decodeSearchParams(this.props.location.search);
        let packSize = sp?.packSize;

        if (packSize && String(packSize) !== '') {
            this.setState(() => ({
                selectedPackSize: parseInt(packSize, 10)
            }));
        }

        if (this.props.product?.item) {
            this.initItemQuantities();
        }
    }

    componentWillUnmount() {
        this.props.productActions.clear();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (!prevProps.product.item && this.props.product.item || prevProps.product?.item?.id !== this.props.product?.item?.id) {
            let currentSelectedPack = this.getCurrentProductPack(this.props.product.item);
            let product_viewed_data = {
                product: { 
                    ...this.props.product.item, 
                    ...currentSelectedPack,
                    url: productUrlFromSlug(this.props.product?.item?.slug),
                    status: currentSelectedPack?.status
                },
                variant_groups: this.props.product.item?.variants ? this.props.product.item.variants.reduce((ac, cur) => ac.concat(cur?.name), []) : null
            }
            global.tippleAnalytics.trigger(AnalyticsEvents.product_viewed, product_viewed_data);

            this.setState(() => ({
                addTotal: (this.getProductPrice(this.getCurrentProductPack(this.props.product.item))) * this.state.quantity,
                selectedPackSize: currentSelectedPack?.packSize ?? null
            }));

            this.itemQuantitiesInitialised = false;
            this.initItemQuantities();
        }

        if (prevProps.match.params.slug !== this.props.match.params.slug) {
            await ProductDetails.getProduct(this.props);
        }

        if (!prevProps.hasCart && this.props.hasCart) {
            await ProductDetails.getProduct(this.props);
        }

        if (this.props.currentUser && this.props.currentUser.id && !this.state.isOver18) {
            this.setState(() => ({
                isOver18: true
            }));
        }

        if (prevProps.currentStoreId !== this.props.currentStoreId) {
            ProductDetails.getProduct(this.props);
        }
    }

    static async getInitialProps(props) {

        if (props.product.item !== undefined && props.product.item !== null) {
            return;
        }

        return ProductDetails.getProduct(props);
    }

    static async getProduct(props) {
        return await props.productActions.getSingle(props.auth, {
            ppStoreIds: props.currentStoreId,
            inline: 'images{src},pricePacks,variants',
            fields: 'name,slug,description,tobacco,variants',
            slug: props.match.params.slug,
            includeOutOfStock: true
        });
    }

    /**
     * Initialise the itemQuantities array with an object representing the state of each variant group item.
     * This data is used to submit variants to the API.
     * @returns 
     */
    initItemQuantities = () => {
        if (this.itemQuantitiesInitialised) {
            return;
        }

        const allVariantGroupItems = [];

        if (this.props.product.item?.variants?.length > 0) {
            this.props.product.item.variants.forEach(variantGroup => {
                (variantGroup.items ?? []).forEach(item => {
                    allVariantGroupItems.push({
                        variantGroupId: item?.variantGroupId,
                        variantGroupItemId: item?.variantGroupItemId,
                        quantity: 0,
                        price: item?.price
                    });
                });
            });

            // Set validity also.
            const notRequiredGroups = this.props.product?.item?.variants?.filter(variantGroup => variantGroup?.minRequired === 0 || !VARIANT_GROUP_TYPES_ALLOWED.includes(variantGroup?.displayType));
            this.setState(() => ({
                validVariantGroups: notRequiredGroups.map(variantGroup => variantGroup?.variantGroupId)
            }));
        }

        this.itemQuantities = allVariantGroupItems;
        this.itemQuantitiesInitialised = true;
    };

    getVariantGroupItemQuantities = variantGroupId => this.itemQuantities.filter(itemQty => itemQty?.variantGroupId === variantGroupId).reduce((itemQtys, itemQty) => ({
        ...itemQtys,
        [itemQty?.variantGroupItemId]: itemQty?.quantity
    }), {});

    handlePackSelected = (selectedPackSize) => {
        this.setState(() => ({
            selectedPackSize,
            addTotal: (this.getProductPrice({ packSize: selectedPackSize }) + this.state.variantsTotal) * this.state.quantity
        }));
    };

    handleQuantityChanged = quantity => {
        this.setState(() => ({
            quantity,
            addTotal: (this.getProductPrice(this.getCurrentProductPack(this.props.product.item)) + this.state.variantsTotal) * quantity
        }));
    };

    /**
     * Get the current total quantities for a variant group.
     * @param {*} itemQuantities 
     * @returns {Number}
     */
    getTotalGroupQuantity = (itemQuantities) => Object.keys(itemQuantities).reduce((ac, itemKey) => ac + itemQuantities[itemKey], 0);

    /**
     * Set the quantity for an item in a variant group. We need to loop through 
     * @param {*} variantGroupId 
     * @param {*} variantGroupItemId 
     * @param {*} quantity 
     * @param {*} skipAnalytics 
     */
    setItemQuantity = (variantGroupId, variantGroupItemId, quantity, skipAnalytics = false) => {
        let addTotal = 0;

        this.itemQuantities.forEach((itemQty, index) => {
            // Update quantity only if this is our item. Fire off analytics also.
            if (itemQty.variantGroupId === variantGroupId && itemQty.variantGroupItemId === variantGroupItemId) {
                this.itemQuantities[index] = {
                    ...itemQty,
                    quantity
                };

                const totalSelected = this.getTotalGroupQuantity(this.getVariantGroupItemQuantities(variantGroupId));
                const product = this.props.product?.item;
                const variantGroup = product?.variants?.find(variantGroup => variantGroup?.variantGroupId === variantGroupId);

                this.setVariantGroupValidity(variantGroup?.variantGroupId, totalSelected >= variantGroup?.minRequired && totalSelected <= variantGroup?.maxRequired);

                if (typeof window !== 'undefined' && !skipAnalytics) {
                    const item = variantGroup.items?.find(variantGroupItem => variantGroupItem?.variantGroupItemId === variantGroupItemId);

                    global.tippleAnalytics.trigger(AnalyticsEvents.product_variant_selected, {
                        name: variantGroup?.name,
                        item_name: item?.name,
                        item_id: item?.productId,
                        product_name: product?.name,
                        product_id: product?.id,
                        type: variantGroup?.displayType,
                        quantity,
                        price: item?.price ?? 0
                    });
                }
            }

            if (this.itemQuantities[index].quantity > 0) {
                addTotal += this.itemQuantities[index].quantity * this.itemQuantities[index].price;
            }
        });

        this.setState(() => ({
            addTotal: (this.getProductPrice(this.getCurrentProductPack(this.props.product.item)) + addTotal) * this.state.quantity,
            variantsTotal: addTotal
        }));
    };

    /**
     * Maintain an array of valid variant groups to track validity for disabling the add button.
     * @param {*} variantGroupId 
     * @param {*} isValid 
     */
    setVariantGroupValidity = (variantGroupId, isValid) => {
        this.setState(() => ({
            validVariantGroups: [
                ...this.state.validVariantGroups.filter(id => id !== variantGroupId).concat(isValid ? [variantGroupId] : [])
            ]
        }));
    };

    addToCart = () => {
        const product = this.props.product.item;
        const currentSelectedPack = this.getCurrentProductPack(product);

        const pp = product.pricePacks?.find(p => p.packSize === currentSelectedPack.packSize);
        const ppId = pp?.productPackId;
        const variantsToAdd = this.itemQuantities.filter(itemQty => itemQty.quantity > 0);
        const analyticsVariants = variantsToAdd?.map(variant => {
            const product = this.props.product?.item;
            const variantGroup = product?.variants?.find(variantGroup => variantGroup?.variantGroupId === variant?.variantGroupId);
            const item = variantGroup.items?.find(variantGroupItem => variantGroupItem?.variantGroupItemId === variant?.variantGroupItemId);

            return {
                group_name: variantGroup?.name,
                product_name: item?.name,
                product_id: item?.productId,
                pack_size: item?.packSize,
                quantity: variant?.quantity,
                price: variant?.price
            };
        });

        global.tippleAnalytics.trigger(AnalyticsEvents.add_to_cart, {
            product,
            addToCart: {
                packSize: currentSelectedPack.packSize,     //this.props. //this.props.packSize,
                quantity: this.state.quantity,
                cart_id: this.props.currentCart.id,
                price: pp.salePrice > 0 ? pp.salePrice : pp.price
            },
            variants: analyticsVariants
        });

        this.props.addToCart(product.id, ppId, this.state.quantity, currentSelectedPack.packSize, this.getProductPrice(currentSelectedPack), this.props.currentCart.id, product.name, 0, variantsToAdd?.length > 0 ? true : false, this.props.auth, variantsToAdd, analyticsVariants);
    };

    getProductPrice = selectedPack => {
        const product = this.props.product.item;
        const pp = product.pricePacks?.find(p => p.packSize === selectedPack.packSize);

        return pp?.salePrice > 0 ? pp?.salePrice : pp?.price;
    };

    getCurrentProductPack(product) {
        if (product?.defaultPack && !this.state.selectedPackSize) {
            return product.defaultPack;
        }

        let currentSelectedPack = (product?.pricePacks || []).find(pp => {
            return pp.packSize === this.state.selectedPackSize;
        });

        if (currentSelectedPack === undefined) {
            currentSelectedPack = (product?.pricePacks || []).find(pp => {
                return pp.initial;
            });
        }

        if (currentSelectedPack === undefined && product.pricePacks?.length) {
            currentSelectedPack = product.pricePacks[0];
        }
        return currentSelectedPack;
    }

    handleOver18 = isOver18 => {
        this.setState(() => ({
            isOver18
        }));
    };

    handleShowLogin = () => {
        this.props.displayLoginPopup();
    };

    render() {
        const props = this.props;
        const { isOver18 } = this.state;

        let product = props.product.item;
        if (!product && props.products && props.products.items) {
            props.products.items.forEach(p => {
                if (p.slug === props.match.params.slug) {
                    product = p;
                    return;
                }
            })
        }

        const hasTobacco = product && product.tobacco;

        let productDiv = null;

        if (product) {
            const currentSelectedPack = this.getCurrentProductPack(product);

            const outOfStock = currentSelectedPack?.status === 'INACTIVE';

            const salePrice = currentSelectedPack ? currentSelectedPack.salePrice : 0;
            const price = currentSelectedPack ? currentSelectedPack.price : 0;

            const isSalePrice = salePrice !== 0;

            const validGroups = product.variants?.length > 0 ? product.variants.filter(variantGroup => this.state.validVariantGroups.indexOf(variantGroup?.variantGroupId) !== -1) : [];
            const variantGroupsValid = !product.variants || validGroups?.length === product.variants?.length;

            productDiv = <div className={styles.product}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-offset-2 col-sm-8 clearfix hidden-xs hidden-sm">
                            <div className="row">
                                <div className="col-sm-4 mb-24">
                                    <button className="btn btn-primary btn-block bn-lg btn-cancel" onClick={this.props.history.goBack}>&lt; Back</button>
                                </div>
                                <div className="col-sm-8"></div>
                            </div>
                        </div>
                        <div className="content-wrapper mt-0">
                            <div className="details mb-24">
                                {this.state.isLoading && <Spinner />}
                                {!this.state.isLoading && <div>
                                    <div className="container">
                                        <div className="content-container">
                                            <div className="row">
                                                <div className="product-holder content mb-24 pb-24 col-xs-12 col-sm-offset-2 col-sm-8 content-height">
                                                    <div className="row">
                                                        <div className="col-md-6 mb-24 col-xs-6 col-xs-offset-3 col-md-offset-0">
                                                            <div className="row">
                                                                <div>
                                                                    <div className="text-center">
                                                                        <img alt={product.name} className="img-responsive" src={imageUrl(product?.primaryImageSrc, 'products/')}
                                                                            onError={(e) => {
                                                                                if (e.target.src !== '/static/assets/img/products/default-product.png') {
                                                                                    e.target.src = '/static/assets/img/products/default-product.png'
                                                                                }
                                                                            }}></img>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-24">
                                                            <div className="row">
                                                                <div className={classNames(styles.pricing, 'col-md-12 mb-24 col-xs-12')}>
                                                                    <h1 className={styles.name}>{product.name}</h1>
                                                                    <span>
                                                                        {this.props.hasCart && currentSelectedPack && !isSalePrice && <span className="price">{formatCurrency('$', price, 0, 2)}</span>}
                                                                        {this.props.hasCart && currentSelectedPack && isSalePrice && <span className="special">{formatCurrency('$', salePrice, 0, 2)}</span>}
                                                                        {this.props.hasCart && currentSelectedPack && isSalePrice && <span className="strike">{formatCurrency('$', price, 0, 2)}</span>}
                                                                    </span>
                                                                </div>
                                                                <div className="col-xs-12">
                                                                    <p dangerouslySetInnerHTML={{
                                                                        __html: product.description
                                                                    }}></p>
                                                                </div>
                                                                <div className="col-xs-12">
                                                                    {this.props.hasCart && currentSelectedPack && <PackQtySelector 
                                                                        onPackSelected={this.handlePackSelected}
                                                                        product={product}
                                                                        packSize={this.state.selectedPackSize}
                                                                        onChangeQuantity={this.handleQuantityChanged}
                                                                    />}
                                                                </div>
                                                                <div className="col-xs-12">
                                                                    {this.props.hasCart && currentSelectedPack && !outOfStock && product?.variants?.filter(variantGroup => VARIANT_GROUP_TYPES_ALLOWED.includes(variantGroup?.displayType)).map(variantGroup => 
                                                                        <VariantGroup 
                                                                            variantGroup={variantGroup} 
                                                                            onSetItemQuantity={this.setItemQuantity} 
                                                                            isValid={this.state.validVariantGroups.indexOf(variantGroup?.variantGroupId) !== -1}
                                                                            key={variantGroup?.variantGroupId}
                                                                            itemQuantities={this.getVariantGroupItemQuantities(variantGroup?.variantGroupId)}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="col-xs-12">
                                                                    {this.props.addToCartError && <div className={styles.error}>{this.props.addToCartError}</div>}
                                                                    {!this.props.hasCart && <button onClick={this.props.displayAddressSelect} className="mt-24 btn btn-primary btn-block">Check Price</button>}
                                                                    {this.props.hasCart && !currentSelectedPack && <button className="mt-24 btn btn-primary btn-block" disabled="disabled">Unavailable Near You</button>}
                                                                    {this.props.hasCart && currentSelectedPack && <AddToCartButtons product={product} outOfStock={outOfStock} isDisabled={!variantGroupsValid} variantGroupsValid={variantGroupsValid} onAddToCart={this.addToCart} addTotal={this.state.addTotal} />}
                                                                    {this.props.hasCart && <Link className={styles.noUnderlineOnHover} to="/cart"><button className="btn btn-primary btn-block bn-lg btn-cancel hidden-xs hidden-sm mt-10">Checkout1</button></Link>}
                                                                    <PrivacyPolicy section='product' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        // Hard 404 detection and redirection if a product does not exist
        if (!product && props.product.hasRequested === true) {
            if (isServer) {
                return <Redirect to={{
                    pathname: '/notfound',
                    state: {
                        code: 301
                    }
                }}/>;
            } else {
                redirectToNotFound();
                return <React.Fragment />;
            }
        }

        return <Page id="product-details" title={props.product.item && "Tipple - " + props.product.item.name + " delivered fast"} description="....">
            {hasTobacco && !isOver18 && 
                <div className={classNames(styles.dob, 'container')}>
                    <AgeVerification onClickLogin={this.handleShowLogin} onSetOver18={this.handleOver18} />
                </div>
            }
            {(!hasTobacco || (hasTobacco && isOver18)) && 
              <React.Fragment>{productDiv}</React.Fragment>
            }
        </Page>
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    currentUser: state.auth.currentUser,
    currentCart: state.cart.currentCart,
    hasCart: state.cart.currentCart !== null,
    currentStoreId: state.cart?.currentCart?.storeId ?? state.theme.defaultStoreId ?? config.defaultStoreId,
    searchParams: state.searchParams,
    products: state.PRODUCTS,
    product: state.PRODUCT_DETAILS,
    addToCartError: state.cart.errorAdd ?? null
});

const mapDispatchToProps = (dispatch) => ({
    displayLoginPopup: bindActionCreators(displayLoginPopup, dispatch),
    productActions: bindActionCreators(productRedux.actionCreators, dispatch),
    displayAddressSelect: bindActionCreators(displayAddressSelect, dispatch),
    addToCart: bindActionCreators(addToCart, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ssrComponent(ProductDetails));