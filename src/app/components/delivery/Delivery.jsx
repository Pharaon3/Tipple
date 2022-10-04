import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import DateSelector from 'app/components/delivery/dateSelector/DateSelector';
import AddressSelector from 'app/components/delivery/AddressSelector';
import ActionBar from 'app/components/ActionBar';
import LabelValue from 'app/components/checkout-flow/LabelValue';
import AlertPopup from 'app/components/popups/Alert';

import { setTdmRevealed, setAlertShowing } from 'app/resources/modules/tdmReveal';
import { isTieredDeliveryDateValid, isTieredDeliveryDateSelectionValid, findFirstValidTieredDeliveryDay } from 'lib/util/delivery';

import { setDeliveryTime } from 'app/resources/action/Cart';
import registerDeliveryMethodRedux from 'app/resources/api/deliveryMethod';
import { setOrderComment } from 'app/resources/modules/orderComment';
import OrderComments from './OrderComments';
import { MAX_ORDER_COMMENT_LENGTH } from 'lib/constants/app';
import { debounce } from 'lib/util/function';

import { AnalyticsEvents } from 'lib/analytics';
import { scrollToRef } from 'lib/util/dom';

import styles from './Delivery.module.scss';

const deliveryMethodRedux = registerDeliveryMethodRedux('DELIVERY_METHOD', ['LIST']);

export class Delivery extends PureComponent {

    state = {
        dateValid: false,
        attemptedCheckout: false,
        hasErrors: false,
        hasCommentError: false
    }

    constructor(props) {
        super(props);

        this.selectedDeliveryMethodId = null;
        this.selectedDate = null;
        this.selectedTime = null;

        this.errors = {};
        this.ref = React.createRef();
    }

    componentDidMount() {
        if (this.props.cart) {
            this.setSelectedDelivery();
        }
    }

    componentDidUpdate(prevProps) {
        // When we've loaded store times, check if there is no delivery option set
        if (this.deliveryMethodsUpdated(prevProps.deliveryMethods, this.props.deliveryMethods)) {
            // If is tiered and date is invalid
            if (this.props.deliveryMethods && this.props.deliveryMethods.items && this.props.cart.deliveryMethodId && !isTieredDeliveryDateValid(this.props.deliveryMethods && this.props.deliveryMethods.items, this.selectedDeliveryMethodId, this.selectedDate, this.selectedTime)) {
                if (!isTieredDeliveryDateSelectionValid(this.props.deliveryMethods && this.props.deliveryMethods.items, this.selectedDeliveryMethodId, this.selectedDate)) {
                }
            }
        }

        if (this.props.cart && (prevProps.cart !== this.props.cart || (this.props.cart.deliveryMethodId !== prevProps.cart.deliveryMethodId))) {
            this.setSelectedDelivery();
        }
    }

    deliveryMethodsUpdated = (prevDeliveryMethods, deliveryMethods) => prevDeliveryMethods && deliveryMethods && prevDeliveryMethods.isRequesting === true && deliveryMethods.isRequesting === false && deliveryMethods.hasRequested === true;

    isTieredAndHasNoDeliveryMethod = () => this.props.cart && this.props.deliveryMethods && this.props.deliveryMethods.items && !this.props.cart.deliveryMethodId;

    isDateValid = () => {
        return isTieredDeliveryDateValid(this.props.deliveryMethods && this.props.deliveryMethods.items, this.selectedDeliveryMethodId, this.selectedDate, this.selectedTime);
    };

    selectFirstValidTieredDeliveryDate = () => {
        if (this.props.deliveryMethods && this.props.deliveryMethods.items) {
            this.handleDateSelection(this.selectedDeliveryMethodId, findFirstValidTieredDeliveryDay(this.props.deliveryMethods && this.props.deliveryMethods.items, this.selectedDeliveryMethodId));
        }
    };

