import React, { Component } from 'react';
import classNames from 'classnames';
import Modal from 'app/components/Modal';
import { AnalyticsEvents } from 'lib/analytics';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hideAddressAlternativeStorePopup, displayAddressUnserviceablePopup } from 'app/resources/action/AddressUnserviceable';

import styles from './AddressAlternativeStore.module.scss';

class AddressAlternativeStorePopup extends Component {

    closeClick = (ev) => {
        ev.preventDefault();

        this.props.hideAddressAlternativeStorePopup();
    };

    handleRequestClick = (alternativeZone = {}) => {
        const { address } = this.props;
        this.props.displayAddressUnserviceablePopup();

        const payload = {
            street: address.addressLine1,
            city: address.suburb,
            postalCode: address.postcode,
            state: address.state,
            country: address.country,
            lat: address.lat,
            lng: address.lng,
            redirectUrl: alternativeZone.redirectURL,
            redirectSite: alternativeZone.siteName,
            redirectSiteId: alternativeZone.siteId,
            zoneId: alternativeZone.zoneId
        };

        const analyticsData = {
            modal: {
                message: alternativeZone.siteName || 'Unset',
                from: window.location.pathname ? window.location.pathname : 'Unset',
                type: 'popup',
                action: 'request_tipple',
                payload
            }
        };

        window.tippleAnalytics.trigger(AnalyticsEvents.user_alert_action, analyticsData);
    };

    redirect = (redirectUrl, alternativeZone = {}) => {
        const { address } = this.props;

        const payload = {
            street: address.addressLine1,
            city: address.suburb,
            postalCode: address.postcode,
            state: address.state,
            country: address.country,
            lat: address.lat,
            lng: address.lng,
            redirectUrl: alternativeZone.redirectURL,
            redirectSite: alternativeZone.siteName,
            redirectSiteId: alternativeZone.siteId,
            zoneId: alternativeZone.zoneId
        };

        const analyticsData = {
            modal: {
                message: alternativeZone.siteName || 'Unset',
                from: window.location.pathname ? window.location.pathname : 'Unset',
                type: 'popup',
                action: 'confirm',
                payload
            }
        };

        window.tippleAnalytics.trigger(AnalyticsEvents.user_alert_action, analyticsData);

        // Slight timeout to give pre-redirect analytics event time to fire.
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 100);
    };

    render() {
        const props = this.props;

        if (!this.props.displayAddressAlternativeStore) {
            return null;
        }

        let alternativeZone = this.props.address && this.props.address.zones.filter(zone => {
            return zone;
        });

        if (!alternativeZone) {
            return null;
        }

        alternativeZone = alternativeZone[0];
        const redirectUrl = alternativeZone.redirectURL + (alternativeZone.redirectWithAddress ? `?encryptedAddress=${encodeURIComponent(props.address.encryptedAddress)}` : '');
        const redirectTitle = alternativeZone.redirectTitle || '';
        const redirectButtonText = alternativeZone.redirectButtonText || 'Continue';
        
        // if (alternativeZone.siteId === SITE_ID_WAREHOUSE) {
        //     const redirect = () => { this.redirect(redirectUrl, alternativeZone); };
        //     const request = () => { this.handleRequestClick(alternativeZone); };
        //     return (
        //         <AlternativeStoreWarehousePopup zone={alternativeZone} onCloseModal={this.closeClick} goToAlternativeStore={redirect} onRequestClick={request} />
        //     );
        // } else {
            return (
                <Modal analyticsMessage={alternativeZone.siteName} analyticsType="popup" analyticsFrom={window.location.pathname}>
                    <div className={styles.overlay} id="addressUnserviceableModal">
                        <div onClick={this.closeClick} className="loading-overlay-transparent orange fadein"/>
                        <div className={classNames(styles.content, 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>
                            <div className="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                                <span className="ui-dialog-title">
                                    {redirectTitle && <h1>{redirectTitle}</h1>}
                                    <a href="#close" onClick={this.closeClick} role="button" className="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all">
                                        <span className="fa fa-fw fa-close"/>
                                    </a>
                                </span>
                            </div>
                            <div className={classNames(styles.body, "ui-dialog-content ui-widget-content")} dangerouslySetInnerHTML={{
                                __html: alternativeZone.redirectDescription
                            }}>
                            </div>
                            <div className="ui-dialog-footer ui-widget-content">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <button onClick={() => this.redirect(redirectUrl, alternativeZone)} className="btn btn-primary btn-lg btn-block mt-15">{redirectButtonText}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            );
        // }
    }
}


const mapStateToProps = state => ({
    displayAddressAlternativeStore: state.auth.displayAddressAlternativeStore,
    isSendingNotifyExpanding: state.auth.isSendingNotifyExpanding,
    successMessage: state.auth.sneSuccessMessage,
    errorMessage: state.auth.sneErrorMessage,
    address: state.address.geocodedAddress
});

const mapDispatchToProps = (dispatch) => ({
    hideAddressAlternativeStorePopup: bindActionCreators(hideAddressAlternativeStorePopup, dispatch),
    displayAddressUnserviceablePopup: bindActionCreators(displayAddressUnserviceablePopup, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddressAlternativeStorePopup);
