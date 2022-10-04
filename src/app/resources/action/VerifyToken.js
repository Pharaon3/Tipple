import uuid from 'uuid/v4';
import Cookies from 'js-cookie';

import config from 'app/config';
import currentUserApi from '../api/currentUser';

import {
    VERIFY_TOKEN_REQUEST, 
    VERIFY_TOKEN_SUCCESS, 
    VERIFY_TOKEN_FAILURE,
    VERIFY_TOKEN_SKIPSERVER
} from '../constants/Auth';

export function verifyToken(token, userIdentifier, deviceIdentifier) {
    return function(dispatch) {

        if (userIdentifier === undefined) {
            let date = new Date();
            date.setHours(date.getHours() + 87600);

            const existingUserIdentifier = Cookies.get(config.userIdentifierCookie);

            userIdentifier = existingUserIdentifier ? existingUserIdentifier : uuid();
            
            Cookies.set(config.userIdentifierCookie, userIdentifier, {
                path: '/',
                expires: date,
                secure: config && config.insecureCookies === true ? false : true
            });
        }

        if (deviceIdentifier === undefined) {
            let date = new Date();
            date.setHours(date.getHours() + 87600);

            const existingDeviceIdentifier = Cookies.get(config.deviceIdentifierCookie);
            deviceIdentifier = existingDeviceIdentifier ? existingDeviceIdentifier : uuid();
            
            Cookies.set(config.deviceIdentifierCookie, deviceIdentifier, {
                path: '/',
                expires: date,
                secure: config && config.insecureCookies === true ? false : true
            });
        }

        dispatch(verifyTokenRequest(userIdentifier, deviceIdentifier));

        if (token !== undefined) {
            return currentUserApi.get(token, userIdentifier, deviceIdentifier)
            .then(response => {
                dispatch(verifyTokenSuccess(token, response));
            }).catch(error => {
                dispatch(verifyTokenFailure(token, error));
            });
        } else {
            dispatch(verifyTokenSkipServer());
        }

    }
}

export const verifyTokenWithUser = (token, userIdentifier, deviceIdentifier, currentUser) => dispatch => {
    dispatch(verifyTokenRequest(userIdentifier, deviceIdentifier));
    dispatch(verifyTokenSuccess(token, currentUser));
};

export function verifyTokenSkipServer() {
    return {
        type: VERIFY_TOKEN_SKIPSERVER
    }
}


export function verifyTokenRequest(userIdentifier, deviceIdentifier) {
    return {
        type: VERIFY_TOKEN_REQUEST,
        payload: {
            userIdentifier: userIdentifier,
            deviceIdentifier: deviceIdentifier
        }
    }
}

export function verifyTokenSuccess(token, user) {
    return {
        type: VERIFY_TOKEN_SUCCESS,
        payload: {
            token: token,
            user: user
        }
    }
}

export function verifyTokenFailure(token, data) {

    let errorData = {};
    if (data.error !== undefined && data.error.status !== undefined) {
        errorData.status = data.error.status;
    }

    if (data.tokenDeveloperMessage !== undefined && data.error.tokenDeveloperMessage !== undefined) {
        errorData.tokenDeveloperMessage = data.error.tokenDeveloperMessage;
    }

    return {
        type: VERIFY_TOKEN_FAILURE,
        payload: {
            token: token,
            status: errorData.status,
            tokenDeveloperMessage: errorData.tokenDeveloperMessage
        }
    }
}