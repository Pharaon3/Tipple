// Express requirements
import path from 'path';
import fs from 'fs';

// React requirements
import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { SSRHelper, ssrHelperServerRender } from '../src/lib/ssrHelper';
import Loadable from 'react-loadable';

// Our store, entrypoint, and manifest
import createReduxStore from '../src/store';
import App from '../src/app/App';
import manifest from '../build/asset-manifest.json';

import config from 'app/config';

// Some optional Redux functions related to user authentication
import { setGeocodedAddress } from '../src/app/resources/action/Address';
import { verifyToken } from '../src/app/resources/action/VerifyToken';
import { verifyCart } from '../src/app/resources/action/VerifyCart';
import { loadTheme } from '../src/app/resources/action/Theme';

export default async (req, res) => {

    const hostname = req.hostname || req.headers.hostname;

    const injectHTML = (data, { html, title, meta, body, scripts, state }) => {
        data = data.replace('<html>', `<html ${html}>`);
        data = data.replace(/<title>.*?<\/title>/g, title);
        data = data.replace('</head>', `${meta}</head>`);

        data = data.replace(
            '<div id="app-root"></div>',
            `<div id="app-root">${body}</div><script>window.__PRELOADED_STATE__ = ${state}</script>${scripts.join('')}`
        );

        return data;
    };

    // Load in our HTML file from our build
    await fs.readFile(
        path.resolve(__dirname, '../build/index.html'),
        'utf8',
        async (err, htmlData) => {
            // If there's an error... serve up something nasty
            if (err) {
                console.error('Read error', err);

                return res.status(404).end();
            }

            // Create a store (with a memory history) from our current url
            const store = createReduxStore(req.url);

            // If the user has a cookie (i.e. they're signed in) - set them as the current user
            // Otherwise, we want to set the current state to be logged out, just in case this isn't the default

            const authToken = req.cookies[config.authenticationCookie];

            const userIdentifier = req.cookies[config.userIdentifierCookie];
            const deviceIdentifier = req.cookies[config.deviceIdentifierCookie];

            try {
                await store.dispatch(loadTheme(hostname));
            } catch(error) {}


            await store.dispatch(verifyToken(authToken, userIdentifier, deviceIdentifier));

            await store.dispatch(verifyCart(authToken, userIdentifier, deviceIdentifier));

            if (config.confirmedAddressCookie in req.cookies) {
                const unauthedAddress = JSON.parse(req.cookies[config.confirmedAddressCookie]);

                if (unauthedAddress) {
                    await store.dispatch(setGeocodedAddress(unauthedAddress));
                }

            }

            const context = {};
            const modules = [];

            /*
              Here's the core funtionality of this file. We do the following in specific order (inside-out):
                1. Load the <App /> component
                2. Inside of the SSRHelper HOC
                3. Inside of a Redux <StaticRouter /> (since we're on the server), given a location and context to write to
                4. Inside of the store provider
                5. Inside of the React Loadable HOC to make sure we have the right scripts depending on page
                6. Render all of this sexiness
                7. Make sure that when rendering SSRHelper knows to get all the appropriate preloaded requests
      
              In English, we basically need to know what page we're dealing with, and then load all the appropriate scripts and
              data for that page. We take all that information and compute the appropriate state to send to the user. This is
              then loaded into the correct components and sent as a Promise to be handled below.
            */
            ssrHelperServerRender(() =>
                renderToString(
                    <Loadable.Capture report={m => modules.push(m)}>
                        <Provider store={store}>
                            <StaticRouter location={req.url} context={context}>
                                <SSRHelper isServer={true}>
                                    <App />
                                </SSRHelper>
                            </StaticRouter>
                        </Provider>
                    </Loadable.Capture>
                )
            ).then(routeMarkup => {
                if (context.url) {
                    const contextStatusCode = context.location && context.location.state && context.location.state.code ? context.location.state.code : null;

                    // If context has a url property, then we need to handle a redirection in Redux Router
                    res.writeHead(contextStatusCode || 302, {
                        Location: context.url
                    });

                    res.end();
                } else {
                    // Otherwise, we carry on...

                    // Let's give ourself a function to load all our page-specific JS assets for code splitting
                    const extractAssets = (assets, chunks) =>
                        Object.keys(assets)
                            .filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
                            .map(k => assets[k]);

                    // Let's format those assets into pretty <script> tags
                    const extraChunks = extractAssets(manifest, modules).map(
                        c => `<script type="text/javascript" src="/${c.replace(/^\//, '')}"></script>`
                    );

                    // We need to tell Helmet to compute the right meta tags, title, and such
                    const helmet = Helmet.renderStatic();

                    // Pass all this nonsense into our HTML formatting function above
                    const html = injectHTML(htmlData, {
                        html: helmet.htmlAttributes.toString(),
                        title: helmet.title.toString(),
                        meta: helmet.meta.toString(),
                        body: routeMarkup,
                        scripts: extraChunks,
                        state: JSON.stringify(store.getState()).replace(/</g, '\\u003c')
                    });

                    // We have all the final HTML, let's send it to the user already!
                    res.send(html);
                }
            });
        }
    );
}
