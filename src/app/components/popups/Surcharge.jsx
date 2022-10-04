import React, { Component } from 'react';
import Modal from 'app/components/Modal';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideSurchargePopup } from 'app/resources/action/Cart';

import styles from './Surcharge.module.scss';

class SurchargePopup extends Component {

    closeClick = (ev) => {
        ev.preventDefault();

        this.props.hideSurchargePopup();
    }

    checkout = () => {
        this.props.hideSurchargePopup();
        this.props.history.push('/delivery');
    }

    render() {
        return this.props.displaySurchargePopup ? <Modal analyticsMessage="Minimum Order Surcharge" analyticsType="popup" analyticsFrom={window.location.pathname}>
            <div className={styles.overlay}>
                <div onClick={this.closeClick} className="loading-overlay-transparent orange fadein"></div>
                <div className={classNames(styles.content, 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>

                    <div className="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                        <span className="ui-dialog-title">
                            <h1>Minimum Not Reached</h1>
                        </span>
                    </div>
                    <div className="ui-dialog-content ui-widget-content">
                        <div className="text-center">
                            Uh oh! Your order is below our minimum of ${this.props.minSpend}.
                        </div>
                        <br />
                        <div className="text-center">
                            Either add more items to your order or continue with the difference added as a 'small order fee'.
                        </div>
                        <br />
                        <div>
                            <div className="col-xs-6"> <button onClick={this.closeClick} className="btn btn-primary btn-lg btn-block btn-cancel mt-15">Back</button></div>
                            <div className="col-xs-6"> <button onClick={this.checkout} className="btn btn-primary btn-lg btn-block mt-15">Continue</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal> : null
    }
}


const mapStateToProps = state => ({
    displaySurchargePopup: state.cart.displaySurchargePopup
});

const mapDispatchToProps = (dispatch) => ({
    hideSurchargePopup: bindActionCreators(hideSurchargePopup, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SurchargePopup);
