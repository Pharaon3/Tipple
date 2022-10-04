import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ssrComponent } from 'lib/ssrHelper';
import config from 'app/config';

import registerHomeRedux, { getHomeCategories } from 'app/resources/api/home';
const homeRedux = registerHomeRedux('HOME', ['GET']);

class CategoryProductsLoader extends Component {

    static async getInitialProps(props) {
        if (props.currentStoreId && !props.hasRequestedCategories) {
            await props.homeActions.get('', props.auth, {
                includeBundles: true,
                storeId: props.currentStoreId
            });
        } else if (!props.requestingCategories) {
            props.homeActions.get('', props.auth, {
                includeBundles: true,
                storeId: props.currentStoreId
            });
        }
    }

    render() {
        const category = this.props.homeCategories.find(cat => cat.slug === this.props.matchCategory);
        const collectionItemCount = category?.collections?.reduce((ac, cur) => ac + cur?.items?.length, 0);

        if (this.props.requestingCategories && !this.props.collectionId) {
            return null;
        }
        
        if (this.props.collectionId) {
            return <this.props.collectionComponent {...this.props}/>;
        } else if (this.props.hasRequestedCategories) {
            // TODO: This has to be fixed, category component renders first and fires analytics. This happens because
            // the data hasRequestedCategories from the previous page, then fires off again here. But getInitialProps 
            // runs after the first render cycle. So the page renders based on the last data, and loads the old list.
            // This is OK but it shouldn't fire the event.
            if (category?.collections?.length > 0 && collectionItemCount > 0) {
                return <this.props.categoryComponent {...this.props} />;
            } else {
                return <this.props.collectionComponent {...this.props}/>;
            }
        } else {
            return <this.props.collectionComponent {...this.props}/>;
        }
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    homeCategories: getHomeCategories(state),
    requestingCategories: state.HOME?.isRequestingItem,
    hasRequestedCategories: state.HOME?.hasRequested,
    currentStoreId: state.cart?.currentCart?.storeId ?? state.theme.defaultStoreId ?? config.defaultStoreId
});

const mapDispatchToProps = (dispatch) => ({
    homeActions: bindActionCreators(homeRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ssrComponent(CategoryProductsLoader));