import Cookies from 'js-cookie';
import axios from 'axios';

import config from 'app/config';
import { getItem } from 'lib/util/localStorage';

import { verifyToken } from './VerifyToken';
import { AnalyticsEvents } from '../../../lib/analytics';

import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_FAILURE,
    LOGIN_USER_SUCCESS,
    DISPLAY_LOGIN,
    HIDE_LOGIN
} from '../constants/Auth';

export function displayLoginPopup() {
    return function (dispatch) {
        dispatch({
            type: DISPLAY_LOGIN
        })
    }
}

export function hideLoginPopup() {
    return function (dispatch) {
        dispatch({
            type: HIDE_LOGIN
        })
    }
}

export function loginUserSuccess(token) {
    return {
        type: LOGIN_USER_SUCCESS,
        payload: {
            token: token
        }
    }
}

export function loginUserFailure(error) {
    return {
        type: LOGIN_USER_FAILURE,
        payload: {
            status: error.response.status,
            loginDisplayMessage: error.response.loginDisplayMessage
        }
    }
}

export function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST
    }
}

export function loginUserViaReset(email, password, code, auth, history) {
    const siteId = getItem('tipple_site_id') || config.siteId;
    return function (dispatch) {
        dispatch(loginUserRequest());

        return axios.post(config.authenticationURI + '/reset-password', {
            email: email,
            password: password,
            code: code
        }, {
            headers: {
                'X-User-Identifier': auth.userIdentifier,
                'X-Device-Identifier': auth.deviceIdentifier,
                'X-Tipple-Site-Id': siteId
            }
        }).then((x) => {
            if (x.status === 200 && x.data.access_token !== null) {
                window.tippleAnalytics.trigger(AnalyticsEvents.user_login_success, {} );

                let date = new Date();
                date.setHours(date.getHours() + 87600);

                Cookies.set(config.authenticationCookie, x.data.access_token, {
                    path: '/',
                    expires: date
                });

                history.push('/');
                dispatch(loginUserSuccess(x.data.access_token));
                dispatch(verifyToken(x.data.access_token));
            } else {
                window.tippleAnalytics.trigger(AnalyticsEvents.user_login_failed, {} );
            }
        }).catch(error => {
            window.tippleAnalytics.trigger(AnalyticsEvents.user_login_failed, {} );
            dispatch(loginUserFailure({
                response: {
                    status: error.response.data.errors[0].type,
                    loginDisplayMessage: error.response.data.errors[0].displayMessage
                }
            }));

            return {
                status: error.response.data.errors[0].type,
                loginDisplayMessage: error.response.data.errors[0].displayMessage
            }
        });

    }
}

export function loginUserViaEmail(email, password, auth) {
    const siteId = getItem('tipple_site_id') || config.siteId;
    return function (dispatch) {
        dispatch(loginUserRequest());

        return axios.post(config.authenticationURI + '/authenticate', {
            email: email,
            password: password
        }, {
            headers: {
                'X-User-Identifier': auth.userIdentifier,
                'X-Device-Identifier': auth.deviceIdentifier,
                'X-Tipple-Site-Id': siteId
            }
        }).then((x) => {
            if (x.status === 200 && x.data.access_token !== null) {
                window.tippleAnalytics.trigger(AnalyticsEvents.user_login_success, {} );

                let date = new Date();
                date.setHours(date.getHours() + 87600);

                Cookies.set(config.authenticationCookie, x.data.access_token, {
                    path: '/',
                    expires: date
                });

                dispatch(loginUserSuccess(x.data.access_token));
                dispatch(verifyToken(x.data.access_token));
            } else {
                window.tippleAnalytics.trigger(AnalyticsEvents.user_login_failed, {} );
            }
        }).catch(error => {
            window.tippleAnalytics.trigger(AnalyticsEvents.user_login_failed, {} );
            dispatch(loginUserFailure({
                response: {
                    status: error?.response?.data?.errors[0]?.type,
                    loginDisplayMessage: error?.response?.data?.errors[0]?.displayMessage
                }
            }));

            return {
                status: error?.response?.data?.errors[0]?.type,
                loginDisplayMessage: error?.response?.data?.errors[0]?.displayMessage
            }
        });

    }
}