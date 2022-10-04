import React from 'react';
import classNames from 'classnames';
import * as dropin from 'braintree-web-drop-in';

import formatCurrency from 'lib/currency';
import { AnalyticsEvents } from 'lib/analytics';
import ActionBar from 'app/components/ActionBar';

import styles from './Braintree.module.scss';

class BraintreeDropIn extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            dropInInstance: null,
            isSubmitButtonDisabled: true,
            newPaymentMethod: false,
            lastPaymentMethodSelected: null
        }
    }

    componentDidMount = () => {
        if (this.state.dropInInstance) {
            return;
        }
        this.setup()
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (
            this.props.authorizationToken &&
            this.state.dropInInstance &&
            (prevProps.authorizationToken !== this.props.authorizationToken)
        ) {
            this.tearDown().then(() => {
                this.setState({
                    dropInInstance: null,
                    isSubmitButtonDisabled: true
                }, () => {
                    this.setup()
                })
            }).catch((err) => {
                console.warn("CHECKOUT CDU - TEARDOWN", err);
            })
        }

        if (this.state.isSubmitButtonDisabled === true && this.state.dropinInstance && this.state.dropinInstance.isPaymentMethodRequestable()) {
            this.setState({
                isSubmitButtonDisabled: false
            })
        }
    }

    componentWillUnmount = () => {
        if (!this.state.dropInInstance) {
            return;
        }

        this.tearDown().catch((err) => {
            console.warn(err);
        });
    }

    setup = () => {
        const options = {
            vaultManager: true,
            locale: 'en_AU',
            paypal: {
                flow: 'vault'
            },
            authorization: this.props.authorizationToken,
            container: '.dropin-container',
            card: {
                cardholderName: {
                    required: true
                }
            }
        }

        dropin.create(options, (err, dropinInstance) => {
            if (err) {
                return
            }

            if (dropinInstance.isPaymentMethodRequestable()) {
                this.setState({
                    isSubmitButtonDisabled: false
                })
            }

            dropinInstance.on('paymentMethodRequestable', (event) => {
                let newPaymentMethod = !!!event.paymentMethodIsSelected;
                if (this.state.isSubmitButtonDisabled === true) {
                    newPaymentMethod = true;
                }
                
                this.setState({
                    isSubmitButtonDisabled: false,
                    newPaymentMethod: newPaymentMethod
                })
            })

            dropinInstance.on('paymentOptionSelected', (event) => {
                this.setState({
                    lastPaymentMethodSelected: event.paymentOption
                })
            })

            dropinInstance.on('noPaymentMethodRequestable', () => {
                this.setState({
                    isSubmitButtonDisabled: true
                })
            })

            this.setState({
                dropInInstance: dropinInstance
            })
        })
    }


    tearDown = () => {
        return new Promise((resolve, reject) => {
            this.state.dropInInstance.teardown((err) => {
                if (err) {
                    return reject(err)
                } else {
                    return resolve()
                }
            })
        })
    }

    handleSubmit = (event) => {
        this.props.handleFormError();

        if (this.props.userDataIsValid && this.state.dropInInstance && !this.state.isSubmitButtonDisabled) {
            this.setState({ isSubmitButtonDisabled: true }, () => {
                this.state.dropInInstance.requestPaymentMethod((err, payload) => {

                    let paymentType = !this.state.newPaymentMethod ? 'existing' : this.state.lastPaymentMethodSelected;

                    this.setState({
                        isSubmitButtonDisabled: false
                    })

                    if (err) {
                        window.tippleAnalytics.trigger(AnalyticsEvents.checkout_new_payment_failed, { 'payment': { 'payment_method': this.state.lastPaymentMethodSelected, 'error_code': err } });
                    } else {
                        this.props.handlePaymentMethod(payload);
                        if (paymentType !== 'existing') {
                            window.tippleAnalytics.trigger(AnalyticsEvents.checkout_new_payment, { 'payment': { 'payment_method': this.state.lastPaymentMethodSelected } });
                        }
                    }
                })
            })
        } else {
            this.setState({ error: true });
        }
    }

    render = () => {
        return (
            <div>
                <div className="row mt-24">
                    <div className="col-xs-12">
                        <div className="row section">
                            <div className="col-xs-12">
                                <div className="row">
                                    <div className="col-xs-12 title" style={{ marginBottom: "-24px" }}>Payment Details</div>
                                </div>
                            </div>

                            <div className="col-xs-12" >
                                <div className='dropin-container' />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row mt-24">
                    <div className="col-sm-8 col-sm-offset-2">
                        {this.state.error && !this.props.userDataIsValid && <p className="col-xs-8 col-xs-offset-2 field error-message pt-10 mb-10 text-center error-text">Please fill in the required fields</p>}
                        {this.state.error && this.state.isSubmitButtonDisabled && <p className="col-xs-8 col-xs-offset-2 field error-message pt-10 mb-10 text-center error-text">Please select a payment method</p>}
                    </div>
                </div >

                {/* Absolutely positioned to make room for the cart items section in <Payment /> as its parent. Needs to be done better :( */}
                <ActionBar className={styles.actions}>
                    <div className={styles.buttons}>
                        <button type="submit" className={classNames(styles['btn-submit'])}
                            onClick={this.handleSubmit}
                        >
                            Place Order ({formatCurrency('$', this.props.total, 0, 2)})
                        </button>
                    </div>
                </ActionBar>
            </div>

        )
    }
}

export default BraintreeDropIn;