import { createReducer } from 'lib/createReducer';

export const PROMO_CODE_SET = 'PROMO_CODE_SET';
export const PROMO_CODE_CLEAR = 'PROMO_CODE_CLEAR';

const initialState = {
    promoCode: null
};

export default createReducer(initialState, {
    [PROMO_CODE_CLEAR]: state => {
        return {
            ...state,
            promoCode: null
        };
    },
    [PROMO_CODE_SET]: (state, data) => {
        return {
            ...state, 
            promoCode: data.payload
        };
    }
});

// Action creators
const acClearPromoCode = () => ({
    type: PROMO_CODE_CLEAR
});

const acSetPromoCode = promoCode => ({
    type: PROMO_CODE_SET,
    payload: String(promoCode)
});

// Actions
export const clearPromoCode = () => dispatch => dispatch(acClearPromoCode());
export const setPromoCode = promoCode => dispatch => dispatch(acSetPromoCode(promoCode));
