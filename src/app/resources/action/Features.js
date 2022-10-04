/**
 * Here we'll have the logic around fetching and storing SDK treatments. We could move more behaviour to the Split.js
 * file, even make a wrapper on top of the getTreatment/s calls, but that should not be necessary.
 * 
 * To modify the flags that are being evaluated, change those on the constants file (or stop using the constants)
 */
import { getClient } from '../../../lib/splitIo';
import {
    // Features to evaluate
    USER_FEATURES,
    // Actions
    SPLIT_FEATURE_READ,
    SPLIT_READY,
    SPLIT_TIMED_OUT
} from '../constants/Features';

export function getFeatures(userId) {
    return (dispatch, getState) => {
        const onReady = client => {
            // SDK got ready, so notify that to update the flag.
            dispatch(notifyReady());
            // As the SDK is now ready, read the batch of treatments.
            dispatch(readTreatments(client));
        };
        const onUpdate = client => {
            dispatch(readTreatments(client));
        };

        const onTimeout = () => {
            dispatch(notifyTimeout());
        };

        // TODO: Do we even need it to return the client? Could be named better.
        getClient(userId, onReady, onUpdate, onTimeout);
    };
}

/**
 * Notifies that the Split SDK is ready and stores that flag.
 */
export function notifyReady() {
    return dispatch => {
        dispatch({
            type: SPLIT_READY
        });
    };
}

/**
 * Notifies that the Split SDK was not ready so the app can react to it.
 */
export function notifyTimeout() {
    return dispatch => {
        dispatch({
            type: SPLIT_TIMED_OUT
        });
    };
}

/**
 * Reads the treatments using Split SDk and stores them on the Redux store.
 */
export function readTreatments(client) {
    return (dispatch, getState) => {
        const state = getState();
        const attributes = {
            addressState: state.cart.currentCart ? state.cart.currentCart?.address?.state?.replace(/\s/gi, '') : '',
            zoneId: state.cart.currentCart && state.cart.currentCart.address && state.cart.currentCart.address.zoneId ? state.cart.currentCart.address.zoneId : ''
        };

        // We call the Split SDK to retrieve the flags.
        const userTreatments = client.getTreatments(USER_FEATURES, attributes);

        dispatch({
            type: SPLIT_FEATURE_READ,
            treatments: userTreatments
        });
    };
}