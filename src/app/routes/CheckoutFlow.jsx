import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ssrComponent } from 'lib/ssrHelper';
import Cookies from 'js-cookie';
import config from 'app/config';

import Page from 'app/components/Page';
import Cart from 'app/components/cart/Cart';
import Checkout from 'app/components/checkout/Checkout';
import Delivery from 'app/components/delivery/Delivery';
import StepSelector from 'app/components/checkout-flow/StepSelector';
import CartErrors from 'app/components/checkout-flow/CartErrors';
import { isTieredDeliveryDateValid } from 'lib/util/delivery';
import { displaySurchargePopup } from 'app/resources/action/Cart';
import { AnalyticsEvents } from 'lib/analytics';

import { verifyCart } from 'app/resources/action/VerifyCart';
import registerDeliveryMethodRedux from 'app/resources/api/deliveryMethod';

import styles from './CheckoutFlow.module.scss';
import IdVerification from "./IdVerification";

const deliveryMethodRedux = registerDeliveryMethodRedux('DELIVERY_METHOD', ['LIST']);

const STEPS = {
    1: {
        name: 'cart',
        url: '/cart'
    },
    2: {
        name: 'delivery',
        url: '/delivery'
    },
    3: {
        name: 'verify',
        url: '/verify'
    },
    4: {
        name: 'payment',
        url: '/checkout'
    }
};

export class CheckoutFlow extends Component {
    state = {
        step: 1
    };
    
    // These will be updated whenever step changes, which will fire a re-render for 
    // <StepSelector>, so we don't need to put them in state to trigger said re-render.
    hasVisitedDelivery = false;
    hasVisitedPayment = false;

    static async getInitialProps(props) {
    }

    componentDidMount() {
        this.moveToPath(true);
        this.refreshCart();

        // TODO: Should this fire on SSR?
        this.triggerAnalyticsStarted();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location?.pathname !== prevProps.location?.pathname) {
            this.moveToPath();
        }

        if (prevProps.deliveryMethodsRequesting === true && this.props.deliveryMethodsRequesting === false && this.props.deliveryMethodsRequested === true && this.state.step === 2) {
            this.triggerAnalyticsDeliveryMethodsViewed();
        }

        if (this.props.addressZoneId !== prevProps.addressZoneId && this.props.addressZoneId) {
            this.props.deliveryMethodActions.list(this.props.auth, { zoneId: this.props.addressZoneId });
        }

