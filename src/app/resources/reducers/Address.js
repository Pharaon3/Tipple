import { createReducer } from 'lib/createReducer';
import {
    CLEAR_GEOCODED_ADDRESS, SET_INPUT_ADDRESS, GEOCODE_ADDRESS_REQUEST, GEOCODE_ADDRESS_SUCCESS, STORE_UNAVAILABLE,
    CONFIRM_GEOCODED_ADDRESS_SUCCESS, CONFIRM_GEOCODED_ADDRESS_REQUEST, CONFIRM_GEOCODED_ADDRESS_CANCEL,
    DISPLAY_ADDRESS_SELECT, HIDE_ADDRESS_SELECT, GEOCODE_ADDRESS_FAILURE
} from '../constants/Address';

const initialState = {
    inputAddress: null,
    geocodedAddress: null,
    token: null,
    currentUser: null,
    isAuthenticated: false,
    isGeocodingAddress: false,
    geocodeErrorMessage: '',
    didAttemptGeocodeAddress: false,
    displayAddressConfirmation: false,
    displayAddressSelect: false
};

export default createReducer(initialState, {

    [DISPLAY_ADDRESS_SELECT]: (state, data) => {
        return Object.assign({}, state, {
            displayAddressSelect: true
        })
    },    
    
    [HIDE_ADDRESS_SELECT]: (state, data) => {
        return Object.assign({}, state, {
            displayAddressSelect: false
        })
    },

    [CLEAR_GEOCODED_ADDRESS]: (state, data) => {
        return Object.assign({}, state, {
            inputAddress: null,
            geocodedAddress: null
        })
    },

    [SET_INPUT_ADDRESS]: (state, data) => {
        return Object.assign({}, state, {
            inputAddress: data.payload.inputAddress
        })
    },

    [GEOCODE_ADDRESS_REQUEST]: (state, data) => {
        return Object.assign({}, state, {
            geocodedAddress: null,
            geocodeErrorMessage: '',
            isGeocodingAddress: true
        })
    },

    [GEOCODE_ADDRESS_FAILURE]: (state, data) => {
        return Object.assign({}, state, {
            geocodedAddress: null,
            geocodeErrorMessage: data.payload.error,
            isGeocodingAddress: false
        })
    },

    [STORE_UNAVAILABLE]: (state, data) => {
        return Object.assign({}, state, {
            geocodedAddress: data.payload.geocodedAddress,
            isGeocodingAddress: false,
            didAttemptGeocodeAddress: true
        })
    },

    [GEOCODE_ADDRESS_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            geocodedAddress: data.payload.geocodedAddress,
            isGeocodingAddress: false,
            didAttemptGeocodeAddress: true
        })
    },

    [CONFIRM_GEOCODED_ADDRESS_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            displayAddressConfirmation: false,
            displayAddressSelect: false
        })
    },

    [CONFIRM_GEOCODED_ADDRESS_REQUEST]: (state, data) => {
        return Object.assign({}, state, {
            displayAddressConfirmation: true
        })
    },

    [CONFIRM_GEOCODED_ADDRESS_CANCEL]: (state, data) => {
        return Object.assign({}, state, {
            displayAddressConfirmation: false
        })
    }
});