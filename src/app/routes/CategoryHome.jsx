import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Page from 'app/components/Page';

import SubCategorySlider from 'app/components/SubCategorySlider';

import registerProductRedux from 'app/resources/api/product';
import registerCategoryRedux from 'app/resources/api/category';
import registerHomeRedux from 'app/resources/api/home';
import { displayLoginPopup } from 'app/resources/action/Login';

import Collections from 'app/components/Collections';
import { AnalyticsEvents } from 'lib/analytics';

import { setLastProductCategorySlug, setSortOption, setSearchText } from 'app/resources/action/Product';

import styles from './CategoryHome.module.scss';

const productRedux = registerProductRedux('PRODUCTS', ['LIST']);
const categoryRedux = registerCategoryRedux('CATEGORY_FILTER', ['LIST']);
const homeRedux = registerHomeRedux('HOME', ['GET']);

class CategoryHome extends Component {

    analyticsFired = false;

    componentDidMount() {
        window.scrollTo(0, 0);

        // Fire off page view event. This has to be done here instead of App.jsx because it depends on if collections exist.
        if (typeof window !== 'undefined' && !this.analyticsFired) {
            global.tippleAnalytics.trigger(AnalyticsEvents.app_pageview, { 'page': { 'path': 'custom-category', }, 'data': { 'appUrl': this.props?.locationPathname } });
            this.analyticsFired = true;
            this.triggerAnalyticsViewed();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentStoreId !== this.props.currentStoreId) {
            this.props.homeActions.get('', this.props.auth, {
                includeBundles: true,
                storeId: this.props.currentStoreId
            });
        }
    }

    triggerAnalyticsViewed() {
        if (this.props.homeCategories && typeof window !== 'undefined') {
            const categorySlug = this.props?.match?.params?.category;
            const category = this.props.homeCategories.find(cat => cat.slug === categorySlug);

            global.tippleAnalytics.trigger(AnalyticsEvents.category_viewed, 
                {
                    id: category?.id,
                    name: category?.name,
                    slug: category?.slug,
                    collections: category?.collections.map(collection => ({
                        id: collection.id,
                        name: collection.name,
                        type: collection.displayType,
                        count: collection.items?.length
                    }))
                }
            );
        }
    }

    render() {
        const category = this.props.homeCategories.find(cat => cat.slug === this.props.matchCategory);

        const viewAll = {
            id: 'view-all',
            slug: 'all',
            name: `All ${category?.name}`,
            backgroundColor: category?.backgroundColor,
            imageSvgSrc: category?.imageSvgSrc
        };
        let subcats = this.props.homeCategories.filter(cat => cat.parentId === category?.id).map(cat => ({
            ...cat,
            backgroundColor: !cat.backgroundColor ? category.backgroundColor : cat.backgroundColor,
            imageSvgSrc: !cat.imageSvgSrc ? category.imageSvgSrc : cat.imageSvgSrc
        })).sort((a, b) => {
            if (!a.sort) {
                return 1;
            }
            if (!b.sort) {
                return -1;
            }

            if (a.sort < b.sort) {
                return -1;
            }
            
            if (b.sort < a.sort) {
                return 1;
            }

            return 0;
        });

        if (subcats?.length > 0) {
            subcats = [viewAll].concat(subcats);
        }

        const urlParts = this.props.locationPathname?.match(/(\/[a-zA-Z\-0-9]+)/gi);
        const backUrl = urlParts?.length === 4 ? urlParts.slice(0, -1).concat('/categories').join('') : this.props.history?.pathname;
        
        return (
            <Page id="products" description="....">
                <div className={styles.container}>
                    <section className={styles.title}>
                        <h1>{category?.name}</h1>
                        <a className={styles.back} href={backUrl} onClick={(e) => { e.preventDefault(); this.props.history.push(backUrl); }}>
                            <i className="fa fa-chevron-left"/>
                            Back
                        </a>
                    </section>
                    <section className={styles.categories}>
                        <SubCategorySlider
                            subcats={subcats}
                            homeCategories={this.props.homeCategories}
                        />
                    </section>
                    {category?.collections?.length > 0 && <section className={styles.collections}>
                        <Collections 
                            collections={category?.collections} 
                            analyticsProps={{
                                from: 'Category'
                            }} 
                        />
                    </section>}
                </div>
            </Page>
        );
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    currentUser: state.auth.currentUser,
    currentCart: state.cart.currentCart,
    sortOption: state.product.sortOption,
    searchText: state.product.searchText,
    lastProductCategorySlug: state.product.lastProductCategorySlug,
    homeCategories: state.HOME?.item?.categories ?? [],
    requestingCategories: state.HOME?.isRequestingItem,
    hasRequestedCategories: state.HOME?.hasRequested,
    currentStoreId: state.cart?.currentCart?.storeId ?? state.theme.defaultStoreId
});

const mapDispatchToProps = (dispatch) => ({
    displayLoginPopup,
    setSearchText,
    setSortOption,
    setLastProductCategorySlug,
    productActions: bindActionCreators(productRedux.actionCreators, dispatch),
    categoryActions: bindActionCreators(categoryRedux.actionCreators, dispatch),
    homeActions: bindActionCreators(homeRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryHome);