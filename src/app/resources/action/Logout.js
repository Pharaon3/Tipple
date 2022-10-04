import Cookies from 'js-cookie';
import axios from 'axios';
import { standardHeaders } from 'lib/api/rest';

import config from 'app/config';

import {
    LOGOUT_USER_SUCCESS
} from '../constants/Auth';
import { AnalyticsEvents } from '../../../lib/analytics';

export function logoutUser(history, auth) {
    return function(dispatch) {
        window.tippleAnalytics.trigger(AnalyticsEvents.user_logout, {} );

        axios.post(config.authenticationURI + '/current-user/logout', {}, {
            headers: standardHeaders(auth)
        }).then(() => {
            // We don't care, it just needs to fire.
        }).catch(error => {
            // For real, we really don't care.
        });

        // Slight timeout so there is time for the API call to fire before redirect.
        setTimeout(() => {
            Cookies.remove(config.existingAuthenticationCookie, { path:'/', domain: config.cookieDomain });
            Cookies.remove(config.authenticationCookie, { path:'/' });
            Cookies.remove(config.confirmedAddressCookie, { path:'/' });
            dispatch(logoutUserSuccess());
            history.push({ pathname: "/" });
        }, 100);
    }
}

export function logoutUserSuccess() {
    return {
        type: LOGOUT_USER_SUCCESS
    }
}