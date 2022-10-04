import { createReducer } from 'lib/createReducer';
import {
    ADD_TO_CART_REQUEST,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAILURE,
    ADD_BUNDLE_TO_CART_SUCCESS,
    VERIFY_CART_REQUEST,
    VERIFY_CART_SUCCESS,
    VERIFY_CART_FAILURE,
    VERIFY_CART_EMPTY,
    SET_CART_ADDRESS_REQUEST,
    SET_CART_ADDRESS_FAILURE,
    SET_CART_ADDRESS_SUCCESS,
    SET_DELIVERY_TIME_REQUEST,
    SET_DELIVERY_TIME_SUCCESS,
    SET_DELIVERY_TIME_FAILURE,
    APPLY_PROMO_CODE_SUCCESS,
    REMOVE_PROMO_CODE_SUCCESS,
    APPLY_PROMO_CODE_FAILURE,
    APPLY_PROMO_CODE_CLEAR,
    DISPLAY_SURCHARGE_POPUP,
    HIDE_SURCHARGE_POPUP,
    REFRESH_CART_REQUEST, 
    REFRESH_CART_SUCCESS,
    ADD_BUNDLE_TO_CART_REQUEST,
    ADD_BUNDLE_TO_CART_FAILURE,
    REMOVE_BUNDLE_FROM_CART_REQUEST,
    REMOVE_BUNDLE_FROM_CART_SUCCESS,
    REMOVE_BUNDLE_FROM_CART_FAILURE
} from '../constants/Cart';

const initialState = {
    currentCart: null,
    cartItemCount: 0,
    promoCodeError: [],
    isAddingBundle: false,
    isRequesting: false,
    isRequestingDelivery: false,
    didAttemptCartVerification: false,
    displaySurchargePopup: false,
    surchargeAccepted: false,
    isSettingCartAddress: false
};

function computeCartItemCount(cartItems) {
    return cartItems.reduce((sum, item) => {
        if (item.bundleItems && Array.isArray(item.bundleItems) && item.bundleItems.length > 0 && item.groupRef) { 
            return sum + item.bundleItems.reduce((sum, bundleItem) => sum + bundleItem.quantity, 0) 
        } else {
            return sum + item.quantity;
        }
    }, 0) ?? 0;
}

export default createReducer(initialState, {

    [DISPLAY_SURCHARGE_POPUP]: (state, data) => {
        return Object.assign({}, state, {
            displaySurchargePopup: true,
            surchargeAccepted: true
        })
    },
    
    [HIDE_SURCHARGE_POPUP]: (state, data) => {
        return Object.assign({}, state, {
            displaySurchargePopup: false,
            surchargeAccepted: false
        })
    },

    [REFRESH_CART_REQUEST]: (state, data) => {
        return Object.assign({}, state, {
            'currentCart': null,
            cartItemCount: 0,
            isRequesting: true
        });
    },

    [REFRESH_CART_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            'currentCart': data.payload.cart,
            cartItemCount: computeCartItemCount(data.payload.cart?.items ?? []),
            isRequesting: false
        });
    },

    [APPLY_PROMO_CODE_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            'currentCart': data.payload.cart,
            cartItemCount: computeCartItemCount(data.payload.cart?.items ?? [])
        });
    },

    [REMOVE_PROMO_CODE_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            'currentCart': data.payload.cart,
            cartItemCount: computeCartItemCount(data.payload.cart?.items ?? [])
        });
    },

    [SET_CART_ADDRESS_REQUEST]: (state, data) => {
        return {
            ...state,
            isSettingCartAddress: true,
            errorCartAddress: false
        };
    },

    [SET_CART_ADDRESS_FAILURE]: (state, data) => {
        return {
            ...state,
            isSettingCartAddress: false,
            errorCartAddress: true
        };
    },

    [SET_CART_ADDRESS_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            'currentCart': data.payload.cart,
            cartItemCount: computeCartItemCount(data.payload.cart?.items ?? []),
            isSettingCartAddress: false,
            errorCartAddress: false
        });
    },

    [APPLY_PROMO_CODE_FAILURE]: (state, data) => {
        return Object.assign({}, state, {
            'promoCodeError': data.payload.error
        });
    },

    [APPLY_PROMO_CODE_CLEAR]: (state, data) => {
        return Object.assign({}, state, {
            'promoCodeError': []
        });
    },

    [ADD_TO_CART_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            'currentCart': data.payload.cart,
            cartItemCount: computeCartItemCount(data.payload.cart?.items ?? [])
        });
    },

    [ADD_TO_CART_FAILURE]: (state, data) => {
        return ({
            ...state,
            errorAdd: data.payload?.error?.length > 0 ? data.payload.error[0].displayMessage : data.payload?.error
        })
    },

    [ADD_BUNDLE_TO_CART_REQUEST]: (state, data) => {
        return {...state, isAddingBundle: true};
    },

    [ADD_BUNDLE_TO_CART_SUCCESS]: (state, data) => {
        return {
            ...state, 
            isAddingBundle: false, 
            currentCart: data.payload.cart,
            cartItemCount: computeCartItemCount(data.payload.cart?.items ?? [])
        };
    },

    [ADD_BUNDLE_TO_CART_FAILURE]: (state, data) => {
        return {...state, isAddingBundle: false};
    },

    [REMOVE_BUNDLE_FROM_CART_REQUEST]: (state, data) => {
        return {...state};
    },

    [REMOVE_BUNDLE_FROM_CART_SUCCESS]: (state, data) => {
        return {
            ...state, 
            currentCart: data.payload.cart,
            cartItemCount: computeCartItemCount(data.payload.cart?.items ?? [])
        };
    },

    [REMOVE_BUNDLE_FROM_CART_FAILURE]: (state, data) => {
        return {...state};
    },

    [SET_DELIVERY_TIME_REQUEST]: (state, data) => {
        return {
            ...state,
            isRequestingDelivery: true
        };
    },

    [SET_DELIVERY_TIME_SUCCESS]: (state, data) => {
        return {
            ...state,
            currentCart: data.payload.cart,
            cartItemCount: computeCartItemCount(data.payload.cart?.items ?? []),
            isRequestingDelivery: false
        };
    },

    [SET_DELIVERY_TIME_FAILURE]: (state, data) => {
        return {
            ...state,
            isRequestingDelivery: false
        };
    },

    [VERIFY_CART_REQUEST]: (state, data) => {
        return {
            ...state,
            isRequesting: true
        };
    },

    [VERIFY_CART_SUCCESS]: (state, data) => {
        return {
            ...state,
            currentCart: data.payload.cart,
            cartItemCount: computeCartItemCount(data.payload.cart?.items ?? []),
            didAttemptCartVerification: true,
            isRequesting: false
        };
    },

    [VERIFY_CART_FAILURE]: (state, data) => {
        return {
            ...state,
            currentCart: null,
            cartItemCount: 0,
            didAttemptCartVerification: true,
            isRequesting: false
        };
    },

    [VERIFY_CART_EMPTY]: (state) => ({
        ...state,
        currentCart: null,
        cartItemCount: 0,
        didAttemptCartVerification: true,
        isRequesting: false
    }),

    [ADD_TO_CART_REQUEST]: (state, data) => {

        // const exists = state.items[data.payload.id] !== undefined;

        return Object.assign({}, state, {
            errorAdd: null
            // items: {
            //     [data.payload.id]: data.payload.count
            // }
        });
    }
});