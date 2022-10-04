import React, { Component } from 'react';
import classNames from 'classnames';
import Modal from 'app/components/Modal';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { confirmAddress, confirmAddressCancel } from 'app/resources/action/Address';

import styles from './ConfirmAddress.module.scss';

class ConfirmAddressPopup extends Component {

    handleClose = (ev) => {
        ev.preventDefault();

        this.props.confirmAddressCancel();
    }

    handleConfirm = () => {

        this.props.confirmAddress(this.props.geocodedAddress, this.props.auth, this.props.history, this.props.didAttemptGeocodeAddress);
    }

    render() {

        let formattedAddress = "";

        if (this.props.geocodedAddress) {
            formattedAddress = this.props.geocodedAddress.formattedAddress;

            if (formattedAddress === undefined) {
                // TODO: This should be a standard address formatted function
                formattedAddress = `${this.props.geocodedAddress.addressLine1}, ${this.props.geocodedAddress.city}, ${this.props.geocodedAddress.state}, ${this.props.geocodedAddress.postcode}`;
            }
        }

        return <>
            {this.props.displayAddressConfirmation && <Modal analyticsMessage="Is This Correct?" analyticsType="popup" analyticsFrom={window.location.pathname}>
                <div className={styles.overlay}>

                    <div onClick={this.handleClose} className="loading-overlay-transparent orange fadein"></div>
                    <div className={classNames(styles['confirm-address'], 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>
                        <div className="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                            <span className="ui-dialog-title">
                                <h1>Is This Correct?</h1>
                                <a href="#confirm-address" onClick={this.handleClose} role="button" className="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all">
                                    <span className="fa fa-fw fa-close i-20"></span>
                                </a>
                            </span>
                        </div>
                        <div className="ui-dialog-content ui-widget-content text-center">
                            {formattedAddress}
                        </div>
                        <div className="ui-dialog-footer ui-widget-content">
                            <div className="row">
                                <div className="col-xs-6 text-center">
                                    <button onClick={this.handleClose} className="btn btn-primary btn-block bn-lg btn-cancel">Back</button>
                                </div>
                                <div className="col-xs-6 text-center">
                                    <button onClick={this.handleConfirm} className="btn btn-primary btn-block bn-lg" id="confirmAddressContinueBtn">Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal>}
        </>

    }
}


const mapStateToProps = (state, props) => ({
    auth: state.auth,
    displayAddressConfirmation: state.address.displayAddressConfirmation,
    geocodedAddress: state.address.geocodedAddress,
    didAttemptGeocodeAddress: state.address.didAttemptGeocodeAddress
});

const mapDispatchToProps = (dispatch) => ({
    confirmAddress: bindActionCreators(confirmAddress, dispatch),
    confirmAddressCancel: bindActionCreators(confirmAddressCancel, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmAddressPopup);