import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import Page from 'app/components/Page';
import ProgressBarBlocks from 'app/components/order-tracking/ProgressBarBlocks';
import OrderCart from 'app/components/order-tracking/OrderCart';
import TrackingMap from 'app/components/order-tracking/TrackingMap';
import registerOrderTrackingRedux from 'app/resources/api/orderTracking';
import registerOrderArrivedRedux from 'app/resources/api/orderArrived';
import { refreshCart } from 'app/resources/action/Cart';
import { AnalyticsEvents } from 'lib/analytics';
import { ORDER_TRACKING_INTERVAL_MS, PUBLIC_ICON_FOLDER } from 'lib/constants/app';
import { getHostname } from 'app/utils/getHostname';
import SurveyPrompt from 'app/components/order-tracking/SurveyPrompt';
import registerSurveyStatusDeclined from 'app/resources/userSurveyStatusDeclined';
import registerSurveyStatusComplete from 'app/resources/userSurveyStatusComplete';

import styles from './OrderTracking.module.scss';

const orderTrackingRedux = registerOrderTrackingRedux('ORDER_TRACKING', ['GET']);
const orderArrivedRedux = registerOrderArrivedRedux('ORDER_ARRIVED', ['UPDATE']);
const surveyDeclinedRedux = registerSurveyStatusDeclined('SURVEY_DECLINED', ['UPDATE']);
const surveyCompleteRedux = registerSurveyStatusComplete('SURVEY_COMPLETE', ['UPDATE']);

const SHOW_CART_STATUSES = ['pending', 'accepted', 'cancelled'];
const SHOW_MAP_STATUSES = ['packed', 'pickedUp', 'inTransit', 'nearby', 'completed'];

const textValues = {
    pending: {
        future: {
            status: 'Order Scheduled',
            detail: 'Your order has been scheduled for delivery.'
        },
        pick_up: {
            status: 'Confirming your order',
            detail: 'Your order is being sent to STORE_NAME.'
        },
        status: 'Confirming your order',
        detail: 'Your order is being sent to a nearby store for packing.'
    },
    accepted: {
        pick_up: {
            status: 'Packing your order',
            detail: 'STORE_NAME is currently packing your order.'
        },
        status: 'Packing your order',
        detail: 'Your local store is currently packing your order.'
    },
    packed: {
        pick_up: {
            status: 'Order ready',
            detail: 'Your order is ready for pickup. Please click the button below once you have arrived at the store.'
        },
        status: 'Ready for pickup',
        detail: 'Your order is packed and will be picked up soon.'
    },
    pickedUp: {
        status: 'Order picked up',
        detail: 'Your courier is completing a nearby delivery first.'
    },
    inTransit: {
        status: 'Order on the way',
        detail: 'Your delivery driver is on the way to you now.'
    },
    nearby: {
        pick_up: {
            status: 'Order ready',
            detail: 'Please collect the order from the store.'
        },
        status: 'Order arriving now!',
        detail: 'Time to meet your driver! Don\'t forget to bring your ID.'
    },
    completed: {
        pick_up: {
            status: 'Order complete',
            detail: 'See you again soon!'
        },
        status: 'Delivery Complete',
        detail: 'See you again soon!'
    },
    cancelled: {
        status: 'Order Cancelled',
        detail: 'Contact support on live chat for any further enquiries.'
    },
    shipping: {
        status: 'Order Placed',
        detail: 'Your order will be packed and shipped once ready via courier services.'
    }
};

const displayStepTextBuilder = (status,type,storeName) => {
    if(!status) return '';
    let text = textValues[status]? (textValues[status][type]? textValues[status][type] : textValues[status]) : '';
    return {status:text.status,detail:text.detail.replace('STORE_NAME',storeName)};
}

const getProgressStep = displayStep => {
    switch (displayStep) {
        case 'pending':
            return 1;

        case 'accepted':
            return 2;

        case 'packed':
            return 3;

        case 'pickedUp':
        case 'inTransit':
            return 4;

        case 'nearby':
            return 5;
        
        case 'completed':
            return 6;

        case 'cancelled':
            return 0;

        default:
            return 1;
    }
};

