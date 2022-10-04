import React, { Component } from 'react';
import Page from 'app/components/Page';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isServer } from 'store';

import classNames from 'classnames';

import { Redirect, Link } from 'react-router-dom';
import { redirectToNotFound } from 'lib/location';
import { decodeSearchParams } from 'lib/searchParams';

import Cookies from 'js-cookie';

import ProductCard, { ProductCardLoader } from 'app/components/product/ProductCard';
import Dropdown from 'app/components/Dropdown';
import AgeVerification from 'app/components/AgeVerification';
import CigaretteBanner from 'app/components/CigaretteBanner';

import _debounce from 'lib/debounce';
import { AnalyticsEvents } from 'lib/analytics';

import registerProductRedux from 'app/resources/api/product';
import registerCategoryRedux from 'app/resources/api/category';
import { displayLoginPopup } from 'app/resources/action/Login';
import config from 'app/config';

import { setLastProductCategorySlug, setSortOption, setSearchText, setLastCollectionId } from 'app/resources/action/Product';

import Spinner from 'app/components/Spinner';

import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer/AutoSizer.js';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller/WindowScroller.js';

import { getProductGridColumns, getProductCardHeight } from 'lib/util/responsive';

import styles from './Products.module.scss';

const productRedux = registerProductRedux('PRODUCTS', ['LIST']);
const categoryRedux = registerCategoryRedux('CATEGORY_FILTER', ['LIST']);

// TODO: Move this into constants somewhere
const sortOptions = [{
    label: 'Sort',
    value: 'favourite'
}, {
    label: 'Name: A - Z',
    value: 'productName'
}, {
    label: 'Name: Z - A',
    value: '-productName'
}, {
    label: 'Price: Low to High',
    value: 'price'
}, {
    label: 'Price: High To Low',
    value: '-price'
}];


const WindowedProductRow = (props) => {
    if (props.data.products.length === 0) {
        return <div></div>;
    }

    let index = (props.data.columnCount * (props.index));

    let rowProducts = [];
    for (var i = 0; i < props.data.columnCount; i++) {
        if (props?.isLoading) {
            if (i + index < 10) {
                rowProducts.push(
                    <div className={styles.product} key={i}>
                        <ProductCardLoader key={i + index} />
                    </div>
                );
            }
        } else {
            if (i + index < props.data.products.length) {
                rowProducts.push(
                    <div className={styles.product} key={i}><ProductCard hasCart={props.data.hasCart} key={i + index} product={props.data.products[i + index]} /></div>
                );
            }
        }
    }

    if (rowProducts.length === 0) {
        return <div />
    }

    return (
        <div className={classNames(styles.row, styles['product-row'])} style={props.style}>
            {rowProducts}
        </div>
    )
};

export class Products extends Component {

    analyticsFired = false;
    redirectedToAll = false;

    constructor(props) {
        super(props);

        this.state = {
            search: '',
            isOver18: false
        };

        // Only keep the previous searchText if the category is the same
        if ((props.lastProductCategorySlug && props.matchCategory === props.lastProductCategorySlug.category) || props.collectionId === props.lastCollectionId) {
            this.state.search = this.props.searchText;
        }

        this.refreshProductDataDB = _debounce(this.refreshProductData, 200);
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        if (this.props.locationState?.redirectedToAll) {
            this.redirectedToAll = true;
        }

        // Fire off page view event. This has to be done here instead of App.jsx because it depends on if collections exist.
        if (typeof window !== 'undefined' && !this.analyticsFired) {
            global.tippleAnalytics.trigger(AnalyticsEvents.app_pageview, { 'page': { 'path': 'custom-product-grid', }, 'data': { 'appUrl': this.props?.locationPathname } });
            this.analyticsFired = true;
        }

        const ageVerificationToken = Cookies.get(config.ageVerificationCookie);
        if (ageVerificationToken === 'verified' && !this.state.isOver18) {
            this.setState(() => ({
                isOver18: true
            }));
        }

        // If there's a logged in user, they are over 18 since you can't create an account if you are not.
        // This won't fire if the page is loading fresh, but frmo the back button the user will be set.
        if (this.props.currentUser && this.props.currentUser.id && !this.state.isOver18) {
            this.setState(() => ({
                isOver18: true
            }));
        }

        if (this.props.collectionId && this.props.collectionId !== this.props.lastCollectionId) {
            this.props.setLastCollectionId(this.props.collectionId);
        }

        const { searchReset, didRefresh } = this.shouldRefresh();

        if (this.props.categories.items && this.props.products && !didRefresh) {
            this.triggerAnalyticsViewed(searchReset);
        }
        this.refreshProductData();
    }

