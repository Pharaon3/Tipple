import Cookies from 'js-cookie';
import axios from 'axios';

import config from 'app/config';
import { standardHeaders } from 'lib/api/rest';
import { AnalyticsEvents } from 'lib/analytics';

import {
    CLEAR_GEOCODED_ADDRESS, SET_INPUT_ADDRESS,
    CONFIRM_GEOCODED_ADDRESS_REQUEST, CONFIRM_GEOCODED_ADDRESS_CANCEL, CONFIRM_GEOCODED_ADDRESS_SUCCESS,
    GEOCODE_ADDRESS_REQUEST, GEOCODE_ADDRESS_SUCCESS, GEOCODE_ADDRESS_FAILURE, STORE_UNAVAILABLE,
    DISPLAY_ADDRESS_SELECT, HIDE_ADDRESS_SELECT
} from '../constants/Address';

import {
    DISPLAY_ADDRESS_ALTERNATIVE_STORE, DISPLAY_ADDRESS_UNSERVICEABLE
} from '../constants/Auth';

import { setCartAddress } from './Cart';

export function displayAddressSelect() {
    return function (dispatch) {
        dispatch({
            type: DISPLAY_ADDRESS_SELECT
        });
    }
}

export function hideAddressSelect() {
    return function (dispatch) {
        dispatch({
            type: HIDE_ADDRESS_SELECT
        });
    }
}

export function clearGeocodedAddress() {
    return function (dispatch) {
        dispatch({
            type: CLEAR_GEOCODED_ADDRESS
        });
    }
}

export function confirmAddressRequest() {

    return function (dispatch) {
        dispatch({
            type: CONFIRM_GEOCODED_ADDRESS_REQUEST,
            payload: {

            }
        });
    }
}

export function confirmAddressCancel() {
    return function (dispatch) {
        dispatch({
            type: CONFIRM_GEOCODED_ADDRESS_CANCEL
        });
    }
}

export function confirmAddress(geocodedAddress, auth, history, fromGeocodeAddress = false) {
    return function (dispatch) {

        let date = new Date();
        date.setHours(date.getHours() + 24 * 30);

        if (geocodedAddress.storeId !== -1) {


            Cookies.set(config.confirmedAddressCookie, geocodedAddress, {
                path: '/',
                expires: date,
                secure: !(config && config.insecureCookies === true)
            });

            dispatch(setCartAddress(geocodedAddress, auth, history, fromGeocodeAddress))

            dispatch({
                type: CONFIRM_GEOCODED_ADDRESS_SUCCESS,
                payload: {

                }
            });
        } else {

            window.tippleAnalytics.trigger(AnalyticsEvents.address_entered_cancel, { address: geocodedAddress });

            dispatch({
                type: CONFIRM_GEOCODED_ADDRESS_CANCEL,
                payload: {

                }
            });

            if (geocodedAddress.zones && geocodeAddress.zones.length > 0) {
                dispatch({
                    type: DISPLAY_ADDRESS_ALTERNATIVE_STORE,
                    payload: {
                        geocodedAddress: geocodedAddress
                    }
                });
            } else {
                dispatch({
                    type: DISPLAY_ADDRESS_UNSERVICEABLE,
                    payload: {
                        geocodedAddress: geocodedAddress
                    }
                });
            }

            dispatch({
                type: STORE_UNAVAILABLE,
                payload: {
                    geocodedAddress: geocodedAddress
                }
            });
        }


    }
}

export function setGeocodedAddress(geocodedAddress) {
    return function (dispatch) {
        dispatch({
            type: SET_INPUT_ADDRESS,
            payload: {
                inputAddress: geocodedAddress.formattedAddress
            }
        });

        dispatch({
            type: GEOCODE_ADDRESS_SUCCESS,
            payload: {
                geocodedAddress: geocodedAddress
            }
        });
    }
}

