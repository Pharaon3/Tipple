import React, { Component } from 'react';
import Page from 'app/components/Page';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ssrComponent } from 'lib/ssrHelper';

import CategoryBadge from 'app/components/CategoryBadge';
import Spinner from 'app/components/Spinner';
import Collections from 'app/components/Collections';
import config from 'app/config';
import registerHomeRedux from 'app/resources/api/home';
import { AnalyticsEvents } from 'lib/analytics';
import { decodeSearchParams } from 'lib/searchParams';
import { displayAddressSelect } from 'app/resources/action/Address';

import styles from './Categories.module.scss';

const homeRedux = registerHomeRedux('HOME', ['GET']);

class Categories extends Component {

    constructor() {
        super();

        this.state = {

        };

        this.displayedAddress = false;
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    static async getInitialProps(props) {
        const storeId = props.cart ? (props.cart.storeId ? props.cart.storeId : props.currentStoreId) : props.currentStoreId;
        if (props.cart && config.showBanners) {
            await props.bannerActions.list(props.auth, {
                limit: -1,
                fields: 'title,link,backgroundImage,backgroundColor',
                storeId: storeId + ",NULL",
                sort: 'sequence'
            });
        }

        if (props.currentStoreId && !props.hasRequestedCategories) {
            await props.homeActions.get('', props.auth, {
                includeBundles: true,
                storeId: props.currentStoreId
            });
        } else {
            props.homeActions.get('', props.auth, {
                includeBundles: true,
                storeId: props.currentStoreId
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.requestingCategories && !this.props.requestingCategories) {
            this.triggerAnalyticsViewed();
        }

        let sp = decodeSearchParams(this.props.location.search);

        if (!this.displayedAddress && sp.addressIfNone === 'y' && !this.props.cart?.address?.zoneId && !this.props.addressSelectShowing) {
            this.props.displayAddressSelect();
            this.displayedAddress = true;
        }

        if (prevProps.currentStoreId !== this.props.currentStoreId) {
            this.getCategories();
        }
    }

    getCategories = () => {
        this.props.homeActions.get('', this.props.auth, {
            includeBundles: true,
            storeId: this.props.currentStoreId
        });
    };

    triggerAnalyticsViewed() {
        if (this.props.collections && typeof window !== 'undefined') {
            global.tippleAnalytics.trigger(AnalyticsEvents.home_viewed, 
                {
                    collections: this.props.collections.map(collection => ({
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
        const { homeCategories, requestingCategories, hasRequestedCategories, collections } = this.props;
        const categories = homeCategories?.sort((a, b) => {
            if (a.sort < b.sort) {
                return -1;
            }

            if (a.sort > b.sort) {
                return 1;
            }

            return 0;
        });

        return <Page id="categories" description="....">
            <div className={styles.container}>
                {requestingCategories && !hasRequestedCategories && categories.length === 0 && <Spinner />}
                {categories.length > 0 && <>
                    <section className={styles.categories}>
                        {categories?.map(cat => 
                            <CategoryBadge 
                                className={styles.category} 
                                key={cat.id} 
                                category={cat} 
                                analyticsProps={{
                                    from: 'Home'
                                }} 
                                to={`${this.props.history?.location?.pathname?.replace('/categories', '')}${this.props.history?.location?.pathname?.lastIndexOf('/') === this.props.history?.location?.pathname.length - 1 ? '' : '/'}${cat.slug}`}
                            />
                        )}
                    </section>
                    {/* <ContentFooter /> */}
                </>}
                {collections.length > 0 && <section className={styles.collections}>
                        <Collections 
                            collections={collections} 
                            analyticsProps={{
                                from: 'Home'
                            }}
                            to={`${this.props.history?.location?.pathname?.replace('/categories', '/')}categories`}
                        />
                    </section>
                }
            </div>
        </Page>
    };
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    cart: state.cart.currentCart,
    searchParams: state.searchParams,
    requestingCategories: state.HOME?.isRequestingItem,
    hasRequestedCategories: state.HOME?.hasRequested,
    homeCategories: (state.HOME?.item?.categories ?? []).filter(cat => cat.status === 'ACTIVE' && cat.visibleAtHome),
    collections: state.HOME?.item?.collections ?? [],
    currentStoreId: state.cart?.currentCart?.storeId ?? state.theme?.defaultStoreId ?? config.defaultStoreId,
    addressSelectShowing: state.address?.displayAddressSelect ?? false
});

const mapDispatchToProps = (dispatch) => ({
    homeActions: bindActionCreators(homeRedux.actionCreators, dispatch),
    displayAddressSelect: bindActionCreators(displayAddressSelect, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ssrComponent(Categories));