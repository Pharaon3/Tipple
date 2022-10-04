import {
    DISPLAY_REFERRAL_CODE,
    HIDE_REFERRAL_CODE
} from '../constants/Auth';

export function displayReferralCodePopup() {
    return function (dispatch) {
        dispatch({
            type: DISPLAY_REFERRAL_CODE
        });
    }
}

export function hideReferralCodePopup() {
    return function (dispatch) {
        dispatch({
            type: HIDE_REFERRAL_CODE
        });
    }
}