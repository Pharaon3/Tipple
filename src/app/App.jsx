// The basics
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import Routes from './Routes';

import Cookies from 'js-cookie';
import config from 'app/config';

import { decodeSearchParams } from 'lib/searchParams';

import { setGeocodedAddress, displayAddressSelect } from './resources/action/Address';
import { verifyToken, verifyTokenWithUser } from './resources/action/VerifyToken';
import { verifyCart } from './resources/action/VerifyCart';

import ReferralCodePopup from './components/popups/ReferralCode';
import LoginPopup from 'app/components/popups/Login';
import ForgotPasswordPopup from 'app/components/popups/ForgotPassword';
import RemovedItemsPopup from 'app/components/popups/RemovedItems';
import { Analytics, AnalyticsEvents } from '../lib/analytics';
import BackToTop from 'app/components/BackToTop';
import Navigation from 'app/components/Navigation';
import Footer from 'app/components/Footer';
import { getFeatures } from '../app/resources/action/Features';
import { setCartAddress } from 'app/resources/action/Cart';
import { applyPromotionCode } from 'app/resources/action/Cart';
import { setPromoCode} from 'app/resources/PromoCode';
import ErrorBoundary from 'app/components/ErrorBoundary';
import ThemeErrorHandler from 'app/components/ThemeErrorHandler';
import { setAppToken } from 'app/resources/token';
import { setThemeInitialised } from './resources/action/Theme';
import { WindowSizeProvider } from './providers/WindowSizeProvider';
import AddressSelectPopup from 'app/components/popups/AddressSelect';
import { isHomePage } from 'lib/util/site';
import { enableLivechat } from 'lib/livechat';
import LandbotWidget from 'app/components/Landbot';
import { getLandbotUrl } from 'lib/util/landbot';

import '../sass/main.scss';


global.tippleAnalytics = new Analytics();

// Loaded in index.html
const DEFAULT_CSS_URL = '/static/assets/theme/default/variables.css';

class App extends Component {

    chatEnabled = false;

    state = {
        useLandbot: false,
        landbotUrl: null
    };

    componentDidMount() {

        const authToken = Cookies.get(config.authenticationCookie);
        const existingAuthToken = Cookies.get(config.existingAuthenticationCookie);

        // NOTE: We want to check the existing authToken first, if we don't have one, check the old auth token, and then finally check anonymous
        if (authToken) {
            this.props.verifyToken(authToken, Cookies.get(config.userIdentifierCookie), Cookies.get(config.deviceIdentifierCookie));
        } else if (existingAuthToken) {
            this.props.verifyToken(existingAuthToken, Cookies.get(config.userIdentifierCookie), Cookies.get(config.deviceIdentifierCookie));
        } else {
            this.props.verifyToken(authToken, Cookies.get(config.userIdentifierCookie), Cookies.get(config.deviceIdentifierCookie));
        }

        const unauthedAddress = Cookies.getJSON(config.confirmedAddressCookie);
        if (unauthedAddress) {
            this.props.setGeocodedAddress(unauthedAddress);
        }

        if (this.props.location.pathname !== '/') {
            this.onRouteChanged(this.props.location.pathname);
        }

        // Grab the promo code form the URL and store it in redux for when we have a cartId.
        // cartId will come through either when the user's session loads (it won't exist on mount as its an async request) or one is created.
        let sp = decodeSearchParams(this.props.location.search);
        let promoCode = sp && sp.promo_code ? sp.promo_code : null;

        if (promoCode && String(promoCode) !== '') {
            this.props.setPromoCode(String(promoCode));
        }

        if (sp.address === 'y') {
            this.props.displayAddressSelect();
        }

        if (this.props.theme.initialized && config.enableAnalytics !== false && this.chatEnabled === false) {
            this.enableChat();
        }
    }

    enableChat = () => {
        const landbotEnabled = this.props.theme?.useLandbot ?? false;

        if (landbotEnabled) {
            this.setState(() => ({
                landbotUrl: getLandbotUrl(this.props.location.pathname, this.props.theme),
                useLandbot: true
            }));
        } else {
            enableLivechat({ liveChatLicense: config.liveChatLicense });
        }

        this.chatEnabled = true;
    };

    getFeatures = () => {
        // Split should only use the device ID.
        this.props.getFeatures(Cookies.get(config.deviceIdentifierCookie));
    };

