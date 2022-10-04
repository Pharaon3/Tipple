import React, { Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import classNames from 'classnames';

import AddressUnserviceablePopup from 'app/components/popups/AddressUnserviceable';
import AddressAlternativeStorePopup from 'app/components/popups/AddressAlternativeStore';
import ConfirmAddressPopup from 'app/components/popups/ConfirmAddress';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { clearGeocodedAddress, geocodeAddress, confirmAddressRequest } from 'app/resources/action/Address';
import { isTippleWarehouse } from 'lib/util/app';

import styles from './AddressSearchBar.module.scss';

/**
 * props:
 * - scrollThreshold
 */
class AddressSearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            addressError: '',
            existingCartAddress: '',
            address: '',
            visible: false
        };
    }

    static getDerivedStateFromProps(props, state) {

        let newState = {
            addressError: props.geocodeErrorMessage
        }

        // Do we have an existing cart address?
        if (props.currentCart !== null) {
            let address = `${props.currentCart?.address?.addressLine1}, ${props.currentCart?.address?.city}, ${props.currentCart?.address?.state}, ${props.currentCart?.address?.postcode}`;


            if (address !== state.existingCartAddress) {
                newState.existingCartAddress = address;
                newState.address = address;

                return newState;
            }
        }
        
        // Is our input address currently in sync?
        if (props.inputAddress !== null) {
            newState.address = props.inputAddress;

            return newState;
        }


        newState.address = state.address;
        return newState;
    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }

    trackScrolling = () => {
        if (!this.state.visible && this.props.scrollThreshold && window.scrollY > this.props.scrollThreshold) {
            this.setState(() => ({
                visible: true
            }));
        } else if (this.state.visible && this.props.scrollThreshold && window.scrollY <= this.props.scrollThreshold) {
            this.setState(() => ({
                visible: false
            }));
        }
    };

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

        // this.props.confirmAddressRequest();
        
        this.props.geocodeAddress(address, this.props.auth, { page: 'home', source: 'address-bar' });
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

        // if (this.props.currentCart && this.state.existingCartAddress === this.state.address) {
        //     this.props.history.push(this.props.currentCart.storePath+'/categories');
        //     return;
        // }

        this.props.geocodeAddress(this.state.address, this.props.auth, { page: 'home', source: 'address-bar' });
        // if (this.props.geocodedAddress === null) {
        // } else {
        //     this.props.confirmAddressRequest();
        // }
    }

    handleFocus = (ev) => {
        const inputField = ev.target;
        requestAnimationFrame(() => {
            // input.select() is not supported on iOS
            inputField.setSelectionRange(0, 9999);
        });
    };

    render() {
        const { visible } = this.state;
        const assetPath = this.props.theme?.name ? 
            `/static/assets/theme/${this.props.theme.name.toLowerCase()}/img` : `/static/assets/img/icons`;

        const hasAddressError = this.state.addressError !== '';

        return (
        <div className={classNames(styles.bar, visible === true && styles.visible)}>
            <div className={classNames('form-group address-search home-search-address', (hasAddressError ? 'has-error' : ''))}>
                <div className={styles.help}>
                    <p className={styles.text}>Enter your address to shop the range near you.</p>
                </div>
                <div className={classNames(styles.search, 'container')}>
                    <img className="hidden-xs" src={`${assetPath}/icon-pin.svg`} alt="Map pin" />
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
                                        placeholder: 'Deliver my drinks to...',
                                        className: 'search-address',
                                    })}
                                />
                                {/* {loading && <div>Loading...</div>} */}
                                <div className={styles['autocomplete-dropdown-container']}>
                                    {suggestions.map(suggestion => {
                                        const className = suggestion.active
                                            ? classNames(styles['suggestion-item'], 'active')
                                            : styles['suggestion-item'];
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
                                                <span className={styles['suggestion-item-marker']}/>
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
                                <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                            </button> : 
                            <button onClick={this.handleSubmit} type="submit" className={classNames(styles.btn, 'btn btn-primary address-search')}>
                                Search
                            </button>
                        }
                    </div>
                </div>

                {hasAddressError && <div className={classNames(styles.error, 'container')}>
                    <div className={classNames('field error-message', isTippleWarehouse ? 'error-message--inverted' : '')}>{this.state.addressError}
                        <div className="fa fa-exclamation-triangle pull-left"/>
                    </div>
                </div>}
            </div>
            <AddressAlternativeStorePopup displayOverride />
            <AddressUnserviceablePopup />
            <ConfirmAddressPopup history={this.props.history} />
        </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    theme: state.theme,
    isGeocodingAddress: state.address.isGeocodingAddress,
    geocodedAddress: state.address.geocodedAddress,
    geocodeErrorMessage: state.address.geocodeErrorMessage,
    inputAddress: state.address.inputAddress,
    currentCart: state.cart.currentCart
});

const mapDispatchToProps = (dispatch) => ({
    clearGeocodedAddress: bindActionCreators(clearGeocodedAddress, dispatch),
    geocodeAddress: bindActionCreators(geocodeAddress, dispatch),
    confirmAddressRequest: bindActionCreators(confirmAddressRequest, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressSearchBar);