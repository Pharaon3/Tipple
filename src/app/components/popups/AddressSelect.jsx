import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PlacesAutocomplete from 'react-places-autocomplete';
import classNames from 'classnames';
import { AnalyticsEvents } from 'lib/analytics';
import { clearGeocodedAddress, geocodeAddress, geocodePreviousAddress, confirmAddressRequest, confirmAddress, confirmAddressCancel } from 'app/resources/action/Address';
import { hideAddressUnserviceablePopup, hideAddressAlternativeStorePopup } from 'app/resources/action/AddressUnserviceable';
import { hideAddressSelect } from 'app/resources/action/Address';
import Modal from 'app/components/Modal';
import PreviousAddresses from './address-select/PreviousAddresses';
import registerRecentAddressRedux from 'app/resources/api/recentAddresses';
import { setCartAddress } from 'app/resources/action/Cart';

import styles from './AddressSelect.module.scss';

const recentAddressesRedux = registerRecentAddressRedux('RECENT_ADDRESSES_LIST', ['LIST']);

class AddressSelectPopup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            originalAddress: '',
            address: ''
        };
    }

    static getDerivedStateFromProps(props, state) {
        // Is our input address currently in sync?
        if (props.currentCartAddress && props.currentCartAddress !== state.originalAddress) {
            return {
                originalAddress: props.currentCartAddress,
                address: props.currentCartAddress
            }
        }

        return {
            address: state.address
        }
    }

    componentDidMount() {
        if (this.props.auth.token !== null) {
            this.props.recentAddressActions.list(this.props.auth, {
                limit: 2
            });
        }
    }

    componentDidUpdate(prevProps) {
        if ((!this.props.displayAddressConfirmation && prevProps.displayAddressConfirmation) ||
            (this.props.displayAddressUnserviceable && !prevProps.displayAddressUnserviceable)) {
            this.setState({
                address: this.props.currentCartAddress
            })
        }

        if (!prevProps.displayAddressSelect && this.props.displayAddressSelect && this.inputRef) {
            this.inputRef.focus();
        }

        if (prevProps.auth.token === null && this.props.auth.token !== null) {
            this.props.recentAddressActions.list(this.props.auth, {
                limit: 2
            });
        }

        if (prevProps.isSettingCartAddress && !this.props.isSettingCartAddress && !this.props.errorCartAddress) {
            this.handleClose();
        }
    }

    handleChange = address => {
        if (this.props.displayAddressUnserviceable) {
            this.props.hideAddressUnserviceablePopup();
        }
        if (this.props.displayAddressAlternativeStore) {
            this.props.hideAddressAlternativeStorePopup();
        }

        this.setState({ address: address });
    };

    handleSelect = address => {
        if (this.inputRef) {
            this.inputRef.blur();

            if (address === '') {
                return;
            }

            this.setState({
                ...this.state,
                address: address
            });

            this.props.geocodeAddress(address, this.props.auth);
        }
    };

    handleAddressSearch = () => {
        if (this.state.address === '') {
            return;
        }

        if (this.props.geocodedAddress === null) {
            this.props.geocodeAddress(this.state.address, this.props.auth);
        } else {
            this.props.confirmAddressRequest();
        }
    }

    handleFocus = (ev) => {
        const inputField = ev.target;
        requestAnimationFrame(() => {
            // input.select() is not supported on iOS
            inputField.setSelectionRange(0, 9999);
        });
    }

    handleClose = (ev) => {
        if (ev) {
            ev.preventDefault();
        }

        // We only want the address popup to show once, so if the URL includes the param to show it, let's 
        // clear it out when the popup closes.
        let queryString = String(this.props.history?.location?.search).replace('addressIfNone=y', '');
        if (queryString === '?') {
            queryString = '';
        }
        this.props.history.replace(`${this.props.history?.location?.pathname}${queryString}`);
        this.props.hideAddressSelect();

        if (this.props.displayAddressConfirmation) {
            this.props.confirmAddressCancel();
        }
        if (this.props.displayAddressUnserviceable) {
            this.props.hideAddressUnserviceablePopup();
        }
        if (this.props.displayAddressAlternativeStore) {
            this.props.hideAddressAlternativeStorePopup();
        }
    }

    handleContinue = () => {
        if (this.props.displayAddressUnserviceable) {
            this.props.hideAddressUnserviceablePopup();
        }
        if (this.props.displayAddressAlternativeStore) {
            this.props.hideAddressAlternativeStorePopup();
        }
        this.props.confirmAddress(
            this.props.geocodedAddress,
            this.props.auth,
            this.props.history,
            this.props.didAttemptGeocodeAddress
        );
    }

    getOtherOptionDetails = () => { /*: { title, description, url, buttonText } | null */
        if (this.props.displayAddressUnserviceable) {
            return this.props.geocodedAddress?.outOfZone ?? {};
        } else if (this.props.displayAddressAlternativeStore) {
            const alternativeZone = this.props.geocodedAddress?.zones.find(zone => zone);
            if (!alternativeZone) {
                return null;
            }
            return {
                alternativeZone,
                title: alternativeZone.redirectTitle ?? '',
                description: alternativeZone.redirectDescription ?? '',
                url: alternativeZone.redirectURL + (alternativeZone.redirectWithAddress ? `?encryptedAddress=${encodeURIComponent(this.props.geocodedAddress.encryptedAddress)}` : ''),
                buttonText: alternativeZone.redirectButtonText ?? 'Continue'
            }
        }
        return null;
    }

    redirect = (url, alternativeZone = {}) => {
        if (!this.props.displayAddressAlternativeStore) {
            const address = this.props.geocodedAddress;

            const payload = {
                street: address.addressLine1,
                city: address.suburb,
                postalCode: address.postcode,
                state: address.state,
                country: address.country,
                lat: address.lat,
                lng: address.lng,
                redirectUrl: url,
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
        }

        setTimeout(() => {
            window.location.href = url;
        }, 100);
    }

    handleSelectAddress = previousAddress => {
        this.props.geocodePreviousAddress(previousAddress, this.props.auth);
    };

    render() {
        const { isSettingCartAddress } = this.props;
        const enableContinue = this.props.geocodedAddress?.storeId > 0 ?? false;
        const assetPath = this.props.theme?.name ? 
            `/static/assets/theme/${this.props.theme.name.toLowerCase()}/img` : `/static/assets/img/icons`;

        const freshState = !this.props.displayAddressConfirmation &&
            !this.props.displayAddressUnserviceable &&
            !this.props.displayAddressAlternativeStore;

        const optionDetails = this.getOtherOptionDetails() ?? {};

        return (
            <div>
                {this.props.displayAddressSelect ? <Modal analyticsMessage="Enter Delivery Address" analyticsType="popup" analyticsFrom={window.location.pathname}>
                    <div onClick={this.handleClose} className="loading-overlay-transparent orange fadein"></div>
                    <div className={styles.overlay}>
                        <section className={classNames(styles['address-select'], 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>
                            <header>
                                <span>Delivery Address</span>
                                <button onClick={this.handleClose}>
                                    <i className="material-icons">&#xe14c;</i>
                                </button>
                            </header>
                            <div>
                                <PlacesAutocomplete
                                    searchOptions={
                                        {
                                            componentRestrictions: {
                                                country: 'AU'
                                            }
                                        }
                                    }
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                    onSelect={this.handleSelect}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                                        <>
                                            <input 
                                                onFocus={this.handleFocus} 
                                                ref={ref => this.inputRef = ref}
                                                {...getInputProps({
                                                    placeholder: 'Enter your delivery address to browse',
                                                    className: classNames(
                                                        styles['search-address'],
                                                        !freshState && (
                                                            enableContinue ? styles['search-address-success'] : styles['search-address-unavailable']
                                                        )
                                                    ),
                                                })}
                                                autoComplete="ignoreit"
                                            />
                                            <div className={styles['autocomplete-dropdown-container']}>
                                                <div className={styles['autocomplete-dropdown']}>
                                                    {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                            ? classNames(styles['suggestion-item'], styles['suggestion-item-active'])
                                                            : styles['suggestion-item'];
                                                        // inline style for demonstration purpose
                                                        const style = suggestion.active
                                                            ? { backgroundColor: 'var(--grey-75)', cursor: 'pointer' }
                                                            : { backgroundColor: 'var(--grey-50)', cursor: 'pointer' };

                                                        let q = suggestion.formattedSuggestion.mainText;

                                                        return (
                                                            <div
                                                                {...getSuggestionItemProps(suggestion, {
                                                                    className,
                                                                    style,
                                                                })}
                                                            >
                                                                <span className={styles['suggestion-item-marker']}></span>
                                                                <span className={styles['suggestion-item-query']}>{q}</span>
                                                                <span>{suggestion.formattedSuggestion.secondaryText}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </PlacesAutocomplete>
                                {this.props.geocodeErrorMessage && (
                                    <p className={styles['error-message']}>{this.props.geocodeErrorMessage}</p>
                                )}
                                {this.props.isGeocodingAddress && (
                                    <p style={{ 'opacity': '0.5' }}>Checking...</p>
                                )}
                                {this.props.recentAddresses?.length > 0 && <PreviousAddresses recentAddresses={this.props.recentAddresses} assetPath={assetPath} onSelectAddress={this.handleSelectAddress} />}
                                {(freshState || !this.props.geocodedAddress) && (
                                    <p>We use your delivery location to match you with the best range from nearby stores to fulfill your order.</p>
                                )}
                                {(!freshState && enableContinue) && (
                                    <p>You’re in the zone! Browse products available in your area now.</p>
                                )}
                                {!enableContinue && (
                                    <div className={styles['alt-option']}>
                                        {optionDetails.title && <h3 className={styles['alt-option-title']}>{optionDetails.title}</h3>}
                                        {optionDetails.description && <div
                                            className={classNames(styles['alt-option-description'])}
                                            dangerouslySetInnerHTML={{ __html: optionDetails.description }}
                                        />}
                                        {optionDetails.url && <button
                                            className={styles['alt-option-link']}
                                            onClick={() => this.redirect(optionDetails.url, optionDetails.alternativeZone)}
                                        >
                                            {optionDetails.buttonText}
                                        </button>}
                                    </div>
                                )}
                            </div>
                            <footer>
                                <button
                                    onClick={this.handleContinue}
                                    type="submit"
                                    className={classNames('btn', enableContinue && !this.props.geocodeErrorMessage && !isSettingCartAddress ? 'btn-primary' : 'disabled')}
                                    disabled={!enableContinue && !this.props.geocodeErrorMessage && !isSettingCartAddress}
                                >
                                    <span>Continue</span>
                                </button>
                            </footer>
                        </section>
                    </div>
                </Modal> : null}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    displayAddressSelect: state.address.displayAddressSelect,
    isGeocodingAddress: state.address.isGeocodingAddress,
    geocodedAddress: state.address.geocodedAddress,
    geocodeErrorMessage: state.address.geocodeErrorMessage,
    inputAddress: state.address.inputAddress,
    displayAddressConfirmation: state.address.displayAddressConfirmation,
    didAttemptGeocodeAddress: state.address.didAttemptGeocodeAddress,
    displayAddressUnserviceable: state.auth.displayAddressUnserviceable,
    displayAddressAlternativeStore: state.auth.displayAddressAlternativeStore,
    recentAddresses: state.RECENT_ADDRESSES_LIST?.items ?? [],
    theme: state.theme,
    isSettingCartAddress: state.cart?.isSettingCartAddress ?? false,
    errorCartAddress: state.cart?.errorCartAddress ?? false
});

const mapDispatchToProps = (dispatch) => ({
    hideAddressSelect: bindActionCreators(hideAddressSelect, dispatch),
    clearGeocodedAddress: bindActionCreators(clearGeocodedAddress, dispatch),
    geocodeAddress: bindActionCreators(geocodeAddress, dispatch),
    geocodePreviousAddress: bindActionCreators(geocodePreviousAddress, dispatch),
    confirmAddressRequest: bindActionCreators(confirmAddressRequest, dispatch),
    confirmAddress: bindActionCreators(confirmAddress, dispatch),
    confirmAddressCancel: bindActionCreators(confirmAddressCancel, dispatch),
    hideAddressUnserviceablePopup: bindActionCreators(hideAddressUnserviceablePopup, dispatch),
    hideAddressAlternativeStorePopup: bindActionCreators(hideAddressAlternativeStorePopup, dispatch),
    recentAddressActions: bindActionCreators(recentAddressesRedux.actionCreators, dispatch),
    setCartAddress: bindActionCreators(setCartAddress, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressSelectPopup);