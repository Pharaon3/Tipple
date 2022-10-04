import React, { Component } from 'react';
import OrderItems from 'app/components/order-details/OrderItems';

import styles from './OrderDetails.module.scss';

export default class OrderDetails extends Component {
    state = {
        attemptedCheckout: false
    };

    goBack = () => {
        this.props.history.push(this.props.order.cart.storePath + '/categories');
    };

    reorder = () => {
        this.props.history.push('/checkout');
    };

    getDate = deliveryDate => {
        const delivery = new Date(deliveryDate);
        return delivery.toDateString();
    };

    render() {
        return (
            <div className={styles.wrap}>
                <div className="row clearfix">
                    <div className="form-group address-search cart-search-address">
                        <div>
                            <div className="row mb-5">
                                <div className="col-xs-10 ml-12">
                                    <div className="cart-input-container">
                                        <span>Delivery To: </span>
                                        <span className="delivery-date-text">{this.props.order.address.formattedAddress}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row clearfix">
                    <div className="form-group address-search cart-search-address">
                        <div>
                            <div className="row mb-5">
                                <div className="col-xs-10 ml-12">
                                    <div className="cart-input-container">
                                        <span>Delivery Date: </span>
                                        <span className="delivery-date-text">{this.getDate(this.props.order.delivered)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row clearfix cart-item-holder" id="cartItemHolder">
                    {this.props.order.cart && <OrderItems items={this.props.order.cart.items} />}
                </div>
            </div>
        );
    }
}
