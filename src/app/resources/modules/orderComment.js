import { createReducer } from 'lib/createReducer';

// Actions
export const SET_ORDER_COMMENT = 'SET_ORDER_COMMENT';
export const CLEAR_ORDER_COMMENT = 'CLEAR_ORDER_COMMENT';

// Reducer
const initialState = {
    comment: null
};

export default createReducer(initialState, {
    [SET_ORDER_COMMENT]: (state, data) => ({
        ...state,
        comment: data.payload?.orderComment
    }),
    [CLEAR_ORDER_COMMENT]: state => ({
        ...state,
        comment: null
    })
});

// Action Creators
export const setOrderComment = orderComment => dispatch => {
    dispatch({
        type: SET_ORDER_COMMENT,
        payload: {
            orderComment
        }
    });
};

export const clearOrderComment = () => dispatch => {
    dispatch({
        type: CLEAR_ORDER_COMMENT
    });
};
