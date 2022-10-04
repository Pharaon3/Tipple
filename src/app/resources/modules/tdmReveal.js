import { createReducer } from 'lib/createReducer';

// Actions
export const TDM_REVEALED = 'TDM_REVEAL_SET';
export const TDM_REVEAL_RESET = 'TDM_REVEAL_RESET';
export const TDM_SHOW_ALERT = 'TDM_SHOW_ALERT';
export const TDM_HIDE_ALERT = 'TDM_HIDE_ALERT';

// Reducer
const initialState = {
    revealed: false,
    alertShowing: false,
    alertMessage: ''
};

export default createReducer(initialState, {
    [TDM_REVEALED]: state => ({
        ...state,
        revealed: true
    }),
    [TDM_REVEAL_RESET]: state => ({
        ...state,
        revealed: false
    }),
    [TDM_SHOW_ALERT]: (state, data) => ({
        ...state,
        alertShowing: true,
        alertMessage: data.payload?.alertMessage
    }),
    [TDM_HIDE_ALERT]: state => ({
        ...state,
        alertShowing: false,
        alertMessage: ''
    })
});

// Action Creators
export const setTdmRevealed = () => (dispatch) => {
    dispatch({
        type: TDM_REVEALED
    });
};

export const resetTdmRevealed = () => dispatch => {
    dispatch({
        type: TDM_REVEAL_RESET
    });
};

export const setAlertShowing = (message) => (dispatch) => {
    dispatch({
        type: TDM_SHOW_ALERT,
        payload: {
            alertMessage: message
        }
    });
};

export const hideAlertShowing = () => dispatch => {
    dispatch({
        type: TDM_HIDE_ALERT
    });
};
