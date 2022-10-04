import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Spinner from 'app/components/Spinner';
import registerBraintreeTokenRedux from 'app/resources/api/braintreeToken';
import Braintree from 'app/components/checkout/Braintree';

import styles from './Payment.module.scss';

const braintreeTokenRedux = registerBraintreeTokenRedux('BRAINTREE_TOKEN', ['QUERY']);

class CheckoutPayment extends Component {

    componentDidMount() {
        this.props.btActions.query(this.props.auth);
    }

    sendNonceToServer = (payload) => {
        this.props.onSubmit(payload);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.auth.currentUser === null && this.props.auth.currentUser !== null) {
            this.props.btActions.query(this.props.auth);
            return;
        }

        if (prevProps.checkout.isRequestingCreate && !this.props.checkout.isRequestingCreate && ((this.props.checkout.item && this.props.checkout.item.consumedBraintree) || (this.props.checkout.additional && this.props.checkout.additional.consumedBraintree))) {
            this.props.btActions.query(this.props.auth);
            return;
        }
    }

    render() {
        let isBraintreeActive = this.props.bt && this.props.bt.hasRequested;

        // TODO: This can certainly be handled better
        return <div className={styles.payment}>
            {isBraintreeActive ? <Braintree
                    total={this.props.cart.currentCart.total}
                    userDataIsValid={this.props.userDataIsValid}
                    handleFormError={this.props.handleFormError}
                    cartId={this.props.cart.currentCart.cartGuid}
                    containsTobacco={this.props.cart.currentCart.containsTobacco}
                    handlePaymentMethod={this.sendNonceToServer}
                    authorizationToken={this.props.bt.data}
                />
            :
                <div className="row mt-24">
                    <div className="col-xs-12">
                        <div className="row section">
                            <div className="col-xs-12">
                                <div className="row">
                                    <div className="col-xs-12 title mb-24">Payment Details</div>
                                </div>
                            </div>

                            <div className="col-xs-12" style={{ paddingBottom: '100px' }}>
                                <Spinner />
                            </div>
                        </div>
                    </div>
                </div>
            }
            {this.props.children}
        </div>
    }
}


const mapStateToProps = (state, props) => ({
    auth: state.auth,
    cart: state.cart,
    checkout: state.CHECKOUT,
    bt: state.BRAINTREE_TOKEN
});

const mapDispatchToProps = (dispatch) => ({
    btActions: bindActionCreators(braintreeTokenRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPayment);