import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import CartItems from 'app/components/cart/Items';
import ActionBar from 'app/components/ActionBar';
import LabelValue from 'app/components/checkout-flow/LabelValue';
import PrivacyPolicy from 'app/components/PrivacyPolicy';

import SurchargePopup from 'app/components/popups/Surcharge';

import formatCurrency from 'lib/currency';
import { AnalyticsEvents } from 'lib/analytics';

import styles from './Cart.module.scss';

export class Cart extends PureComponent {
  state = {
    dateValid: false,
    attemptedCheckout: false,
    hasErrors: false,
  };

  constructor(props) {
    super(props);

    this.selectedDeliveryMethodId = null;
    this.selectedDate = null;
    this.selectedTime = null;
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      global.tippleAnalytics.trigger(AnalyticsEvents.cart_viewed, {
        cart: this.props.cart,
      });
    }
  }

  checkout = () => {
    this.props.handleSubmit();
  };

  navigateBack = () => {
    this.props.history.push(
      this.props.cart?.storePath
        ? `${this.props.cart?.storePath}/categories`
        : '/'
    );
  };

  render() {
    let cartItemCt = 0;

    if (this.props.cart) {
      cartItemCt = this.props.cart.items.length;
    }

    return (
      <>
        <div
          className={classNames(styles.cart, styles.content)}
          id="cartItemHolder"
        >
          {this.props.cart && <CartItems items={this.props.cart.items} />}

          <div className={styles['order-total']}>
            <LabelValue
              label="Cart Total"
              value={formatCurrency('$', this.props.cart?.subTotal, 0, 2)}
            />
          </div>
        </div>
        <PrivacyPolicy section="cart" />
        <ActionBar>
          <LabelValue
            className={styles.mobile}
            label="Cart Total"
            value={formatCurrency('$', this.props.cart?.subTotal, 0, 2)}
          />
          <div className={styles.buttons}>
            <button
              className={classNames(styles['btn-cancel'])}
              onClick={this.navigateBack}
            >
              Back to Shop
            </button>
            <button
              type="submit"
              disabled={cartItemCt === 0}
              className={classNames(styles['btn-submit'])}
              onClick={this.checkout}
            >
              Continue
            </button>
          </div>
        </ActionBar>
        {this.props.cart && (
          <SurchargePopup
            surcharge={this.props.cart.surcharge}
            minSpend={this.props.cart.minSpend}
            history={this.props.history}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = ({ auth, DELIVERY_METHOD, cart }) => ({
  auth,
  cart: cart?.currentCart,
  addressZoneId:
    cart && cart.currentCart && cart.currentCart.address
      ? cart.currentCart.address.zoneId
      : null,
});

export default connect(mapStateToProps)(Cart);
