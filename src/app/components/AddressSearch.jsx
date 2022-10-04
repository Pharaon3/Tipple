import React, { Component } from 'react';

import PlacesAutocomplete from 'react-places-autocomplete';

import classNames from 'classnames';

import AddressUnserviceablePopup from 'app/components/popups/AddressUnserviceable';
import AddressAlternativeStorePopup from 'app/components/popups/AddressAlternativeStore';
import ConfirmAddressPopup from 'app/components/popups/ConfirmAddress';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { clearGeocodedAddress, geocodeAddress, confirmAddressRequest, confirmAddress } from 'app/resources/action/Address';

import styles from './AddressSearch.module.scss';

class AddressSearch extends Component {

    constructor(props) {
        super(props);

        this.state = {
            addressError: '',
            existingCartAddress: '',
            address: ''
        };
    }

    static getDerivedStateFromProps(props, state) {

        let newState = {
            addressError: props.geocodeErrorMessage
        }

        // Do we have an existing cart address?
        if (props.currentCart !== null && props.currentCart?.address) {
            let address = `${props.currentCart?.address?.addressLine1}, ${props.currentCart?.address?.city}, ${props.currentCart?.address?.state}, ${props.currentCart?.address?.postcode}`;


            if (address !== state.existingCartAddress) {
                newState.existingCartAddress = address;
                newState.address = address;

                return newState;
            }
        }
        
        // Is our input address currently in sync?
        if (props.inputAddress !== null) {
            // Removed 
            // newState.address = props.inputAddress;

            // return newState;
        }


        newState.address = state.address;
        return newState;
    }

    handleChange = address => {
        // The user has changed the input address, we need to clear the current geocoded address
        if (this.props.inputAddress !== null) {
            this.props.clearGeocodedAddress();
        }

        this.setState({ address: address });
    };

    handleSelect = address => {
        this.inputRef.blur();

        if (address === '') {
            return;
        }
        
        this.props.geocodeAddress(address, this.props.auth);
    };

    handleSubmit = (ev) => {

        if (this.state.address === '') {
            this.setState({
                addressError: 'Please enter an address'
            })
            return;
        }

        this.setState({
            addressError: ''
        });

        // this.props.geocodeAddress(this.state.address, this.props.auth);
        this.props.confirmAddress(
            this.props.geocodedAddress,
            this.props.auth,
            this.props.history,
            this.props.didAttemptGeocodeAddress
        );
    }

    handleFocus = (ev) => {
        const inputField = ev.target;
        requestAnimationFrame(() => {
            // input.select() is not supported on iOS
            inputField.setSelectionRange(0, 9999);
        });
    };

    render() {
        const { isCta } = this.props;

        const hasAddressError = this.state.addressError !== '';
        const enableContinue = this.props.geocodedAddress?.storeId > 0 ?? false;

        return (
        <div className="landing-address-search">
            <div className={classNames('form-group address-search home-search-address', (hasAddressError ? 'has-error' : ''), isCta && styles.cta)}>
                <div className={styles.help}>
                    Enter your address to shop the range near you
                </div>
                <div className={styles.search}>
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
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div className={styles.input}>
                                <input onFocus={this.handleFocus} ref={ref => this.inputRef = ref} 
                                    {...getInputProps({
                                        placeholder: 'Enter delivery address',
                                        className: 'search-address',
                                    })}
                                    autoComplete="ignoreit"
                                />
                                {/* {loading && <div>Loading...</div>} */}
                                <div className={classNames(styles['autocomplete-dropdown-container'], 'autocomplete-dropdown-container')}>
                                    {suggestions.map(suggestion => {
                                        const className = classNames(styles['suggestion-item'], suggestion.active && 'active', 'suggestion-item')
                                        // const className = suggestion.active
                                        //     ? classNames(styles['suggestion-item'], 'active', '')
                                        //     : styles['suggestion-item'];
                                        // inline style for demonstration purpose
                                        const style = suggestion.active
                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };

                                        let q = suggestion.formattedSuggestion.mainText;

                                        return (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,
                                                    style
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
                        )}
                    </PlacesAutocomplete>

                    <div className={styles['button-wrap']}>
                        {this.props.isGeocodingAddress ? <button onClick={this.handleSubmit} type="submit" className={classNames(styles.btn, 'btn btn-primary address-search')}>
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                            </button> : 
                            <button onClick={this.handleSubmit} type="submit" className={classNames(styles.btn, 'btn btn-primary address-search')}
                                disabled={!enableContinue && !this.props.geocodeErrorMessage}
                            >
                                Continue
                            </button>
                        }
                    </div>
                </div>

                {hasAddressError && <div className={styles.error}>
                    <div className={classNames('field error-message')}>{this.state.addressError}
                        <div className="fa fa-exclamation-triangle pull-left"></div>
                    </div>
                </div>}
            </div>
            <AddressAlternativeStorePopup displayOverride />
            <AddressUnserviceablePopup />
            {/* <ConfirmAddressPopup history={this.props.history} /> */}
        </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    isGeocodingAddress: state.address.isGeocodingAddress,
    geocodedAddress: state.address.geocodedAddress,
    geocodeErrorMessage: state.address.geocodeErrorMessage,
    inputAddress: state.address.inputAddress,
    currentCart: state.cart.currentCart,
    displayAddressSelect: state.address.displayAddressSelect
});

const mapDispatchToProps = (dispatch) => ({
    clearGeocodedAddress: bindActionCreators(clearGeocodedAddress, dispatch),
    geocodeAddress: bindActionCreators(geocodeAddress, dispatch),
    confirmAddressRequest: bindActionCreators(confirmAddressRequest, dispatch),
    confirmAddress: bindActionCreators(confirmAddress, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressSearch);