import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ssrComponent } from 'lib/ssrHelper';
import UserAndOrderDetails from 'app/components/checkout/UserAndOrderDetails';
import CheckoutPayment from 'app/components/checkout/Payment';
import CartErrors from 'app/components/checkout-flow/CartErrors';
import classNames from 'classnames';

import formatDate from 'date-fns/format';
import formatCurrency from 'lib/currency';

import LabelValue from 'app/components/checkout-flow/LabelValue';
import Spinner from 'app/components/Spinner';
import PrivacyPolicy from 'app/components/PrivacyPolicy';
import PromotionCode from 'app/components/checkout/PromotionCode';
import SubTotals from 'app/components/checkout/SubTotals';

import { displayLoginPopup } from 'app/resources/action/Login';
import { refreshCart } from 'app/resources/action/Cart';
import { verifyToken } from 'app/resources/action/VerifyToken';
import { clearOrderComment } from 'app/resources/modules/orderComment';

import registerCheckoutRedux from 'app/resources/api/orderCheckout';
import registerDeliveryMethodRedux from 'app/resources/api/deliveryMethod';
import { AnalyticsEvents } from 'lib/analytics';

import Cookies from 'js-cookie';
import config from 'app/config';
import { SITE_ID_BUSINESS } from 'lib/constants/app';

import styles from './Checkout.module.scss';
import { getItem } from 'lib/util/localStorage';

const checkoutRedux = registerCheckoutRedux('CHECKOUT', ['CREATE']);
const deliveryMethodRedux = registerDeliveryMethodRedux('DELIVERY_METHOD', [
  'LIST',
]);
const siteId = getItem('tipple_site_id') || config.siteId;

const isTippleBusiness = siteId === SITE_ID_BUSINESS;

// Delivery methods to only show checkoutDescription for (not day / time generated text)
// TODO: Add to a constants file more central for access from other areas.
const checkoutDescriptionMethods = ['ASAP', 'SHIPPING'];

class CheckoutPage extends Component {
  state = {
    userDataIsValid: false,
    cpSubmitted: false,
  };