        if (this.props.cart?.items?.length === 0 && this.props.location?.pathname !== '/cart') {
            // We might have had cart items removed from this update, so re-validate the first step
            if (!this.validateCart()) {
                this.handleStepChange(1);
                this.hasVisitedDelivery = false;
                this.hasVisitedPayment = false;
            }
        }
    }

    getAnalyticsProperties = () => {
        const selectedDeliveryMethod = this.props.deliveryMethods?.find(method => method.id === this.props.cart?.deliveryMethodId);
        const coupon = this.props.cart?.discounts?.find(discount => discount?.promoCode?.code);
        const discount = this.props.cart?.discounts?.reduce((ac, cur) => ac + parseFloat(cur?.discountAmount, 10), 0);

        return {
            delivery_display_type: selectedDeliveryMethod?.displayType ?? null,
            payment_method: null,
            coupon: coupon?.promoCode?.code ?? null,
            discount
        };
    };

    triggerAnalyticsDeliveryMethodsViewed = () => {
        if (typeof window !== 'undefined' && this.props.deliveryMethods) {
            const aProps = this.getAnalyticsProperties();
            const methods = this.props.deliveryMethods ?? [];
            const totalSkipped = methods.reduce((ac, cur) => (ac?.nextSkipped ? parseInt(ac?.nextSkipped, 10) : 0) + (cur?.nextSkipped ? parseInt(cur?.nextSkipped, 10) : 0), 0);
            const clickToReveal = methods.some(method => method?.enableTDMClickToReveal);
            const firstUnavailableMethod = methods.find(method => method?.status === 'UNAVAILABLE');

            global.tippleAnalytics.trigger(AnalyticsEvents.delivery_methods_viewed, { 
                cart: this.props.cart,
                step: this.state.step,
                step_name: STEPS[this.state.step].name,
                isSkipped: methods.some(method => method.isSkipped === true),
                manualSkip: methods.some(method => method.manualSkip === true),
                nextSkipped: totalSkipped,
                delivery_display_type: aProps.delivery_display_type,
                payment_method: null,
                coupon: aProps.coupon,
                discount: aProps.discount,
                click_to_reveal: clickToReveal,
                unavailable_reason: firstUnavailableMethod?.unavailableReason
            });
        }
    };

    triggerAnalyticsStarted = () => {
        if (this.props.cart && typeof window !== 'undefined') {
            global.tippleAnalytics.trigger(AnalyticsEvents.checkout_process_started, 
                {}
            );
        }
    };

    triggerAnalyticsStepViewed = () => {
        if (this.props.cart && typeof window !== 'undefined') {
            const aProps = this.getAnalyticsProperties();

            global.tippleAnalytics.trigger(AnalyticsEvents.checkout_step_viewed, 
                {
                    step: this.state.step,
                    step_name: STEPS[this.state.step].name,
                    delivery_display_type: aProps.delivery_display_type,
                    payment_method: null
                }
            );
        }
    };

    triggerAnalyticsStepCompleted = (step) => {
        if (typeof window !== 'undefined') {
            const thisStep = step || this.state.step;
            const aProps = this.getAnalyticsProperties();

            global.tippleAnalytics.trigger(AnalyticsEvents.checkout_step_completed, 
                {
                    step: thisStep,
                    step_name: STEPS[thisStep].name,
                    delivery_display_type: aProps.delivery_display_type,
                    payment_method: null,
                    coupon: aProps.coupon,
                    discount: aProps.discount
                }
            );
        }
    };

    triggerAnalyticsTabClicked = (fromStep, toStep) => {
        if (this.props.cart && typeof window !== 'undefined') {
            global.tippleAnalytics.trigger(AnalyticsEvents.checkout_nav_item_clicked, 
                {
                    from: fromStep,
                    to: toStep
                }
            );
        }
    }

    moveToPath = (triggerAnalytics = false) => {
        const pathStep = Object.keys(STEPS).find(step => STEPS[step]?.url === this.props.history?.location?.pathname);

        // Attempt to load to the path given in the URL if it was found
        if (pathStep && parseInt(pathStep, 10) !== this.state.step) {
            this.handleStepChange(parseInt(pathStep, 10));
        } else if (this.props.history?.location?.pathname !== STEPS[this.state.step]?.url) {
            // Doesn't match the actual valdation step, replace it
            // TODO: Does this ever even fire?!
            this.props.history.replace(STEPS[this.state.step]?.url);
        } else if (triggerAnalytics) {
            this.triggerAnalyticsStepViewed();
        }
    };

    refreshDeliveryMethods = () => {
        if (this.props.cart) {
            this.props.deliveryMethodActions.list(this.props.auth, {
                zoneId: this.props.cart?.address?.zoneId
            });
        }
    };

    refreshCart() {
        const authToken = Cookies.get(config.authenticationCookie);
        const existingAuthToken = Cookies.get(config.existingAuthenticationCookie);

        // NOTE: We want to check the existing authToken first, if we don't have one, check the old auth token, and then finally check anonymous
        const verifyToken = authToken ?? existingAuthToken ?? null;
        this.props.verifyCart(verifyToken, Cookies.get(config.userIdentifierCookie), Cookies.get(config.deviceIdentifierCookie), this.props.hasAddress);
    };

    // Cart requires:
    // - at least one item
    validateCart = (skipPopups = false) => {
        // Check if the current pathname is /cart, as that is the only time we want to show the popup.
        // If not, we don't show it and we just let it through.
        if (!skipPopups && this.props.cartItems.length > 0 && this.props.cart?.surcharge > 0 && !this.props.surchargePopupShowing && this.props.location?.pathname === STEPS[1].url) {
            this.props.displaySurchargePopup();
            return false;
        }

        return this.props.cartItems.length > 0;
    };

    // Delivery requires:
    // - valid delivery method (date / time)
    validateDelivery = () => {
        return isTieredDeliveryDateValid(this.props.deliveryMethods, this.props.cart?.deliveryMethodId, this.props.cart?.deliveryDate, this.props.cart?.deliveryTimeMinutes);
    };

    // Payment requires:
    // - logged in user
    validatePayment = () => {
        return this.props.user ? true : false;
    };

    validateVerification = () => {
        //TODO
        return !!this.props.user;
    };

    // Validate the given step
    validateStep = (step, skipPopups = false) => {
        switch (step) {
            case 1:
                return this.validateCart(skipPopups);
            
            case 2:
                return this.validateDelivery();
            
            case 3:
                return this.validateVerification();

            case 4:
                return this.validatePayment();
            
            default:
                return false;
        }
    };

    handleContinueClick = () => {
        console.log(this.state.step);
        this.handleStepChange(this.state.step + 1);
    };

    // Validate all steps from the the first through to the step we want to move to
    validInterimSteps = (toStep) => {
        const { step } = this.state;
        const stepsToValidate = Object.keys(STEPS).filter(s => s >= step && s < toStep).map(s => parseInt(s, 10));
        
        let stepsValid = 0;

        stepsToValidate.forEach(s => {
            if (this.validateStep(s)) {
                stepsValid++;
                this.triggerAnalyticsStepCompleted(s);
            }
        });

        if (stepsToValidate.length === stepsValid) {
            console.log(stepsToValidate)
            return true;
        }

        return false;
    };

    handleStepChange = (nextStep) => {
        const { step } = this.state;
        const { history } = this.props;
        let didChangeStep = false;

        if (nextStep < 1 || STEPS.length) {
            return;
        }

        // Going back
        if (nextStep < step) {
            didChangeStep = true;
        }

        // Going forward, validation needs to be successful
        if (nextStep > step) {
            didChangeStep = this.validInterimSteps(nextStep);
        }

        if (didChangeStep) {
            // We need a valid user to proceed to payment
            if(nextStep === 3){
                console.log("push to verify")
                history.push('/verify')
            }
            if (nextStep === 4 && !this.props.user) {
                history.push('/user?redirect=/checkout');
            } else {
                this.triggerAnalyticsTabClicked(STEPS[step].name, STEPS[nextStep].name);
                console.log(STEPS[nextStep].url);
                history.replace(STEPS[nextStep].url);
                this.setState(() => ({
                    step: nextStep
                }), () => {
                    this.triggerAnalyticsStepViewed();
                });
                this.refreshCart();
            }

            if (nextStep === 2) {
                this.refreshDeliveryMethods();
                this.hasVisitedDelivery = true;
            }
            if(nextStep === 3){
                this.hasVisitedDelivery = true;
            }
            if (nextStep === 4) {
                this.hasVisitedDelivery = true;
                this.hasVisitedPayment = true;
            }

            window.scrollTo(0, 0);
        }
    };

    handleCheckout = () => {
        this.triggerAnalyticsStepCompleted();
    };

    render() {
        const { step } = this.state;
        const { cartItemCount, cartErrors } = this.props;

        return (
            <Page id="checkout" description="....">
                <div className={styles.container}>
                    <div className={styles.content}>
                        <StepSelector 
                            step={step} 
                            isDeliveryAvailable={this.validateStep(1, true) && this.hasVisitedDelivery}
                            isPaymentAvailable={this.validateStep(2) && this.validateStep(1, true) && this.hasVisitedPayment}
                            onChangeStep={this.handleStepChange} 
                            cartItemCount={cartItemCount}
                        />
                        {cartErrors && <CartErrors errors={cartErrors} />}
                        {step === 1 && 
                            <Cart {...this.props} handleSubmit={this.handleContinueClick} />
                        }
                        {step === 2 &&
                            <Delivery {...this.props} handleSubmit={this.handleContinueClick} />
                        }
                        {step === 3 && <IdVerification />
                        }
                        {step === 4 &&
                            <Checkout {...this.props} handleSubmit={this.handleCheckout} />
                        }
                    </div>
                </div>
            </Page>
        );
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    user: state.auth?.currentUser,
    searchParams: state.searchParams,
    cart: state.cart?.currentCart,
    cartItemCount: state.cart?.cartItemCount,
    cartItems: state.cart?.currentCart?.items ?? [],
    cartErrors: state.cart?.currentCart?.errors?.map(error => error?.displayMessage) ?? null,
    deliveryMethodsRequesting: state.DELIVERY_METHOD?.isRequesting ?? false,
    deliveryMethodsRequested: state.DELIVERY_METHOD?.hasRequested ?? false,
    deliveryMethods: state.DELIVERY_METHOD?.items ?? [],
    addressZoneId: state.cart?.currentCart?.address?.zoneId ?? null,
    hasAddress: state?.address?.geocodedAddress?.zoneId ? true : false,
    surchargePopupShowing: state.cart?.surchargeAccepted
});

const mapDispatchToProps = (dispatch) => ({
    displaySurchargePopup: bindActionCreators(displaySurchargePopup, dispatch),
    verifyCart: bindActionCreators(verifyCart, dispatch),
    deliveryMethodActions: bindActionCreators(deliveryMethodRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ssrComponent(CheckoutFlow));