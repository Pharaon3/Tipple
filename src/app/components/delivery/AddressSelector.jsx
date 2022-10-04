import React, { Component } from 'react';

import PlacesAutocomplete from 'react-places-autocomplete';

import AddressUnserviceablePopup from 'app/components/popups/AddressUnserviceable';
import AddressAlternativeStorePopup from 'app/components/popups/AddressAlternativeStore';
import ConfirmAddressPopup from 'app/components/popups/ConfirmAddress';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { clearGeocodedAddress, geocodeAddress, confirmAddressRequest } from 'app/resources/action/Address';

import styles from './AddressSelector.module.scss';

class AddressSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            originalAddress: '',
            address: '',
            changeAddress: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        // Is our input address currently in sync?
        if (props.currentCartAddress !== state.originalAddress) {
            return {
                originalAddress: props.currentCartAddress,
                address: props.currentCartAddress
            }
        }

        return {
            address: state.address
        }
    }

    componentDidUpdate(prevProps) {

        if (prevProps.currentCartAddress !== this.props.currentCartAddress) {
            this.setState({
                changeAddress: false
            });
        }

        if ((!this.props.displayAddressConfirmation && prevProps.displayAddressConfirmation) ||
            (this.props.displayAddressUnserviceable && !prevProps.displayAddressUnserviceable)) {
            this.setState({
                address: this.props.currentCartAddress
            })
        }
    }

    handleChange = address => {
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
        ev.preventDefault();

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
    };

    render() {

        return <div className={styles.wrap}>

            <div className="form-group address-search cart-search-address">
                <div>
                    <div className="row mb-5" style={{ marginRight: 0 }}>
                        <div className="col-xs-10 ml-12"><PlacesAutocomplete
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
                                <div className="cart-input-container">
                                    <span>Deliver To: </span>
                                    <input onFocus={this.handleFocus} ref={ref => this.inputRef = ref}
                                        {...getInputProps({
                                            disabled: !this.state.changeAddress,
                                            placeholder: 'Enter delivery address',
                                            className: 'search-address',
                                        })}
                                    />
                                    {/* {loading && <div>Loading...</div>} */}
                                    <div className="autocomplete-dropdown-container">
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };

                                            let q = suggestion.formattedSuggestion.mainText;

                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span className="suggestion-item-marker"></span>
                                                    <span className="suggestion-item-query">{q}</span>
                                                    <span>{suggestion.formattedSuggestion.secondaryText}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>
                        </div>
                        {this.state.address !== this.state.originalAddress ? <div className="change-button">
                            {this.props.isGeocodingAddress ? <div className="change-button">
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                            </div> : <a href="/" onClick={this.handleSubmit} className="change-button">Update</a>}
                        </div> : <a className="change-button" href="/" onClick={(ev) => { ev.preventDefault(); this.setState({ changeAddress: true, address: '' }, () => { this.inputRef.focus(); }) }}>Change</a>}
                    </div>
                </div>
                {this.props.geocodeErrorMessage && <div>
                    <div className="field error-message">{this.props.geocodeErrorMessage}
                        <div className="fa fa-exclamation-triangle pull-left"></div>
                    </div>
                </div>}
            </div>
            <AddressAlternativeStorePopup />
            <AddressUnserviceablePopup />
            <ConfirmAddressPopup />
        </div>
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    isGeocodingAddress: state.address.isGeocodingAddress,
    geocodedAddress: state.address.geocodedAddress,
    geocodeErrorMessage: state.address.geocodeErrorMessage,
    displayAddressConfirmation: state.address.displayAddressConfirmation,
    displayAddressUnserviceable: state.auth.displayAddressUnserviceable,
    currentCartAddress: state.cart.currentCart && state.cart.currentCart.address.formattedAddress
});

const mapDispatchToProps = (dispatch) => ({
    clearGeocodedAddress: bindActionCreators(clearGeocodedAddress, dispatch),
    geocodeAddress: bindActionCreators(geocodeAddress, dispatch),
    confirmAddressRequest: bindActionCreators(confirmAddressRequest, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressSelector);