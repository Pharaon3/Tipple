import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { ssrComponent } from 'lib/ssrHelper';

import Page from 'app/components/Page';
import TippleHomePage from 'app/components/homepage/Tipple';

import { AnalyticsEvents } from '../../lib/analytics';

import styles from './Homepage.module.scss';

const loadingError = (props) => {
    if (props.error) {
        throw new Error("CHUNK FAILED");
    }
    return null;
};

const templates = {
    default: TippleHomePage,
    '7Eleven': Loadable({
        loader: () => import(/* webpackChunkName: "7ElevenHomepage" */ 'app/components/homepage/templates/7Eleven'),
        loading: loadingError,
        modules: ['7ElevenHomepage'],
        webpack: () => [require.resolveWeak('app/components/homepage/templates/7Eleven')] // Prevents white flash
    }),
    'Railway': Loadable({
        loader: () => import(/* webpackChunkName: "RailwayHomepage" */ 'app/components/homepage/templates/Railway'),
        loading: loadingError,
        modules: ['RailwayHomepage'],
        webpack: () => [require.resolveWeak('app/components/homepage/templates/Railway')] // Prevents white flash
    }),
    'YouFoodz': Loadable({
        loader: () => import(/* webpackChunkName: "YouFoodzHomepage" */ 'app/components/homepage/templates/YouFoodz'),
        loading: loadingError,
        modules: ['YouFoodzHomepage'],
        webpack: () => [require.resolveWeak('app/components/homepage/templates/YouFoodz')] // Prevents white flash
    }),
    'TippleMarketplace': Loadable({
        loader: () => import(/* webpackChunkName: "MarketplaceHomepage" */ 'app/components/homepage/templates/TippleMarketplace'),
        loading: loadingError,
        modules: ['MarketplaceHomepage'],
        webpack: () => [require.resolveWeak('app/components/homepage/templates/TippleMarketplace')] // Prevents white flash
    }),
    'Wotapopup': Loadable({
        loader: () => import(/* webpackChunkName: "Wotapopup" */ 'app/components/homepage/templates/Wotapopup'),
        loading: loadingError,
        modules: ['Wotapopup'],
        webpack: () => [require.resolveWeak('app/components/homepage/templates/Wotapopup')] // Prevents white flash
    })
};

class Home extends Component {

    eventFired = false;

    static async getInitialProps(props) {

    }

    render() {
        
        const { splitFeaturesRead, splitTimedOut } = this.props;
        let Homepage = null;
        let newHome = false;

        // Fire the page view here, once split is ready
        if (typeof window !== 'undefined' && !this.eventFired && splitFeaturesRead) {
            global.tippleAnalytics.trigger(AnalyticsEvents.app_pageview, { 'page': { 'path': '/', }, 'data': { 'appUrl': '/' } });
            this.eventFired = true;
        }

        const componentName = this.props?.theme?.homeComponent ?? 'default';
        Homepage = templates[componentName] ?? templates['default'];

        return (
            <Page id="homepage" className={newHome && !splitTimedOut ? styles.home : null}>
                <Homepage history={this.props.history} />
            </Page>
        )
    }

}

const mapStateToProps = ({ features: { flags: featureFlags, featuresRead, timedOut }, theme }) => ({
    theme,
    featureFlags,
    splitFeaturesRead: featuresRead,
    splitTimedOut: timedOut
});

export default connect(mapStateToProps)(ssrComponent(Home));