import 'core-js/features/weak-set';
import 'core-js/web/url-search-params';
import 'core-js/es/string/ends-with';
import 'core-js/es/object';
import React from 'react';
import { render, hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import Loadable from 'react-loadable';
import { SSRHelper } from './lib/ssrHelper';
import { BrowserRouter } from 'react-router-dom';
import createReduxStore from './store';

import App from './app/App';
import { enableNewRelic } from './lib/trackError';
import { enableAnalytics } from './lib/analytics';
import config from './app/config';
import themeConfig from 'app/themeConfig';
import { getDomainConfig } from 'lib/util/theme';
import { loadTheme } from 'app/resources/action/Theme';
import FontLoader from 'app/components/FontLoader';

if(process.env.NODE_ENV === "production"){
    // eslint-disable-next-line
    console.info = function (){};
    // eslint-disable-next-line
    console.log = function (){};
    // eslint-disable-next-line
    console.warn = function (){};
}

const domainConfig = getDomainConfig(themeConfig);

if (config.enableAnalytics !== false) {
    let segmentKey = config.segmentKey;

    if (domainConfig?.segmentKey && domainConfig?.segmentKey !== '') {
        segmentKey = domainConfig.segmentKey;
    }

    enableNewRelic({ licenseKey: config.nrLicenseKey, applicationID: config.nrApplicationID, releaseName: config.nrReleaseName, releaseId: config.nrReleaseId });
    enableAnalytics({ segmentKey });
}

// Create a store and get back itself and its history object
const store = createReduxStore();

const initializeApp = () => {
    
    // Running locally, we should run on a <ConnectedRouter /> rather than on a <StaticRouter /> like on the server
    // Let's also let React Frontload explicitly know we're not rendering on the server here
    const Application = (
        <Provider store={store}>
            <BrowserRouter>
                <SSRHelper isServer={false}>
                    <App />
                </SSRHelper>
            </BrowserRouter>
            {/* Default to Tipple */}
            <FontLoader siteId={domainConfig?.siteId ?? 1} />
        </Provider>
    );

    const root = document.getElementById('app-root');

    if (root.hasChildNodes() === true) {
        // If it's an SSR, we use hydrate to get fast page loads by just
        // attaching event listeners after the initial render
        Loadable.preloadReady().then(() => {
            hydrate(Application, root);
        });
    } else {
        // If we're not running on the server, just render like normal
        render(Application, root);
    }
};

const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    if (state.theme.name || state.theme.hasError) {
        unsubscribe();
        initializeApp();
    }
});

store.dispatch(loadTheme());
