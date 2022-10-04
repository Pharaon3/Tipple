import { createReducer } from 'lib/createReducer';
import {
    VERIFY_TOKEN_REQUEST, VERIFY_TOKEN_SKIPSERVER, VERIFY_TOKEN_SUCCESS, VERIFY_TOKEN_FAILURE,
    LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE,
    DISPLAY_FORGOT_PASSWORD, HIDE_FORGOT_PASSWORD,
    SEND_FORGOT_PASSWORD_SUCCESS, SEND_FORGOT_PASSWORD_FAILURE,
    DISPLAY_LOGIN, HIDE_LOGIN,
    DISPLAY_REFERRAL_CODE, HIDE_REFERRAL_CODE, DISPLAY_ADDRESS_ALTERNATIVE_STORE, HIDE_ADDRESS_ALTERNATIVE_STORE, DISPLAY_ADDRESS_UNSERVICEABLE, HIDE_ADDRESS_UNSERVICEABLE, SEND_NOTIFY_EXPANDING_SUCCESS, SEND_NOTIFY_EXPANDING_FAILURE, SEND_NOTIFY_EXPANDING_REQUEST
} from '../constants/Auth';

const initialState = {
    token: null,
    userIdentifier: null,
    deviceIdentifier: null,
    currentUser: null,
    isAuthenticated: false,
    didAttemptTokenVerification: false,
    didAttemptAuthentication: false,
    isAuthenticating: false,
    isVerifyingToken: false,
    tokenDeveloperMessage: null,
    loginDisplayMessage: null,
    displayLogin: false,
    displayForgotPassword: false,
    displayReferralCode: false,
    sfpDisplayMessage: null,
    sfpSuccessMessage: null,
    isSendingForgotPassword: false,

    displayAddressAlternativeStore: false,
    displayAddressUnserviceable: false,
    isSendingNotifyExpanding: false,
    sneSuccessMessage: null,
    sneErrorMessage: null
};

export default createReducer(initialState, {

    [DISPLAY_ADDRESS_ALTERNATIVE_STORE]: (state, data) => {
        return Object.assign({}, state, {
            'displayAddressAlternativeStore': true
        });
    },

    [HIDE_ADDRESS_ALTERNATIVE_STORE]: (state, data) => {
        return Object.assign({}, state, {
            'displayAddressAlternativeStore': false
        });
    },

    [DISPLAY_ADDRESS_UNSERVICEABLE]: (state, data) => {
        return Object.assign({}, state, {
            'displayAddressUnserviceable': true
        });
    },

    [HIDE_ADDRESS_UNSERVICEABLE]: (state, data) => {
        return Object.assign({}, state, {
            'displayAddressUnserviceable': false
        });
    },

    [SEND_NOTIFY_EXPANDING_REQUEST]: (state, data) => {
        return Object.assign({}, state, {
            'isSendingNotifyExpanding': false,
            'sneSuccessMessage': null,
            'sneErrorMessage': null
        });
    },

    [SEND_NOTIFY_EXPANDING_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            'isSendingNotifyExpanding': false,
            'sneSuccessMessage': data.payload.successMessage,
            'sneErrorMessage': null
        });
    },

    [SEND_NOTIFY_EXPANDING_FAILURE]: (state, data) => {
        return Object.assign({}, state, {
            'isSendingNotifyExpanding': true,
            'sneSuccessMessage': null,
            'sneErrorMessage': data.payload.errorMessage
        });
    },

    [DISPLAY_LOGIN]: (state, data) => {
        return Object.assign({}, state, {
            'displayLogin': true
        });
    },

    [HIDE_LOGIN]: (state, data) => {
        return Object.assign({}, state, {
            'displayLogin': false
        });
    },

    [DISPLAY_REFERRAL_CODE]: (state, data) => {
        return Object.assign({}, state, {
            'displayReferralCode': true
        });
    },

    [HIDE_REFERRAL_CODE]: (state, data) => {
        return Object.assign({}, state, {
            'displayReferralCode': false
        });
    },

    [DISPLAY_FORGOT_PASSWORD]: (state, data) => {
        return Object.assign({}, state, {
            'displayForgotPassword': true,
            'sfpSuccessMessage': null,
            'sfpErrorMessage': null
        });
    },

    [HIDE_FORGOT_PASSWORD]: (state, data) => {
        return Object.assign({}, state, {
            'displayForgotPassword': false
        });
    },

    [SEND_FORGOT_PASSWORD_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            'isSendingForgotPassword': false,
            'sfpSuccessMessage': data.payload.successMessage,
            'sfpErrorMessage': null
        });
    },

    [SEND_FORGOT_PASSWORD_FAILURE]: (state, data) => {
        return Object.assign({}, state, {
            'isSendingForgotPassword': true,
            'sfpSuccessMessage': null,
            'sfpErrorMessage': data.payload.errorMessage
        });
    },

    [VERIFY_TOKEN_SKIPSERVER]: (state, data) => {
        return Object.assign({}, state, {
            'didAttemptTokenVerification': true,
            'isVerifyingToken': false
        });
    },

    [VERIFY_TOKEN_REQUEST]: (state, data) => {
        return Object.assign({}, state, {
            'isVerifyingToken': true,
            'tokenDeveloperMessage': null,
            'userIdentifier': data.payload.userIdentifier,
            'deviceIdentifier': data.payload.deviceIdentifier
        });
    },

    [VERIFY_TOKEN_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            'didAttemptTokenVerification': true,
            'isAuthenticated': true,
            'isVerifyingToken': false,
            'tokenDeveloperMessage': 'You have been successfully authenticated (via token).',
            'token': data.payload.token,
            'currentUser': data.payload.user
        });
    },

    [VERIFY_TOKEN_FAILURE]: (state, data) => {
        return Object.assign({}, state, {
            'didAttemptTokenVerification': true,
            'isAuthenticated': false,
            'isVerifyingToken': false,
            'tokenDeveloperMessage': data.payload.tokenDeveloperMessage
        });
    },

    [LOGIN_USER_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'loginDisplayMessage': null,
            'token': null,
            'currentUser': null
        });
    },

    [LOGIN_USER_FAILURE]: (state, data) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'didAttemptAuthentication': true,
            'loginDisplayMessage': data.payload.loginDisplayMessage,
            'token': null,
            'currentUser': null
        });
    },

    [LOGIN_USER_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'didAttemptAuthentication': true,
            'isAuthenticated': true,
            'loginDisplayMessage': 'The user has logged in',
            'token': data.payload.token
        });
    }
});