  static async getInitialProps(props) {
    if (props.cart && props.cart?.address?.zoneId) {
      await props.deliveryMethodActions.list(props.auth, {
        zoneId: props.cart.address.zoneId,
      });
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    if (!this.props.cart) {
      this.props.history.push('/');
      return;
    }

    if (!this.props.cart.deliveryDate || !this.props.cart.deliveryTimeMinutes) {
      if (!this.props.cart.deliveryMethodId) {
        this.props.history.push('/cart');
      }
    }

    if (this.props.cart.items.length === 0) {
      this.props.history.push('/cart');
    }

    const data = {
      cart: this.props.cart,
      address: this.props.cart.address,
      checkout: Object.assign({}, this.state.userData),
    };
    window.tippleAnalytics.trigger(AnalyticsEvents.checkout_viewed, data);
  }

  componentWillUnmount() {
    this.props.checkoutActions.clear();
  }

  componentDidUpdate(prevProps) {
    // The current shopping cart doesn't have a delivery date / time set
    if (this.props.cart) {
      if (
        !this.props.cart.deliveryDate ||
        !this.props.cart.deliveryTimeMinutes
      ) {
        if (!this.props.cart.deliveryMethodId) {
          this.props.history.push('/delivery');
        }
      }
    }

    // A checkout request has finished
    if (
      prevProps.checkout.isRequestingCreate &&
      !this.props.checkout.isRequestingCreate
    ) {
      if (this.props.checkout.errors && this.props.checkout.errors.length > 0) {
        let error_code = [];
        let error_message = [];
        let error_body = [];
        let priceMismatch = false;
        this.props.checkout.errors.forEach((error) => {
          if (error.code === 'CART_PRICE_MISMATCH') {
            priceMismatch = true;
          }
          error_code.push(error.code);
          error_message.push(error.displayMessage);
          error_body.push(error.developerMessage);
        });

        const data = {
          cart: this.props.cart,
          address: this.props.cart.address,
          checkout: Object.assign({}, this.state.userData),
          data: {
            error_code: error_code.join(', '),
            error_message: error_message.join(', '),
            error_body: error_body.join(', '),
          },
        };
        window.tippleAnalytics.trigger(AnalyticsEvents.checkout_failed, data);

        if (priceMismatch) {
          this.props.refreshCart(this.props.auth);
        }
      }

      let token =
        this.props.checkout.additional && this.props.checkout.additional.token;
      if (this.props.checkout.item && this.props.checkout.item.token) {
        token = this.props.checkout.item.token;

        const accountData = {
          cart: this.props.cart,
          address: this.props.cart.address,
          checkout: Object.assign(
            { paymentType: this.props.checkout.item.paymentType },
            this.state.userData
          ),
          order: {
            orderNumber: this.props.checkout.item.orderNumber,
            orderId: this.props.checkout.item.orderId,
          },
        };

        if (typeof window !== 'undefined') {
          window.tippleAnalytics.trigger(
            AnalyticsEvents.account_created,
            accountData
          );
          window.tippleAnalytics.trigger(
            AnalyticsEvents.user_login_success,
            {}
          );
        }
      }

      if (token) {
        // TODO: This needs to be handled better. There should be a common function for setting token
        let date = new Date();
        date.setHours(date.getHours() + 87600);
        Cookies.set(config.authenticationCookie, token, {
          path: '/',
          expires: date,
          secure: !(config && config.insecureCookies === true),
        });

        this.props.verifyToken(
          token,
          this.props.auth.userIdentifier,
          this.props.auth.deviceIdentifier
        );
      }

      if (this.props.checkout.item && this.props.checkout.item.orderNumber) {
        const data = {
          cart: this.props.cart,
          address: this.props.cart.address,
          checkout: Object.assign(
            { paymentType: this.props.checkout.item.paymentType },
            this.state.userData
          ),
          order: {
            orderNumber: this.props.checkout.item.orderNumber,
            orderId: this.props.checkout.item.orderId,
          },
          isTippleTracking: this.props.checkout?.item?.isTippleTracking,
        };
        if (typeof window !== 'undefined') {
          window.tippleAnalytics.trigger(
            AnalyticsEvents.ecommerce_purchase,
            data
          );
          window.tippleAnalytics.trigger(
            AnalyticsEvents.checkout_process_completed,
            data
          );
        }
        this.props.clearOrderComment();
        this.props.history.push(
          `/track/${this.props.checkout?.item?.orderTrackingGuid}`
        );
      }
    }
  }

  handleLogin = (ev) => {
    ev.preventDefault();
    this.props.displayLoginPopup();
  };

  handleFormError = () => {
    this.formik.handleSubmit();
  };

  setFormRef = (r) => {
    this.formik = r;
  };

  handleUpdateUserData = (isValid, data) => {
    this.setState({
      userDataIsValid: isValid,
      userData: data,
    });
  };

  handleConfirmCheckOut = (data) => {
    if (data === undefined) {
      return;
    }

    let grn = this.state.userData.giftRecipientNumber;
    grn = grn.replace(/\s+/g, '');
    if (grn === '0_________') {
      grn = '';
    }

    let checkoutData = {
      firstName: this.state.userData.firstName,
      lastName: this.state.userData.lastName,
      mobileNumber: this.state.userData.mobile.replace(/\s+/g, ''),
      email: this.state.userData.email,
      dateOfBirth: this.state.userData.dob.split('/').reverse().join('-'),
      password: this.state.userData.password,

      braintreeNonce: data.nonce,

      // Required for cart API
      chargeAmount: this.props.cart?.total,
    };

    if (isTippleBusiness) {
      checkoutData.businessName = this.state.userData.businessName;
      if (this.state.userData.showAccountsEmail) {
        checkoutData.invoiceForwardingEmail =
          this.state.userData.invoiceForwardingEmail;
      }
    }

    if (this.props.orderComment) {
      checkoutData.comment = this.props.orderComment;
    }

    if (this.state.userData.gift) {
      checkoutData.isGift = true;
      checkoutData.giftMessage = this.state.userData.giftMessage;
      checkoutData.giftRecipient = this.state.userData.giftRecipient;
      checkoutData.giftRecipientNumber = grn;
    }

    this.props.checkoutActions.create(checkoutData, this.props.auth);
  };

  getDeliveryMessage = () => {
    let deliveryMessage = '';

    if (
      this.props.cart.deliveryMethod &&
      checkoutDescriptionMethods.includes(
        this.props.cart.deliveryMethod.deliveryType
      )
    ) {
      if (this.props.cart.deliveryMethod.checkoutDescription) {
        deliveryMessage = this.props.cart.deliveryMethod.checkoutDescription;
      } else {
        deliveryMessage = `${this.props.cart.deliveryMethod.name} (${this.props.cart.deliveryMethod.description})`;
      }
    } else {
      let deliveryTime = null; //'ASAP';
      let deliveryDay = null; //'Today';

      const selectedMethod =
        this.props.deliveryMethods && this.props.deliveryMethods.items
          ? this.props.deliveryMethods.items.find(
              (method) => method.id === this.props.cart.deliveryMethodId
            )
          : null;

      if (!selectedMethod) {
        return false;
      }

      selectedMethod.days.forEach((day) => {
        let cDate = this.props.cart.deliveryDate;

        if (cDate === day.date) {
          day.hours.forEach((h) => {
            if (h.minutes === this.props.cart.deliveryTimeMinutes) {
              deliveryTime = h.label;
            }
          });

          deliveryDay = day.isToday
            ? 'Today'
            : day.isTomorrow
            ? 'Tomorrow'
            : formatDate(new Date(day.date), 'dddd, Do MMM');
        }
      });

      deliveryMessage = `${deliveryTime || ''} / ${deliveryDay || ''}`;
    }

    return deliveryMessage;
  };

  /**
   * Loop through the given delivery method data and confirm that we have a valid selection based on
   * what is set in their cart and what the delivery methods API call returned. This is most likely
   * to occur when a user selects a delivery time, proceeds to the checkout page, and then leaves the
   * page or leaves it entirely and comes back minutes or hours later, meaning their previous selection
   * is now in the past and no longer valid. If this happens, componentDidMount and componentDidUpdate
   * above will use this determination to kick the user back to the cart page, which handles selection
   * of a new delivery day and time.
   */
  hasValidDeliveryTime = () => {
    if (
      this.props.cart.deliveryMethod &&
      checkoutDescriptionMethods.includes(
        this.props.cart.deliveryMethod.deliveryType
      )
    ) {
      return true;
    } else {
      let validDeliveryTime = null;
      let validDeliveryDay = null;

      const selectedMethod =
        this.props.deliveryMethods && this.props.deliveryMethods.items
          ? this.props.deliveryMethods.items.find(
              (method) => method.id === this.props.cart.deliveryMethodId
            )
          : null;

      if (!selectedMethod) {
        return false;
      }

      selectedMethod.days.forEach((day) => {
        let cDate = this.props.cart.deliveryDate;

        if (cDate === day.date) {
          day.hours.forEach((h) => {
            if (h.minutes === this.props.cart.deliveryTimeMinutes) {
              validDeliveryTime = true;
            }
          });

          validDeliveryDay = true;
        }
      });

      return validDeliveryDay && validDeliveryTime;
    }
  };

  render() {
    if (
      !this.props.cart ||
      ((!this.props.cart.deliveryDate ||
        !this.props.cart.deliveryTimeMinutes) &&
        !this.props.cart.deliveryMethodId)
    ) {
      return <div />;
    }

    let deliveryMessage = this.getDeliveryMessage();

    const isLoadingCheckout = this.props.checkout.isRequestingCreate;

    return (
      <>
        {isLoadingCheckout ? (
          <div className="loading-overlay-transparent orange fadein">
            <div className={classNames(styles.message, 'message')}>
              <h2>
                <Spinner />
                Processing your order. Please don't click back or refresh.
              </h2>
            </div>
          </div>
        ) : null}
        <div className={classNames(styles.checkout, 'checkout clearfix')}>
          <div className="left-container mb-24 col-xs-12 col-sm-12 col-md-offset-2 col-md-8">
            <div className="row">
              <div className="col-xs-12">
                <div className="row section">
                  <div className="col-xs-12">
                    <div className="row">
                      <div className="col-xs-12 title mb-4">
                        Delivery Details
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12">
                      <Link to="/delivery">
                        <button
                          onClick={this.changeAddress}
                          id="checkoutChangeDeliveryBtn"
                          type="submit"
                          className="btn btn-primary pull-right"
                        >
                          Change
                        </button>
                      </Link>
                      <div className="mt-10 ml-10">
                        <strong>Address: </strong>{' '}
                        {this.props.cart.address.formattedAddress}
                      </div>
                      <div className="mt-10 ml-10">
                        <strong>Delivery: </strong>
                        {deliveryMessage}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <UserAndOrderDetails
              handleLogin={this.handleLogin}
              setFormRef={this.setFormRef}
              onUpdateUserData={this.handleUpdateUserData}
            />
            <CheckoutPayment
              isSubmitting={this.props.checkout.isRequestingCreate}
              userDataIsValid={this.state.userDataIsValid}
              handleFormError={this.handleFormError}
              onSubmit={this.handleConfirmCheckOut}
            >
              <div>
                <div className={styles.row}>
                  <div className={classNames(styles.col, 'title mb-8')}>
                    Order Summary
                  </div>
                </div>
                <SubTotals items={this.props.cart?.lineItems} />
                {this.props.cart && <PromotionCode cart={this.props.cart} />}
                <div className={styles['order-total']}>
                  <LabelValue
                    label="Order Total"
                    value={formatCurrency('$', this.props.cart?.total, 0, 2)}
                  />
                </div>
              </div>
            </CheckoutPayment>

            <CartErrors errors={this.props.checkoutErrors} />

            <div className="col-xs-8 col-xs-offset-2">
              <PrivacyPolicy section="checkout" />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, props) => ({
  auth: state.auth,
  user: state.auth.currentUser,
  cart: state.cart.currentCart,
  searchParams: state.searchParams,
  checkout: state.CHECKOUT,
  checkoutErrors:
    state.CHECKOUT?.errors?.map((error) => error?.displayMessage) ?? null,
  deliveryMethods: state.DELIVERY_METHOD,
  orderComment: state.orderComment?.comment ?? null,
});

const mapDispatchToProps = (dispatch) => ({
  displayLoginPopup: bindActionCreators(displayLoginPopup, dispatch),
  refreshCart: bindActionCreators(refreshCart, dispatch),
  verifyToken: bindActionCreators(verifyToken, dispatch),
  checkoutActions: bindActionCreators(checkoutRedux.actionCreators, dispatch),
  deliveryMethodActions: bindActionCreators(
    deliveryMethodRedux.actionCreators,
    dispatch
  ),
  clearOrderComment: bindActionCreators(clearOrderComment, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ssrComponent(CheckoutPage));