const OrderTracking = ({ match }) => {
    const [displayStep, setDisplayStep] = useState('pending');
    const [analyticsFired, setAnalyticsFired] = useState(false);
    const [promptVisible, setPromptVisible] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [arrivedClicked, setArrivedClicked] = useState(false);
    const interval = useRef();    // Interval for fetching order tracking

    const orderNumberGuid = match?.params?.orderId;
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector(state => state.auth);
    const orderTracking = useSelector(state => state?.ORDER_TRACKING?.item ?? null);
    const isRequestingOrderTracking = useSelector(state => state?.ORDER_TRACKING?.isRequestingItem ?? false);
    const hasRequestedOrderTracking = useSelector(state => state?.ORDER_TRACKING?.hasRequested ?? false);
    const hasTrackingError = useSelector(state => state?.ORDER_TRACKING?.hasError ?? false);
    const cart = useSelector( state => state?.cart);
    const theme = useSelector(store => store.theme);
    const assetPath = theme?.name ? 
        `/static/assets/theme/${theme.name.toLowerCase()}/img` : PUBLIC_ICON_FOLDER;

    const isFuture = orderTracking?.type === 'FUTURE';
    const isShipping = orderTracking?.deliveryType === 'SHIPPING';
    const isPickup = orderTracking?.deliveryType === 'PICK_UP';

    let text = displayStepTextBuilder(orderTracking?.displayStep, orderTracking?.deliveryType.toLowerCase(), orderTracking?.store?.name);

    const showCart = isPickup || (SHOW_CART_STATUSES.includes(displayStep) && !isShipping);
    const showMap = !isPickup && (SHOW_MAP_STATUSES.includes(displayStep) || isShipping);
    const showArrivedButton = orderTracking?.isArriveEnabled && !['cancelled', 'completed'].includes(displayStep);

    const hostname = getHostname();

    const handleArrived = useCallback(() => {
        setArrivedClicked(true);
        dispatch(orderArrivedRedux.actionCreators.update(`${orderNumberGuid}/arrived`, null, {
            domain: hostname
        }, true));

    },[hostname, dispatch, orderNumberGuid])

    const triggerAnalyticsViewed = () => {
        if (typeof window !== 'undefined') {
            global.tippleAnalytics.trigger(AnalyticsEvents.order_tracking_viewed, 
                {
                    isTippleTracking: orderTracking?.isTippleTracking,
                    order: orderTracking ?? null
                }
            );

            setAnalyticsFired(true);
        }
    };

    const getOrderTrackingDetails = () => {
        const hostname = getHostname();

        dispatch(orderTrackingRedux.actionCreators.get(orderNumberGuid, auth, {
            fields: 'cartId',
            inline: 'cart,cartItems,cartItemImages',
            domain: hostname
        }, true));
    };

    const startTracking = () => {
        try {
            interval.current = setInterval(() => {
                //if (auth) {
                    getOrderTrackingDetails();
                //}
            }, ORDER_TRACKING_INTERVAL_MS);
        } catch (e) {
            if (global.newrelic) {
                global.newrelic.noticeError(e);
            }
        }
    };

    const hideSurveyPrompt = () => {
        setPromptVisible(false);
        orderTracking.surveyUrl = null;

        dispatch(surveyDeclinedRedux.actionCreators.update(null, {}, auth));
    };

    const completeSurvey = ()  => {
        setPromptVisible(false);
        orderTracking.surveyUrl = null;

        dispatch(surveyCompleteRedux.actionCreators.update(null, {}, auth));
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        if (auth) {
            getOrderTrackingDetails();
        }
        startTracking();

        return () => {
            clearInterval(interval.current);
        }
    }, []);

    // Make sure we have auth before we load the tracking.
    useEffect(() => {
        // Get the newly created cart. This will ensure nav cart count is updated.
        if (auth?.currentUser) {
            dispatch(refreshCart(auth));
        }
    }, [auth?.currentUser]);

    // Update the UI if we move to another step.
    useEffect(() => {
        setDisplayStep(orderTracking?.displayStep);
    }, [orderTracking?.displayStep]);

    // Clear the interval if we get an API error, which indicates a 404 or 401.
    useEffect(() => {
        if (hasTrackingError) {
            clearInterval(interval.current);
        }
    }, [hasTrackingError]);

    // If the latest update
    useEffect(() => {
        if (!isRequestingOrderTracking && hasRequestedOrderTracking) {
            if (['cancelled', 'completed'].includes(displayStep) || (orderTracking && ['SHIPPING','EXTERNAL'].includes(orderTracking?.deliveryType))) {
                clearInterval(interval.current);
                
                if (orderTracking?.surveyUrl) {
                    setPromptVisible(true);
                }
            }
            const loadedAttemptCompleted = cart?.didAttemptCartVerification && !cart?.isRequesting;

            if (!analyticsFired && hasRequestedOrderTracking && loadedAttemptCompleted) {
                triggerAnalyticsViewed();
            }
        }
    }, [isRequestingOrderTracking, interval, hasRequestedOrderTracking, orderTracking, analyticsFired, displayStep,
        cart?.didAttemptCartVerification, cart?.isRequesting, triggerAnalyticsViewed]);

    useEffect(() => {
        if (!hasLoaded && hasRequestedOrderTracking) {
            setHasLoaded(true);
        }
    }, [hasLoaded, hasRequestedOrderTracking]);

    return (
        <Page
            id="order-tracking"
            title="Order Tracking"
            description="Order Tracking"
            className={styles.page}
        >
            {(!hasLoaded && isRequestingOrderTracking) && 
                <div className={styles.loading}>
                    <div className={styles.driver}>
                        <img src={`${assetPath}/icon-tracking-driver.svg`} alt="Loading..." />
                    </div>
                </div>
            }
            {(!hasTrackingError && orderTracking) &&
                <>
                    <section className={classNames(styles.head, styles.container)}>
                        <h1>Order Tracking</h1>
                        <strong className={styles.status}>{text?.status}</strong>
                        <p className={styles.detail}>{text?.detail}</p>
                        {!isShipping && <ProgressBarBlocks
                            total={5}
                            current={getProgressStep(displayStep)}
                            className={styles.progress}
                        />}
                    </section>
                    <section className={styles.deliveryTime}>
                        <div className={styles.container}>
                            <span>{isShipping ? 'Delivery Address' : `${orderTracking?.formattedDeliveryTitle}:`}</span>
                            <strong className={isShipping ? styles.shippingAddress : null}>{isShipping ? orderTracking?.address?.formattedAddress ?? '' : `${orderTracking?.formattedDeliveryTime}`}</strong>
                        </div>
                    </section>
                    <section className={classNames(styles.body, styles.container, promptVisible && styles.hasPrompt, (orderTracking && showMap) && styles.mapContainer)}>
                        {(orderTracking && showCart) && <OrderCart order={orderTracking} className={styles.cart}>

                            {showArrivedButton && <button disabled={arrivedClicked} onClick={handleArrived} type="submit" className={classNames(styles.btn, 'btn btn-primary address-search')}>
                                I Have Arrived
                            </button> }
                        </OrderCart>}
                        {(orderTracking && showMap && orderTracking?.address) && <TrackingMap lat={orderTracking?.address?.lat} lng={orderTracking?.address?.lng} driverLat={orderTracking?.driverLat} driverLng={orderTracking?.driverLng} assetPath={assetPath} />}
                    </section>
                    {(promptVisible && orderTracking?.surveyUrl && orderTracking?.surveyText) && <section className={styles.container}>
                        <SurveyPrompt surveyUrl={orderTracking?.surveyUrl} handleYesClick={completeSurvey} handleNoClick={hideSurveyPrompt} promptText={orderTracking?.surveyText} />
                    </section>}
                </>
            }
            {hasTrackingError && 
                <div className={styles.expired}>
                    <h5>Expired Link</h5>
                    <p>The tracking link for this order has expired.</p>
                    {!auth?.currentUser && <p>Please <Link to={`/user?redirect=${history?.location?.pathname}${encodeURIComponent(history?.location?.search)}`}>log in</Link> to view this order's details.</p>}
                </div>
            }
        </Page>
    );
};

export default OrderTracking;