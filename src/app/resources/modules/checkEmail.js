import axios from 'axios';

import config from 'app/config';
import { standardHeaders } from 'lib/api/rest';

import { createReducer } from 'lib/createReducer';

// Actions
export const CHECK_EMAIL_REQUEST = 'CHECK_EMAIL_REQUEST';
export const CHECK_EMAIL_SUCCESS = 'CHECK_EMAIL_SUCCESS';
export const CHECK_EMAIL_FAILURE = 'CHECK_EMAIL_FAILURE';
export const CHECK_EMAIL_RESET = 'CHECK_EMAIL_RESET';

// Reducer
const initialState = {
    emailExists: null,
    emailChecked: null,
    isRequesting: false,
    hasRequested: false,
    hasError: false
};

export default createReducer(initialState, {
    [CHECK_EMAIL_RESET]: state => ({
        ...state,
        isRequesting: false,
        hasRequested: false,
        hasError: false,
        emailExists: null,
        emailChecked: null
    }),
    [CHECK_EMAIL_REQUEST]: state => {
        return {
            ...state,
            isRequesting: true,
            hasRequested: false,
            hasError: false,
            emailExists: null,
            emailChecked: null
        };
    },

    [CHECK_EMAIL_SUCCESS]: (state, data) => {
        return {
            ...state,
            isRequesting: false,
            hasRequested: true,
            hasError: false,
            emailExists: !!data?.payload?.success,
            emailChecked: data?.meta?.email
        };
    },

    [CHECK_EMAIL_FAILURE]: (state, data) => {
        return {
            ...state,
            isRequesting: false,
            hasRequested: true,
            hasError: true,
            emailExists: null,
            emaliChecked: null
        }
    }
});

// Action Creators
export const checkEmail = (emailAddress, auth) => (dispatch) => {
    dispatch({
        type: CHECK_EMAIL_REQUEST
    });

    axios
        .get(`${config.baseURI}/check-email?email=${encodeURIComponent(emailAddress)}`, {
            headers: standardHeaders(auth)
        })
        .then(resp => {
            if (resp.status === 200) {
                if (resp.error === undefined) {
                    dispatch({
                        type: CHECK_EMAIL_SUCCESS,
                        payload: {
                            success: resp.data?.success
                        },
                        meta: {
                            email: emailAddress
                        }
                    });
                } else {
                    dispatch({
                        type: CHECK_EMAIL_FAILURE
                    });
                }
            } else {
                dispatch({
                    type: CHECK_EMAIL_FAILURE,
                    payload: {
                        error: resp.error
                    }
                });
            }
        })
        .catch(error => {
            // If there is an API error ie. 400 Bad Request, error will be an object rather than a nice
            // error string (which is the response given by other failure scenarios), so override it.
            const errorResponse = typeof error !== 'object' ? error : 'Could not validate email';

            dispatch({
                type: CHECK_EMAIL_FAILURE,
                payload: {
                    error: errorResponse
                }
            });
        }
    );
};

export const resetCheckEmail = () => dispatch => {
    dispatch({
        type: CHECK_EMAIL_RESET
    });
};