    /**
     * If no delivery method is selected, the user is in tiered delivery and there is an ASAP method active, select the most expensive one as a default.
     */
    selectMostExpensiveASAPDeliveryMethod = (prevProps) => {
        const sortedMethods = [...this.props.deliveryMethods.items].filter(method => method.status === 'ACTIVE' && method.deliveryType === 'ASAP');
        const shippingMethods = [...this.props.deliveryMethods.items].filter(method => method.status === 'ACTIVE' && method.deliveryType === 'SHIPPING');

        let deliverySet = false;

        sortedMethods.sort((a, b) => {
            if (a.zone.charge > b.zone.charge) {
                return -1;
            }

            if (a.zone.charge < b.zone.charge) {
                return 1;
            }

            return 0;
        });

        if (prevProps.deliveryMethods.isRequesting === true && this.props.deliveryMethods.isRequesting === false && !this.props.cart.deliveryMethodId) {
            if (sortedMethods && sortedMethods[0] && sortedMethods[0].id) {
                this.props.setDeliveryTime(sortedMethods[0].id, null, null, this.props.auth);
            } else if (shippingMethods && shippingMethods[0] && shippingMethods[0].id) {
                this.props.setDeliveryTime(shippingMethods[0].id, null, null, this.props.auth);
            }

            deliverySet = true;
        }

        // If there are no ASAP options, we still want to select the first one we've got for today.
        if (!deliverySet) {
            // Find first that is today
            const deliveryMethodWithToday = [...this.props.deliveryMethods.items].find(method => {
                if (method.status === 'ACTIVE' && method.days && method.days.length === 1) {
                    const today = method.days.find(day => day.isToday);
                    if (today && today.hours && today.hours.length) {
                        return method;
                    }
                }

                return null;
            });

            if (deliveryMethodWithToday) {
                const today = deliveryMethodWithToday.days.find(day => day.isToday);
                this.props.setDeliveryTime(deliveryMethodWithToday.id, today.date, today.hours[0].minutes, this.props.auth);
            }
        }
    };
    
    // FIXME: Consider fixing this to set explicit nulls if the value doesn't exist on the cart object, feels a bit cleaner.
    setSelectedDelivery = () => {
        this.selectedDeliveryMethodId = this.props.cart.deliveryMethodId;
        this.selectedDate = this.props.cart.deliveryDate;
        this.selectedTime = this.props.cart.deliveryTimeMinutes;
    };

    /**
     * Central place for updating delivery data.
     */
    handleDateSelection = (deliveryMethodId, date, time = null) => {

        if (deliveryMethodId !== null) {    // Tiered delivery
            this.selectedDeliveryMethodId = deliveryMethodId;
            this.selectedDate = date;
            this.selectedTime = time;

            this.props.setDeliveryTime(deliveryMethodId, date, time, this.props.auth, this.getAnalyticsData(deliveryMethodId));

            if (this.isDateValid()) {
                this.setState(() => ({
                    hasErrors: false
                }));
            }
        } else {
            // Date is selected but there is no time - if there is no delivery method (using classic selector) then choose the first time and set to that (ASAP)
            if (date) {
                this.selectedDate = date;
                this.selectedTime = time;

                if (time) {
                    this.props.setDeliveryTime(null, date, time, this.props.auth);
                }

                if (this.isDateValid()) {
                    this.setState(() => ({
                        hasErrors: false
                    }));
                }
            }
        }
    };

    // Shortcut for classic date selector so we don't have to pass in null for deliveryMethod
    handleDateOnlySelection = (...dateSelectionArgs) => this.handleDateSelection(null, ...dateSelectionArgs);

    checkout = () => {
        this.errors = {};

        // Of course! Check date is valid here, don't store it willy nilly in state (cos why?)
        if (!this.selectedDeliveryMethodId) {
            this.errors.deliveryOption = true;

            this.setState(() => ({
                hasErrors: true
            }));

            if (this.ref && this.ref.current ) {
                scrollToRef({ current: window }, this.ref, 200);
            }
            return;
        }

        if (!this.isDateValid()) {
            this.errors.deliveryTime = true;

            this.setState(() => ({
                hasErrors: true
            }));

            if (this.ref && this.ref.current ) {
                scrollToRef({ current: window }, this.ref, 200);
            }
            return;
        }

        if (this.state.hasCommentError) {
            return;
        }

        this.props.handleSubmit();
    };

    handleTdmClick = deliveryMethodId => {
        this.props.setTdmRevealed();
        this.triggerAnalyticsDeliveryMethodClicked(deliveryMethodId);

        // Check if this method is available
        const method = this.props.deliveryMethods?.items?.find(item => item.id === deliveryMethodId);

        if (method.status !== 'ACTIVE') {
            if (typeof window !== 'undefined') {
                const data = this.getAnalyticsData(deliveryMethodId);
                window.tippleAnalytics.trigger(AnalyticsEvents.delivery_method_denied, {
                    ...data,
                    reason: method?.unavailableTooltip
                });

                this.props.setAlertShowing(method?.unavailableTooltip);
            }
        }
    };
    