export function geocodeAddress(addressToGeocode, auth, addressSource = { page: null, source: null }) {

    return function (dispatch) {
        window.tippleAnalytics.trigger(AnalyticsEvents.address_entered, { entered_address: addressToGeocode, ...addressSource });

        dispatch({
            type: SET_INPUT_ADDRESS,
            payload: {
                inputAddress: addressToGeocode
            }
        });

        dispatch({
            type: GEOCODE_ADDRESS_REQUEST
        })
        axios.get(config.baseURI + '/geocode?address=' + addressToGeocode, {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1 && resp.data.addressLine1 !== '' && resp.data.country === 'AU') {

                    dispatch({
                        type: GEOCODE_ADDRESS_SUCCESS,
                        payload: {
                            geocodedAddress: resp.data
                        }
                    });

                    dispatch(confirmAddressRequest());
                    return;
                } else if (resp.data.addressLine1 === '') {

                    window.tippleAnalytics.trigger(AnalyticsEvents.address_entered_invalid, { error: 'No Address Line 1', address: resp.data, ...addressSource});

                    dispatch({
                        type: GEOCODE_ADDRESS_FAILURE,
                        payload: {
                            error: 'Sorry, we were unable to understand the address. Bad computer!'
                        }
                    });
                    return;
                } else if (resp.data.country !== 'AU') {

                    window.tippleAnalytics.trigger(AnalyticsEvents.address_entered_invalid, { error: 'Wrong Country', address: resp.data, ...addressSource });
                    dispatch({
                        type: GEOCODE_ADDRESS_FAILURE,
                        payload: {
                            error: 'Sorry! Tipple is only available in Australia (for now!)'
                        }
                    });
                    return;
                }

                window.tippleAnalytics.trigger(AnalyticsEvents.address_entered_invalid, { error: 'Unknown', address: resp.data, ...addressSource });

                if (resp.data.zones && resp.data.zones.length > 0) {
                    dispatch({
                        type: DISPLAY_ADDRESS_ALTERNATIVE_STORE,
                        payload: {
                            geocodedAddress: resp.data
                        }
                    });
                } else {
                    dispatch({
                        type: DISPLAY_ADDRESS_UNSERVICEABLE,
                        payload: {
                            geocodedAddress: resp.data
                        }
                    });
                }
                
                dispatch({
                    type: STORE_UNAVAILABLE,
                    payload: {
                        geocodedAddress: resp.data
                    }
                });
            } else {
                dispatch({
                    type: GEOCODE_ADDRESS_FAILURE,
                    payload: {
                        error: resp.error
                    }
                });
            }
        }).catch(error => {
            // If there is an API error ie. 400 Bad Request, error will be an object rather than a nice       
            // error string (which is the response given by other failure scenarios), so override it.
            const errorResponse = typeof error !== 'object' ? error : 'This address is not valid';

            dispatch({
                type: GEOCODE_ADDRESS_FAILURE,
                payload: {
                    error: errorResponse
                }
            });
        });
    }
}

// Geocode and confirm all in one
// TODO: Refactor to fit in better with the standard geocode.
export function geocodePreviousAddress(addressToGeocode, auth, addressSource = { page: null, source: null }) {
    return function (dispatch) {
        window.tippleAnalytics.trigger(AnalyticsEvents.address_entered, { entered_address: addressToGeocode, ...addressSource });

        dispatch({
            type: SET_INPUT_ADDRESS,
            payload: {
                inputAddress: addressToGeocode
            }
        });

        dispatch({
            type: GEOCODE_ADDRESS_REQUEST
        });

        axios.get(config.baseURI + '/geocode?address=' + addressToGeocode?.formattedAddress, {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1 && resp.data.addressLine1 !== '' && resp.data.country === 'AU') {

                    dispatch({
                        type: GEOCODE_ADDRESS_SUCCESS,
                        payload: {
                            geocodedAddress: resp.data
                        }
                    });

                    dispatch(confirmAddress(resp.data, auth));
                    return;
                } else if (resp.data.addressLine1 === '') {

                    window.tippleAnalytics.trigger(AnalyticsEvents.address_entered_invalid, { error: 'No Address Line 1', address: resp.data, ...addressSource});

                    dispatch({
                        type: GEOCODE_ADDRESS_FAILURE,
                        payload: {
                            error: 'Sorry, we were unable to understand the address. Bad computer!'
                        }
                    });
                    return;
                } else if (resp.data.country !== 'AU') {

                    window.tippleAnalytics.trigger(AnalyticsEvents.address_entered_invalid, { error: 'Wrong Country', address: resp.data, ...addressSource });
                    dispatch({
                        type: GEOCODE_ADDRESS_FAILURE,
                        payload: {
                            error: 'Sorry! Tipple is only available in Australia (for now!)'
                        }
                    });
                    return;
                }

                window.tippleAnalytics.trigger(AnalyticsEvents.address_entered_invalid, { error: 'Unknown', address: resp.data, ...addressSource });

                if (resp.data.zones && resp.data.zones.length > 0) {
                    dispatch({
                        type: DISPLAY_ADDRESS_ALTERNATIVE_STORE,
                        payload: {
                            geocodedAddress: resp.data
                        }
                    });
                } else {
                    dispatch({
                        type: DISPLAY_ADDRESS_UNSERVICEABLE,
                        payload: {
                            geocodedAddress: resp.data
                        }
                    });
                }
                
                dispatch({
                    type: STORE_UNAVAILABLE,
                    payload: {
                        geocodedAddress: resp.data
                    }
                });
            } else {
                dispatch({
                    type: GEOCODE_ADDRESS_FAILURE,
                    payload: {
                        error: resp.error
                    }
                });
            }
        }).catch(error => {
            // If there is an API error ie. 400 Bad Request, error will be an object rather than a nice       
            // error string (which is the response given by other failure scenarios), so override it.
            const errorResponse = typeof error !== 'object' ? error : 'This address is not valid';

            dispatch({
                type: GEOCODE_ADDRESS_FAILURE,
                payload: {
                    error: errorResponse
                }
            });
        });
    }
}