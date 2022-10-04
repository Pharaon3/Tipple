import axios from 'axios';

import config from 'app/config';

import {
    SEND_FORGOT_PASSWORD_REQUEST,
    SEND_FORGOT_PASSWORD_SUCCESS,
    SEND_FORGOT_PASSWORD_FAILURE,
    DISPLAY_FORGOT_PASSWORD,
    HIDE_FORGOT_PASSWORD
} from '../constants/Auth';
import { standardHeaders } from 'lib/api/rest';

export function displayForgotPasswordPopup() {
    return function (dispatch) {
        dispatch({
            type: DISPLAY_FORGOT_PASSWORD
        })
    }
}

export function hideForgotPasswordPopup() {
    return function (dispatch) {
        dispatch({
            type: HIDE_FORGOT_PASSWORD
        })
    }
}

export function sendForgotPasswordSuccess(displayMessage) {
    return {
        type: SEND_FORGOT_PASSWORD_SUCCESS,
        payload: {
            successMessage: displayMessage
        }
    }
}

export function sendForgotPasswordFailure(error) {
    return {
        type: SEND_FORGOT_PASSWORD_FAILURE,
        payload: {
            status: error.status,
            errorMessage: error.displayMessage
        }
    }
}
    
export function sendForgotPasswordRequest() {
    return {
        type: SEND_FORGOT_PASSWORD_REQUEST
    }
}

export function sendForgotPassword(email, auth) {
    return function (dispatch) {
        dispatch(sendForgotPasswordRequest());

        return axios.post(config.authenticationURI + '/forgot-password', {
            email: email
        }, {
            headers: standardHeaders(auth)
        }).then((x) => {
            if (x.status === 200 && x.data.success) {
                dispatch(sendForgotPasswordSuccess('Please check your email'));
            } else {

            }
        }).catch(error => {
            if (global.newrelic) {
              global.newrelic.noticeError(error);
            }
            dispatch(sendForgotPasswordFailure({
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