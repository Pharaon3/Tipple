import React, { Component } from 'react';
import classNames from 'classnames';
import Modal from 'app/components/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sendNotifyExpanding, hideAddressUnserviceablePopup } from 'app/resources/action/AddressUnserviceable';

import styles from './AddressUnserviceable.module.scss';

class AddressUnserviceablePopup extends Component {

    closeClick = (ev) => {
        ev.preventDefault();

        this.props.hideAddressUnserviceablePopup();
    }

    redirect = (redirectUrl) => {
        // do analytics here
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 100);
    }

    render() {

        const { title, description, url, buttonText } = this.props.address?.outOfZone ?? {};

        return (
            this.props.displayAddressUnserviceable ? <Modal analyticsMessage="We'll be arriving in your area very soon" analyticsType="popup" analyticsFrom={window.location.pathname}>
                <div className={styles.overlay} id="addressUnserviceableModal">
                    <div onClick={this.closeClick} className="loading-overlay-transparent orange fadein"></div>
                    <div className={classNames(styles.content, 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>
                        <div className="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                            <span className="ui-dialog-title">
                                {title && <h1>{title}</h1>}
                                <a href="#close" onClick={this.closeClick} role="button" className="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all">
                                    <span className="fa fa-fw fa-close"></span>
                                </a>
                            </span>
                        </div>
                        <div className={classNames(styles.body, "ui-dialog-content ui-widget-content")} dangerouslySetInnerHTML={{
                            __html: description
                        }} />
                        <div className="ui-dialog-footer ui-widget-content">
                            <div className="row">
                                <div className="col-xs-12">
                                    <button onClick={() => this.redirect(url)} className="btn btn-primary btn-lg btn-block mt-15">{buttonText || 'Continue'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal> : null
        );
    }
}


const mapStateToProps = state => ({
    displayAddressUnserviceable: state.auth.displayAddressUnserviceable,
    isSendingNotifyExpanding: state.auth.isSendingNotifyExpanding,
    successMessage: state.auth.sneSuccessMessage,
    errorMessage: state.auth.sneErrorMessage,
    address: state.address.geocodedAddress
});

const mapDispatchToProps = (dispatch) => ({
    sendNotifyExpanding: bindActionCreators(sendNotifyExpanding, dispatch),
    hideAddressUnserviceablePopup: bindActionCreators(hideAddressUnserviceablePopup, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddressUnserviceablePopup);
