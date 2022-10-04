import axios from 'axios';

import config from 'app/config';

import {
    DISPLAY_ADDRESS_UNSERVICEABLE,
    HIDE_ADDRESS_UNSERVICEABLE,

    DISPLAY_ADDRESS_ALTERNATIVE_STORE,
    HIDE_ADDRESS_ALTERNATIVE_STORE,

    SEND_NOTIFY_EXPANDING_SUCCESS,
    SEND_NOTIFY_EXPANDING_FAILURE,
    SEND_NOTIFY_EXPANDING_REQUEST
} from '../constants/Auth';

import {
    HIDE_ADDRESS_SELECT
} from '../constants/Address';

export function displayAddressAlternativeStorePopup() {
    return function (dispatch) {
        dispatch({
            type: DISPLAY_ADDRESS_ALTERNATIVE_STORE
        });
    }
}

export function hideAddressAlternativeStorePopup() {
    return function (dispatch) {
        dispatch({
            type: HIDE_ADDRESS_ALTERNATIVE_STORE
        });
    }
}

export function displayAddressUnserviceablePopup() {
    return function (dispatch) {
        dispatch({
            type: DISPLAY_ADDRESS_UNSERVICEABLE
        });
    }
}

export function hideAddressUnserviceablePopup() {
    return function (dispatch) {
        dispatch({
            type: HIDE_ADDRESS_UNSERVICEABLE
        });
    }
}

export function sendNotifyExpandingSuccess(displayMessage) {
    return function (dispatch) {
        dispatch({
            type: HIDE_ADDRESS_SELECT,
            payload: {
                
            }
        });

        dispatch({
            type: SEND_NOTIFY_EXPANDING_SUCCESS,
            payload: {
                successMessage: displayMessage
            }
        });
    }
}

export function sendNotifyExpandingFailure(error) {
    return {
        type: SEND_NOTIFY_EXPANDING_FAILURE,
        payload: {
            status: error.status,
            errorMessage: error.displayMessage
        }
    }
}
    
export function sendNotifyExpandingRequest() {
    return {
        type: SEND_NOTIFY_EXPANDING_REQUEST
    }
}

export function sendNotifyExpanding(email, message) {
    return function (dispatch) {
        dispatch(sendNotifyExpandingRequest());

        return axios.post(config.authenticationURI + '/subscription', {
            firstName: "",
            email: email,
            referrer: "Notify Me Page",
            message: message
        }).then((x) => {
            if (x.status === 200 && x.data.token !== null) {
                dispatch(sendNotifyExpandingSuccess('Thank you for enquiring'));
            } else {

            }
        }).catch(error => {
            if (global.newrelic) {
              global.newrelic.noticeError(error);
            }
            dispatch(sendNotifyExpandingFailure({
                status: error.response.data.errors && error.response.data.errors[0].type,
                displayMessage: error.response.data.errors && error.response.data.errors[0].displayMessage
            }));

            return {
                status: error.response.data.errors && error.response.data.errors[0].type,
                displayMessage: error.response.data.errors && error.response.data.errors[0].displayMessage
            }
        });

    }
}