    getAnalyticsData = deliveryMethodId => {
        const method = this.props.deliveryMethods?.items?.find(item => item.id === deliveryMethodId);
        let data = {};

        if (method) {
            data = {
                delivery_method_id: method?.id,
                delivery_method: method?.name,
                delivery_fee: method?.zone && (method?.zone?.minimumDiscountCartTotal && this.props.cart?.subTotal > method?.zone?.minimumDiscountCartTotal ? method?.zone?.discountedCharge : method?.zone?.charge),
                description: method?.description,
                delivery_type: method?.deliveryType,
                delivery_display_type: method?.displayType,
                delivery_estimate: method?.deliveryEstimateMins,
                delivery_estimate_min: method?.deliveryEstimateMinMins,
                delivery_estimate_max: method?.deliveryEstimateMaxMins,
                unavailable_reason: method?.unavailableReason
            };
        }

        return data;
    };

    triggerAnalyticsDeliveryMethodClicked = (deliveryMethodId) => {
        if (deliveryMethodId && typeof window !== 'undefined') {
            global.tippleAnalytics.trigger(AnalyticsEvents.delivery_method_clicked, 
                this.getAnalyticsData(deliveryMethodId)
            );
        }
    };

    navigateBack = () => {
        this.props.history.push('/cart');
    };

    handleCommentChange = debounce(orderComment => {
        this.props.setOrderComment(orderComment);

        if (orderComment.length > MAX_ORDER_COMMENT_LENGTH) {
            if (this.state.hasCommentError !== true) {
                this.setState(() => ({
                    hasCommentError: true
                }));
            }
        } else {
            if (this.state.hasCommentError !== false) {
                this.setState(() => ({
                    hasCommentError: false
                }));
            }
        }
    }, 50);

    render() {
        const { cart, isLoading, clickToReveal, orderComment } = this.props;
        const { hasCommentError } = this.state;

        return <div className={styles.wrap}>
            <div className={styles['address-selector']}>
                {cart && <AddressSelector cart={cart} />}
            </div>
            <DateSelector 
                onChange={this.handleDateSelection}
                cartSubTotal={this.props.cart?.subTotal ?? 0}
                deliveryMethodId={this.props.cart?.deliveryMethodId}
                deliveryDate={this.props.cart?.deliveryDate}
                deliveryTimeMinutes={this.props.cart?.deliveryTimeMinutes}
                clickToReveal={clickToReveal}
                handleTdmClick={this.handleTdmClick}
            />
            <div ref={this.ref} className={styles.errors}>
            {this.state.hasErrors && <>
                {this.errors.deliveryTime && <div className="form-material text-center error--delivery-time">
                    <div className={styles.error}>
                        Delivery time required
                        <div className="fa fa-exclamation-triangle pull-left">
                        </div>
                    </div>
                </div>}
                {this.errors.deliveryOption && <div className="form-material text-center error--delivery-option">
                    <div className={styles.error}>
                        Delivery option required
                        <div className="fa fa-exclamation-triangle pull-left">
                        </div>
                    </div>
                </div>}
                </>}
            </div>
            <div className={styles.comments}>
                <OrderComments onChangeComment={this.handleCommentChange} comment={orderComment} hasError={hasCommentError} />
            </div>

            <ActionBar>
                <LabelValue className={styles.mobile} label="Delivery Time" value={cart?.deliveryTimeFooter} />
                <div className={styles.buttons}>
                    <button disabled={isLoading} className={classNames(styles['btn-cancel'])} onClick={this.navigateBack}>
                        Back to Cart
                    </button>
                    <button disabled={isLoading} type="submit" className={classNames(styles['btn-submit'])}
                        onClick={this.checkout}
                    >
                        Continue
                    </button>
                </div>
            </ActionBar>
            <AlertPopup />
        </div>
    }
}

const mapStateToProps = ({ auth, DELIVERY_METHOD, cart, orderComment }) => ({
    auth,
    cartGuid: cart?.currentCart,
    deliveryMethods: DELIVERY_METHOD,
    clickToReveal: (DELIVERY_METHOD?.items ?? []).some(method => method?.enableTDMClickToReveal),
    isLoading: DELIVERY_METHOD?.isRequesting || cart?.isRequestingDelivery,
    orderComment: orderComment?.comment ?? ''
});

const mapDispatchToProps = dispatch => ({
    setDeliveryTime: bindActionCreators(setDeliveryTime, dispatch),
    deliveryMethodActions: bindActionCreators(deliveryMethodRedux.actionCreators, dispatch),
    setTdmRevealed: bindActionCreators(setTdmRevealed, dispatch),
    setAlertShowing: bindActionCreators(setAlertShowing, dispatch),
    setOrderComment: bindActionCreators(setOrderComment, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Delivery);