    /**
     * There is a timing issue with this on some pages like the split checkout. The event fires with properties that are being picked up 
     * by the segment library, but the values are from the previous route. Setting a 200ms timer works for this, but feels wrong.
     */
    onRouteChanged(pathname) {
        if (typeof window !== 'undefined') {
            setTimeout(() => {
                global.tippleAnalytics.trigger(AnalyticsEvents.app_pageview, { 'page': { 'path': pathname, }, 'data': { 'appUrl': pathname } });
            }, 200);
        }

        if (this.state.useLandbot) {
            const landbotUrl = getLandbotUrl(this.props.location.pathname, this.props.theme);
            if (landbotUrl !== this.state.landbotUrl) {
                this.setState(() => ({
                    landbotUrl
                }));
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {

        if (!this.props.theme.initialized) {

            if(this.props.theme.hasError) {
                this.props.setThemeInitialised();
            }

            if (this.props.theme.name) {
                try {
                    // Avoid loading the same CSS file again if it is the default we've loaded in index.html
                    if (this.props?.theme?.cssURL && this.props?.theme?.cssURL !== DEFAULT_CSS_URL) {
                        const head = document.head;
                        const link = document.createElement('link');

                        link.type = 'text/css';
                        link.rel  = 'stylesheet';
                        link.href = (this.props.theme.cssURL.charAt(0) === '/' ? process.env.PUBLIC_URL : '')
                            + this.props.theme.cssURL+`?cacheBust=${config.cacheBust}`;

                        head.appendChild(link);
                    }

                    if (this.props?.theme?.faviconURL) {
                        const favlink = document.querySelector('link[rel="shortcut icon"]');
                        favlink.href = (this.props.theme.faviconURL.charAt(0) === '/' ? process.env.PUBLIC_URL : '') 
                            + this.props.theme.faviconURL+`?cacheBust=${config.cacheBust}`;
                    }

                    this.props.setThemeInitialised();
                } catch(error) {
                    // probably server side rendering
                    this.props.setThemeInitialised();
                }
            }
        }
        
        if (this.props.location.pathname !== prevProps.location.pathname && this.props.location.pathname !== '/') {
            this.onRouteChanged(this.props.location.pathname);
        }

        if (this.props.addressZoneId !== prevProps.addressZoneId) {
            this.getFeatures();
        }

        if (this.props.cartStoreId === -1 && prevProps.cartStoreId !== this.props.cartStoreId) {
            this.props.history.push('/');
        }

        // Attempt to apply the promo code given when a cart is loaded.
        // TODO: Bad codes or errors will just be silently swallowed, first implementation, maaaan.
        if (!prevProps.cartId && this.props.cartId && this.props.promoCode) {
            this.props.applyPromotionCode(this.props.promoCode, this.props.cartId, this.props.auth);
        }

        // When a user logs out, we need to 'fake' a new verification so that the code below ("Once we've verified the token")
        // fires and creates a new token.
        // TODO: Move this into a shared function so mount / update can both use it (and CheckoutFlow)
        if (prevProps.auth?.didAttemptTokenVerification && !this.props.auth?.didAttemptTokenVerification) {
            const authToken = Cookies.get(config.authenticationCookie);
            const existingAuthToken = Cookies.get(config.existingAuthenticationCookie);

            // NOTE: We want to check the existing authToken first, if we don't have one, check the old auth token, and then finally check anonymous
            if (authToken) {
                this.props.verifyToken(authToken, Cookies.get(config.userIdentifierCookie), Cookies.get(config.deviceIdentifierCookie));
            } else if (existingAuthToken) {
                this.props.verifyToken(existingAuthToken, Cookies.get(config.userIdentifierCookie), Cookies.get(config.deviceIdentifierCookie));
            } else {
                this.props.verifyToken(authToken, Cookies.get(config.userIdentifierCookie), Cookies.get(config.deviceIdentifierCookie));
            }
        }

        // Check user verification has finished
        if ((!prevProps.auth.didAttemptTokenVerification && this.props.auth.didAttemptTokenVerification) || (!prevProps.auth.currentUser && this.props.auth.currentUser)) {
            // Check if the user is logged in

            this.getFeatures();

            if (this.props.auth.currentUser) {
                window.tippleAnalytics.trigger(AnalyticsEvents.user_identify, { user: this.props.auth.currentUser });
            } else {
                window.tippleAnalytics.trigger(AnalyticsEvents.user_is_guest, {});
            }
        }

        // Once we've verified the token (or we have no token), let's verify the cart
        // TODO: This could be combined with the current-user call to save a roundtrip to the server
        if ((!prevProps.auth.didAttemptTokenVerification && this.props.auth.didAttemptTokenVerification) || (!prevProps.auth.token && this.props.auth.token)) {
            const authToken = Cookies.get(config.authenticationCookie);
            const existingAuthToken = Cookies.get(config.existingAuthenticationCookie);

            let sp = decodeSearchParams(this.props.location.search);

            if (sp.encryptedAddress) {
                this.props.setCartAddress({
                    encryptedAddress: sp.encryptedAddress
                }, this.props.auth, this.props.history);
            }

            if (!this.props.auth.isAuthenticated) {
                Cookies.remove(config.existingAuthenticationCookie, { path: '/', domain: config.cookieDomain });
                Cookies.remove(config.authenticationCookie, { path: '/' });

                this.props.verifyCart(null, Cookies.get(config.userIdentifierCookie), Cookies.get(config.deviceIdentifierCookie), this.props.hasAddress);
                return;
            }

            // NOTE: We want to check the existing authToken first, if we don't have one, check the old auth token, and then finally check anonymous
            const verifyToken = authToken ?? existingAuthToken ?? null;
            this.props.verifyCart(verifyToken, Cookies.get(config.userIdentifierCookie), Cookies.get(config.deviceIdentifierCookie), true);
        }

        // Register API was just called and successfully registered our user; update token and currentUser accordingly.
        if (!prevProps.registeredUser && this.props.registeredUser) {
            const authToken = Cookies.get(config.authenticationCookie);
            const existingAuthToken = Cookies.get(config.existingAuthenticationCookie);

            // Set the token cookie from the update auth object
            setAppToken(this.props.registeredUser?.access_token);

            this.props.verifyTokenWithUser(this.props.registeredUser?.access_token, authToken, existingAuthToken, this.props.registeredUser?.user);
        }

        if (this.props.theme.initialized && config.enableAnalytics !== false && this.chatEnabled === false) {
            this.enableChat();
        }
    }

    render() {
        const props = this.props;
        const { useLandbot, landbotUrl } = this.state;

        // TODO: didAttemptCartVerification should only be a blocker on pages that require cart information (e.g. cart page, checkout page)
        if (!props.auth.didAttemptTokenVerification || !props.cart.didAttemptCartVerification || !this.props.theme.initialized) {
            return <div />
        }

        // Only if we're on the home page (list of cats / collections) and not viewing a collection
        let sp = decodeSearchParams(this.props.history?.location?.search);
        let collectionId = sp?.collection ? parseInt(sp?.collection, 10) : null;
        const showMobileAddressSelector = isHomePage(props?.theme?.storePath, this.props.history?.location?.pathname) && !collectionId;

        return (
            <div id="app" style={{ height: '100%' }}>
                <ThemeErrorHandler>
                    <ErrorBoundary>
                        <WindowSizeProvider>
                            <Navigation isHomePage={props.history.location.pathname === '/'} history={props.history} showMobileAddressSelector={showMobileAddressSelector} />
                            <div className="body-wrapper">
                                <Routes />
                                {/* TODO: This probably isn't the best spot since all dependencies for these will be loaded in the main app bundle */}
                                {props.cart ? <RemovedItemsPopup /> : null}
                                {props.auth.currentUser ? <ReferralCodePopup /> : null}
                                {props.auth.currentUser ? null : <LoginPopup />}
                                {props.auth.currentUser ? null : <ForgotPasswordPopup />}
                            </div>
                            <BackToTop hidePaths={['/cart', '/delivery', '/checkout']} path={props.history?.location?.pathname} />
                            <Footer />
                            <AddressSelectPopup history={this.props.history} />
                        </WindowSizeProvider>
                    </ErrorBoundary>
                </ThemeErrorHandler>
                {(useLandbot && landbotUrl) && <LandbotWidget url={landbotUrl} currentUser={props.auth?.currentUser} />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    cart: state.cart,
    cartId: state.cart && state.cart.currentCart && state.cart.currentCart.id ? state.cart.currentCart.id : null,
    promoCode: state.promoCode ? state.promoCode.promoCode : null,
    searchParams: state.searchParams,
    addressZoneId: state.cart && state.cart.currentCart && state.cart.currentCart.address ? state.cart.currentCart.address.zoneId : null,
    hasAddress: state?.address?.geocodedAddress?.zoneId ? true : false,
    cartStoreId: state.cart?.currentCart?.storeId ?? null,
    registeredUser: state.REGISTER?.item ?? null,
    theme: state.theme
});

const mapDispatchToProps = (dispatch) => ({
    verifyCart: bindActionCreators(verifyCart, dispatch),
    verifyToken: bindActionCreators(verifyToken, dispatch),
    verifyTokenWithUser: bindActionCreators(verifyTokenWithUser, dispatch),
    setGeocodedAddress: bindActionCreators(setGeocodedAddress, dispatch),
    getFeatures: bindActionCreators(getFeatures, dispatch),
    setCartAddress: bindActionCreators(setCartAddress, dispatch),
    applyPromotionCode: bindActionCreators(applyPromotionCode, dispatch),
    setPromoCode: bindActionCreators(setPromoCode, dispatch),
    setThemeInitialised: bindActionCreators(setThemeInitialised, dispatch),
    displayAddressSelect: bindActionCreators(displayAddressSelect, dispatch)
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);