    componentWillUnmount() {
        this.props.setLastProductCategorySlug({
            category: this.props.matchCategory,
            search: this.state.search
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.categories && this.props.categories.items) {

            const currentCategory = this.getCurrentCategory();

            if (currentCategory.parentId === 0) {
                // If there is no collection home, we want the URL to be /all by default, since that's what we're showing. This makes 
                // the URL consistent with clicking 'All Red Wine' (for example) from the collection home page.
                if (!this.props.collectionId && this.props.locationPathname?.indexOf('all') === -1) {
                    const urlParts = this.props.locationPathname?.match(/(\/[a-zA-Z\-\&0-9]+)/gi);

                    if (urlParts[urlParts.length - 1] !== '/all') {
                        this.redirectedToAll = true;
                        this.props.history.replace(urlParts.concat(['/all']).join(''), { redirectedToAll: true });
                    }
                }
            }
        }

        if (prevProps.matchCategory !== this.props.matchCategory) {
            this.refreshProductData();

            if (this.props.matchCategory) {
                this.triggerAnalyticsFiltered();
            }
        }

        if (prevProps.collectionId !== this.props.collectionId || prevProps.collectionTitle !== this.props.collectionTitle) {

            if (this.props.collectionId && this.props.collectionId !== this.props.lastCollectionId) {
                this.props.setLastCollectionId(this.props.collectionId);
            }
            
            this.refreshProductData();
        }

        if (prevProps.lastCollectionId !== this.props.lastCollectionId) {
            this.props.productActions.clear();
            this.props.setSearchText('');

            this.setState(() => ({
                search: ''
            }), () => {
                this.refreshProductData();
            });
        }

        if (prevProps.sortOption !== this.props.sortOption) {
            this.refreshProductData();

            if (this.props.sortOption) {
                this.triggerAnalyticsFiltered();
            }
        }

        if (prevProps.productsIsRequesting && !this.props.productsIsRequesting && this.props.products?.length) {
            this.triggerAnalyticsViewed();
        }

        // If there's a logged in user, they are over 18 since you can't create an account if you are not.
        if (this.props.currentUser && this.props.currentUser.id && !this.state.isOver18) {
            this.setState(() => ({
                isOver18: true
            }));
        }

        if (prevProps.currentStoreId !== this.props.currentStoreId) {
            this.refreshProductData();
        }
    }

    getCurrentCategory = () => {
        const currentCategorySlug = this.props.matchCategory;

        let currentCategory = this.props.categories.items.find(category => category.slug === currentCategorySlug);

        if (!currentCategory) {
            currentCategory = {
                name: 'All',
                parentId: 0,
                id: 0
            };
        }

        return currentCategory;
    };

    triggerAnalyticsViewed(omitQuery = false) {
        if (this.props.categories.items && typeof window !== 'undefined') {
            const currentCategorySlug = this.props.matchCategory;

            const type = !omitQuery && this.props.searchText ? 'search result' : (this.props.collectionId ? 'collection' : 'category');
            const selectedSortOption = sortOptions.find(option => option.value === this.props.sortOption);
            const sort = this.props.sortOption && selectedSortOption ? selectedSortOption.label : null;

            let currentCategory = this.props.categories.items.find(category => {
                return category.slug === currentCategorySlug;
            });
            let countInactive = 0;
            if (this.props.products?.length > 0) {
                countInactive = this.props.products.filter(p => p.defaultPack?.status === 'INACTIVE').length;
            }

            global.tippleAnalytics.trigger(AnalyticsEvents.product_list_viewed, 
                {
                    category: currentCategory?.name,
                    list_id: !this.props.collectionId ? currentCategory?.id : null,
                    collection: this.props.collectionTitle || null,
                    collectionId: this.props.collectionId || null,
                    query: !omitQuery && this.props.searchText ? this.props.searchText : null,
                    sort,
                    type,
                    count: this.props.products?.length,
                    countInactive
                }
            );
        }
    }

    triggerAnalyticsFiltered() {
        if (this.props.categories.items && typeof window !== 'undefined') {
            const currentCategorySlug = this.props.matchCategory;

            const selectedSortOption = sortOptions.find(option => option.value === this.props.sortOption);
            const sort = this.props.sortOption && selectedSortOption ? selectedSortOption.label : null;
            const ascDesc = this.props.sortOption && selectedSortOption && selectedSortOption.value.indexOf('-') === 0 ? 'descending' : 'ascending';

            let currentCategory = this.props.categories.items.find(category => {
                return category.slug === currentCategorySlug;
            });
            global.tippleAnalytics.trigger(AnalyticsEvents.product_list_filtered, 
                {
                    category: currentCategory?.name,
                    collection: this.props.collectionTitle || null,
                    collectionId: this.props.collectionId || null,
                    filters: !this.props.collectionId ? [
                        {
                            type: 'category',
                            value: currentCategory?.id,
                            name: currentCategory?.name
                        }
                    ] : null,
                    sorts: [
                        {
                            type: sort,
                            value: ascDesc
                        }
                    ]
                }
            );
        }
    }

    shouldRefresh(searchReset = false) {
        const props = this.props;
        let shouldRefresh = !props.products;

        if (!props.categories || !props.categories.items) {
            props.categoryActions.list(props.auth, {
                fields: 'name,parentId,slug,tobacco',
                status: 'ACTIVE',
                limit: -1,
                sort: 'name'
            });
        }

        let searchText = props.searchText;

        if (props.products?.length > 0 && props.products[0].pricePacks?.length > 0 && props.products[0].pricePacks[0].storeId !== (props.currentCart && props.currentCart.storeId)) {
            props.productActions.clear();
            shouldRefresh = true;
        }

        // The last viewed category is different now, clear the current products
        if (props.lastProductCategorySlug && (props.lastProductCategorySlug.search !== searchText || props.matchCategory !== props.lastProductCategorySlug.category)) {
            props.productActions.clear();
            props.setSearchText('');
            searchReset = true;

            searchText = '';
            shouldRefresh = true;
        }

        // Always refresh for a collection, assuming the property has been passed.
        if ((props.collectionId !== undefined && props.lastCollectionId !== props.collectionId) || (props.lastCollectionId && props.collectionId === undefined)) {
            props.productActions.clear();
            props.setSearchText('');
            searchReset = true;

            searchText = '';
            shouldRefresh = true;
        }

        let paProps = {
            storeIds: props.currentStoreId,
            categorySlug: !props.collectionId ? props.matchCategory : null,
            collectionId: props.collectionId ? props.collectionId : null,
            inline: 'images{src},pricePacks',
            fields: 'name,slug,tobacco',
            requirePrice: true,
            sort: props.sortOption,
            limit: -1,
            includeOutOfStock: true
        };

        if (searchText !== '') {
            paProps.q = '*' + searchText + '*';
        }

        if (shouldRefresh) {
            props.productActions.list(props.auth, paProps);
        }

        return {
            searchReset,
            didRefresh: shouldRefresh
        };
    }

    refreshProductData = () => {

        this.props.productActions.list(this.props.auth, {
            storeIds: this.props.currentStoreId,
            categorySlug: !this.props.collectionId ? this.props.matchCategory : null,
            collectionId: this.props.collectionId ? this.props.collectionId : null,
            inline: 'images{src},pricePacks',
            fields: 'name,slug,tobacco',
            requirePrice: true,
            q: this.state.search ? '*' + this.state.search + '*' : this.state.search,
            sort: this.props.sortOption,
            limit: -1,
            includeOutOfStock: true
        });
    }

    focusSearch = () => {
        this.searchInput.focus();
    }

    clearSearch = (ev) => {
        ev.preventDefault();
        this.setState({
            search: ''
        }, () => {
            this.props.setSearchText('');
            this.refreshProductData();
        })
    }

    handleSearchInput = (ev) => {
        const searchInput = ev.target.value;

        window.scrollTo(0, 0);

        this.setState({
            search: searchInput
        }, () => {
            this.props.setSearchText(searchInput);
            this.refreshProductDataDB();
        });
    }

    handleSelectCategory = (val) => {

        if (this.props.matchCategory === val) {
            return;
        }

        let pathname = String(this.props.locationPathname);
        if (pathname.lastIndexOf('/') === pathname.length - 1) {
            pathname = pathname.slice(0, pathname.length - 2);
        }

        const parts = pathname.split('/').filter(part => part !== '');

        if (parts.length === 4) {
            parts.push(val);
            this.props.history.replace(String('/').concat(parts.join('/')));
        } else {
            this.props.history.replace(pathname.slice(0, pathname.lastIndexOf('/')).concat(`/${val}`));
        }
    }

    handleSelectSort = (val) => {
        this.props.setSortOption(val);
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
        const isLoading = props.productsIsRequesting;

        const products = [];
        let hasTobacco = false;

        if (props.products?.length > 0) {
            props.products
                .filter(product => !product.tobacco || isOver18)
                .forEach(product => {
                    products.push(product);
                }
            );

            hasTobacco = props.products.some(product => product.tobacco);
        }

        let categoryOptions = [{
            label: 'All',
            value: 'all'
        }];

        let isRootCategory = false;

        let parentCategory = {
            name: ''
        };

        let currentCategory = {
            name: ''
        };

        // Hard 404 detection and redirection if a category does not exist
        const cats = this.props.categories?.items || [];
        const isInCategories = cats.some(cat => cat.slug === props.matchCategory);
        const hasRequested = this.props.categories?.hasRequested ?? false;

        if (!isInCategories && hasRequested && props.matchCategory !== undefined) {
            if (isServer) {
                return <Redirect to={{
                    pathname: "/notfound",
                    state: {
                        code: 301
                    }
                }}/>
            } else {
                redirectToNotFound();
                return <></>;
            }
        }

        if (props.categories && props.categories.items) {
            currentCategory = this.getCurrentCategory();

            if (currentCategory.parentId === 0) {
                isRootCategory = true;
            }

            props.categories.items.forEach(category => {

                if (category.id === currentCategory.parentId) {
                    parentCategory = category;
                }

                if (category.parentId === (isRootCategory ? currentCategory.id : currentCategory.parentId)) {
                    categoryOptions.push({
                        label: category.name,
                        value: category.slug
                    });
                }
            });
        }

        if (parentCategory.id !== undefined) {
            categoryOptions[0].label = 'All ' + parentCategory.name;
            categoryOptions[0].value = 'all';
        } else {
            categoryOptions[0].label = 'All ' + (currentCategory.name === 'All' ? 'Products' : currentCategory.name);
        }

        const selectedCategory = isRootCategory ? 'all' : props.matchCategory;

        const gridTitle = this.props.collectionTitle || currentCategory?.name;
        const urlParts = this.props.locationPathname?.match(/(\/[a-zA-Z\-0-9]+)/gi);

        // If we're deep in a category or subcategory, we'll go back to the categories screen if there are no collections for a category
        // ie. this.redirectedToAll is true, otherwise it will go back to the base category ie. its collections home screen.
        // Otherwise, go up a level in the URL path.
        let backUrl = '';
        if (urlParts?.length === 5) {
            backUrl = this.redirectedToAll ? urlParts.slice(0, -2).concat('/categories').join('') : urlParts.slice(0, -1).join('');
        } else {
            backUrl = urlParts?.length === 4 && urlParts[3] !== '/categories' && !this.props.collectionId ? urlParts.slice(0, -1).concat('/categories').join('') : this.props.history?.pathname;
        }

        return (<Page className={styles.page} id="products" description="....">
            <div className={styles.container}>
                <div className={styles.title}>
                    <h1>{gridTitle}</h1>
                    <a className={styles.back} href={backUrl} onClick={(e) => { e.preventDefault(); this.props.history.push(backUrl); }}>
                        <i className="fa fa-chevron-left"></i>
                        Back
                    </a>
                </div>
                {hasTobacco && 
                    <div className="col-xs-12">
                        <CigaretteBanner />
                    </div>
                }
                <div className={classNames(styles.search, 'shop-list clearfix')}>
                    <div className="full-height">
                        <div className={styles.row}>
                            <div className={classNames(styles.col, styles['col-search'], !(categoryOptions.length > 1 && !this.props.collectionId) && styles['col-search-wide'])}>
                                <div className="product-search clearfix">
                                    <div className="col-xs-9 search-menu">
                                        <div className="row">
                                            <input id="productSearch" ref={(input) => { this.searchInput = input }} type="text" placeholder={`Search ${gridTitle}`} onChange={this.handleSearchInput} value={this.state.search} />
                                        </div>
                                    </div>
                                    <div className="col-xs-3 search-button">
                                        {this.state.search === '' && <i className="material-icons" onClick={this.focusSearch}>&#xE8B6;</i>}
                                        {this.state.search !== '' && <i className="material-icons" onClick={this.clearSearch}>&#xE14C;</i>}
                                    </div>
                                </div>
                            </div>
                            <div className={classNames(styles.col, styles['col-right'], !(categoryOptions.length > 1 && !this.props.collectionId) && styles['col-sort-narrow'])}>
                                <div className={styles.row}>
                                    {categoryOptions.length > 1 && !this.props.collectionId && 
                                        <div className={styles.col}>
                                            <Dropdown value={selectedCategory} className={classNames(styles.dropdown, 'tipple-select')} onClick={this.handleSelectCategory} options={categoryOptions} />
                                        </div>
                                    }
                                    <div className={classNames(styles.col, styles.stretch)}>
                                        {sortOptions.length > 0 && <Dropdown value={this.props.sortOption} className="tipple-select" onClick={this.handleSelectSort} options={sortOptions} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classNames(styles['search-results'], 'clearfix')}>
                    <div className={classNames(styles['product-list'], products?.length === 0 && styles['no-products'], 'products-list mb-24 col-xs-12')}>

                        <div className="row">
                            <div className="col-md-12 mb-16">
                                {this.state.search && <div>
                                    Found {products.length} result{products.length !== 1 ? 's' : ''} for "{this.state.search}" in {gridTitle}.&nbsp;
                                        {products.length === 0 && <a href="/categories" onClick={this.clearSearch}>Clear search</a>}
                                    {!isRootCategory && <span> Search all <Link to={(this.props.currentCart ? this.props.currentCart.storePath : config.defaultStorePath) + "/" + parentCategory.slug + '/all'}>{parentCategory.name}</Link></span>}
                                    {/* or {currentCategory.name !== 'All' && <span> Search <Link to={this.props.currentCart ? this.props.currentCart.storePath : config.defaultStorePath}>All</Link></span>} */}
                                </div>}
                            </div>
                            {props.productsHasRequested && products.length === 0 && <div className="col-md-12 mb-16">No products found</div>}
                            {props.productsIsRequesting &&
                                <div className={classNames(styles.loading, 'mb-24 col-md-12')}>
                                    <Spinner />
                                </div>}
                        </div>
                        <WindowScroller onScroll={this.handleScroll}>
                            {() => <div />}
                        </WindowScroller>

                        {typeof window !== 'undefined' ? <AutoSizer className={styles['auto-sizer']}>
                            {({ height, width }) => {
                                // Not needed anymore because of the loader?
                                if (height === 0 || width === 0 || products.length === 0) {//}
                                    return <div />
                                }

                                width = width + 24; // due to padding

                                const count = products?.length > 0 ? products?.length : 10;

                                const productColumns = getProductGridColumns(window.innerWidth);

                                // 24 is the margin-bottom on the padding.
                                // TODO: A better way to calculate this based on the css?
                                const itemHeight = getProductCardHeight(window.innerWidth, 24);

                                return <List className={classNames(styles['product-virtual-list'], 'row')}
                                    ref={this.handleListRef}
                                    itemData={{
                                        products: products,
                                        columnCount: productColumns,
                                        hasCart: !!this.props.currentCart
                                    }}
                                    overscanCount={4}
                                    height={window.innerHeight}
                                    itemCount={Math.ceil(count / productColumns)}
                                    itemSize={itemHeight}
                                    width={width}
                                >
                                    {props => (
                                        <WindowedProductRow {...props} isLoading={isLoading}/>
                                    )}
                                </List>;

                            }}
                        </AutoSizer> : <div className={styles['ssr-row']}>{products.map(product => <div className={styles.product}><ProductCard hasCart={!!this.props.currentCart} key={product.id} product={product} /></div>)}</div>}
                    </div>
                </div>
                {hasTobacco && !isOver18 && <AgeVerification onClickLogin={this.handleShowLogin} onSetOver18={this.handleOver18} />}
            </div>
        </Page>);
    }

    handleListRef = component => {
        this.list = component;
    };

    handleScroll = ({ scrollTop }) => {
        if (this.list) {
            this.list.scrollTo(scrollTop);
        }
    };
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    currentUser: state.auth.currentUser,
    currentCart: state.cart.currentCart,
    sortOption: state.product.sortOption,
    searchText: state.product.searchText,
    lastProductCategorySlug: state.product.lastProductCategorySlug,
    lastCollectionId: state.product?.lastCollectionId ?? null,
    products: state.PRODUCTS?.items ?? undefined,
    productsIsRequesting: state.PRODUCTS?.isRequesting ?? false,
    categories: state.CATEGORY_FILTER,
    currentStoreId: state.cart?.currentCart?.storeId ?? state.theme.defaultStoreId ?? config.defaultStoreId
});

const mapDispatchToProps = (dispatch) => ({
    displayLoginPopup: bindActionCreators(displayLoginPopup, dispatch),
    setSearchText: bindActionCreators(setSearchText, dispatch),
    setSortOption: bindActionCreators(setSortOption, dispatch),
    setLastProductCategorySlug: bindActionCreators(setLastProductCategorySlug, dispatch),
    setLastCollectionId: bindActionCreators(setLastCollectionId, dispatch),
    productActions: bindActionCreators(productRedux.actionCreators, dispatch),
    categoryActions: bindActionCreators(categoryRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);