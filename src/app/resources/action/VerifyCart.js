import initialCartApi from '../api/initialCart';

import {
    VERIFY_CART_REQUEST, 
    VERIFY_CART_SUCCESS, 
    VERIFY_CART_FAILURE,
    VERIFY_CART_EMPTY
} from '../constants/Cart';

export function verifyCart(token, userIdentifier, deviceIdentifier, hasAddress) {
    return function(dispatch) {

        if (hasAddress) {
            dispatch(verifyCartRequest());

            return initialCartApi.get(token, userIdentifier, deviceIdentifier)
                .then(response => {
                    dispatch(verifyCartSuccess(response));
                }).catch(error => {
                    if (global.newrelic) {
                    global.newrelic.noticeError(error);
                    }
                    dispatch(verifyCartFailure(error));
                });
        } else {
            dispatch(verifyCartEmpty());
        }
    }
}

export function verifyCartRequest() {
    return {
        type: VERIFY_CART_REQUEST
    }
}

export function verifyCartSuccess(resp) {
    return {
        type: VERIFY_CART_SUCCESS,
        payload: {
            cart: resp
        }
    }
}

export function verifyCartFailure(data) {
    let errorData = {};
    if (data.error !== undefined && data.error.status !== undefined) {
        errorData.status = data.error.status;
    }
    
    return {
        type: VERIFY_CART_FAILURE,
        payload: {
            status: errorData.status
        }
    }
}

/**
 * We had issues with a lot of 404s from the /cart endpoint because web uses it to verify the cart when 
 * we aren't sure about auth or an address. This causes noise in reporting that makes it hard for us to 
 * understand when there's a real issue with the GET /cart endpoint.
 * This new action creator is used for when the app determines we won't have a cart because there is no 
 * geocoded address. App.jsx and CheckoutFlow.jsx now check if there is an address with a zoneId before 
 * making a GET /cart call. If there is not, this action creator is used to set out cart to empty 
 * without causing a 404.
 * 
 * @returns Redux action
 */
export const verifyCartEmpty = () => ({
    type: VERIFY_CART_EMPTY
});