import axios from 'axios';

import config from 'app/config';
import { standardHeaders } from 'lib/api/rest';
import { AnalyticsEvents } from 'lib/analytics';

import {
    SET_CART_ADDRESS_REQUEST, SET_CART_ADDRESS_SUCCESS, SET_CART_ADDRESS_FAILURE,
    ADD_TO_CART_REQUEST, ADD_TO_CART_SUCCESS, ADD_TO_CART_FAILURE,
    SET_DELIVERY_TIME_REQUEST, SET_DELIVERY_TIME_SUCCESS, SET_DELIVERY_TIME_FAILURE, 
    APPLY_PROMO_CODE_REQUEST, APPLY_PROMO_CODE_SUCCESS, APPLY_PROMO_CODE_FAILURE,
    REFRESH_CART_REQUEST, REFRESH_CART_SUCCESS, REFRESH_CART_FAILURE,
    REMOVE_PROMO_CODE_REQUEST, REMOVE_PROMO_CODE_SUCCESS, REMOVE_PROMO_CODE_FAILURE, APPLY_PROMO_CODE_CLEAR, DISPLAY_SURCHARGE_POPUP, HIDE_SURCHARGE_POPUP,
    VERIFY_CART_SUCCESS,
    ADD_BUNDLE_TO_CART_REQUEST, ADD_BUNDLE_TO_CART_SUCCESS, ADD_BUNDLE_TO_CART_FAILURE, REMOVE_BUNDLE_FROM_CART_REQUEST, REMOVE_BUNDLE_FROM_CART_FAILURE, REMOVE_BUNDLE_FROM_CART_SUCCESS
} from '../constants/Cart';

export function displaySurchargePopup() {
    return function (dispatch) {
        dispatch({
            type: DISPLAY_SURCHARGE_POPUP
        });
    }
}

export function hideSurchargePopup() {
    return function (dispatch) {
        dispatch({
            type: HIDE_SURCHARGE_POPUP
        });
    }
}

export function refreshCart(auth) {
    return function (dispatch) {

        dispatch({
            type: REFRESH_CART_REQUEST
        });

        return axios.get(config.baseURI + '/cart', {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1) {
                    dispatch({
                        type: REFRESH_CART_SUCCESS,
                        payload: {
                            cart: resp.data
                        }
                    });
                }
            } else {
                dispatch({
                    type: REFRESH_CART_FAILURE,
                    payload: {
                        error: resp.error
                    }
                });
            }
        }).catch(error => {
            dispatch({
                type: REFRESH_CART_FAILURE,
                payload: {
                    error: error
                }
            });
        });
    }
}

export function setCartAddress(address, auth, history, fromGeocodeAddress=false) {
    return function (dispatch) {

        let payload = {

        };

        dispatch({
            type: SET_CART_ADDRESS_REQUEST,
            payload: payload
        });

        if (address.id !== undefined) {
            payload.addressId = address.id;
        } else if (address.encryptedAddress !== undefined) {
            payload.encryptedAddress = address.encryptedAddress;
        } else {

            dispatch({
                type: SET_CART_ADDRESS_FAILURE,
                payload: {
                    error: 'No Address Id or Encrypted Address'
                }
            });

            return;
        }

        axios.post(config.baseURI + '/cart/address', payload, {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1) {
                    window.tippleAnalytics.trigger(AnalyticsEvents.address_entered_valid, { address: resp.data.address, data: {fromGeocodeAddress} });

                    dispatch({
                        type: SET_CART_ADDRESS_SUCCESS,
                        payload: {
                            cart: resp.data
                        }
                    });

                    // POST returns the updated cart object, so we fire that too
                    dispatch({
                        type: VERIFY_CART_SUCCESS,
                        payload: {
                            cart: resp.data
                        }
                    });

                    // FIXME: This has been here forever but redux actions shouldn't be doing this. We should do it elsewhere.
                    if (history && history?.location?.pathname === '/') {
                        history.push(resp.data.storePath+"/categories");
                    }
                }
            } else {
                dispatch({
                    type: SET_CART_ADDRESS_FAILURE,
                    payload: {
                        error: resp.error
                    }
                });
            }
        }).catch(error => {
            dispatch({
                type: SET_CART_ADDRESS_FAILURE,
                payload: {
                    error: error
                }
            });
        });
    }   
}

export function removeFromCart(cartItemId, productId, productPackId, packSize, price, cartId, productName, oldQuantity, auth, analyticsVariants = null) {
    return function (dispatch) {
        dispatch({
            type: ADD_TO_CART_REQUEST,
            payload: {
                productId: productId,
                packId: productPackId,
                quantity: 0
            }
        });



        return axios.delete(config.baseURI + '/cart/item/'+cartItemId, {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {

                global.tippleAnalytics.trigger(AnalyticsEvents.remove_from_cart, {
                    addToCart: {
                        quantity: oldQuantity,
                        packSize: packSize,
                        cart_id: cartId,
                        price: price
                    },
                    product: {
                        id: productId,
                        name: productName
                    },
                    ...(analyticsVariants ? {
                        variants: analyticsVariants
                    } : {})
                });
                if (resp.error === undefined && resp.data.storeId !== -1) {
                    dispatch({
                        type: ADD_TO_CART_SUCCESS,
                        payload: {
                            productId: productId,
                            packId: productPackId,
                            cart: resp.data
                        }
                    });
                }
            } else {
                dispatch({
                    type: ADD_TO_CART_FAILURE,
                    payload: {
                        productId: productId,
                        packId: productPackId,
                        error: resp.error
                    }
                });
            }
        }).catch(error => {
            dispatch({
                type: ADD_TO_CART_FAILURE,
                payload: {
                    error: error
                }
            });
        });
    }
}

export function removeBundleFromCart(groupRef, auth) {
    return function (dispatch) {
        dispatch({
            type: REMOVE_BUNDLE_FROM_CART_REQUEST,
            payload: { groupRef }
        });

        return axios.delete(config.baseURI + '/cart/collection/' + groupRef, {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1) {
                    dispatch({
                        type: REMOVE_BUNDLE_FROM_CART_SUCCESS,
                        payload: {
                            groupRef,
                            cart: resp.data
                        }
                    });
                }
            } else {
                dispatch({
                    type: REMOVE_BUNDLE_FROM_CART_FAILURE,
                    payload: {
                        groupRef,
                        error: resp.error
                    }
                });
            }
        }).catch(error => {
            dispatch({
                type: REMOVE_BUNDLE_FROM_CART_FAILURE,
                payload: { groupRef, error }
            });
        });
    };
}

export function addToCart(productId, productPackId, quantity, packSize, price, cartId, productName, oldQuantity, isSetQuantity, auth, variants = null, analyticsVariants = null) {
    return function (dispatch) {
        dispatch({
            type: ADD_TO_CART_REQUEST,
            payload: {
                productId: productId,
                packId: productPackId,
                quantity: quantity
            }
        });

        let opts = {
            productId: productId,
            packSize: packSize
        };

        if (isSetQuantity) {
            opts.quantity = quantity;
        } else {
            opts.increment = quantity;
        }

        if (variants) {
            opts.variants = variants;
        }

        return axios.post(config.baseURI + '/cart/item', opts, {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {
                if (opts.quantity === -1) {

                    global.tippleAnalytics.trigger(AnalyticsEvents.remove_from_cart, {
                        addToCart: {
                            quantity: oldQuantity,
                            packSize: packSize,
                            cart_id: cartId,
                            price: price
                        },
                        product: {
                            id: productId,
                            name: productName
                        },
                        ...(analyticsVariants ? {
                            variants: analyticsVariants
                        } : {})
                    });
                }
                if (resp.error === undefined && resp.data.storeId !== -1) {
                    dispatch({
                        type: ADD_TO_CART_SUCCESS,
                        payload: {
                            productId: productId,
                            packId: productPackId,
                            cart: resp.data
                        }
                    });
                }
            } else {
                dispatch({
                    type: ADD_TO_CART_FAILURE,
                    payload: {
                        productId: productId,
                        packId: productPackId,
                        error: resp.error ? resp.error : resp.errors
                    }
                });
            }
        }).catch(error => {
            dispatch({
                type: ADD_TO_CART_FAILURE,
                payload: {
                    error: error?.response?.data?.errors
                }
            });
        });
    }
}

export function addBundleToCart(collectionSlug, products, auth) {
    return function (dispatch) {

        dispatch({
            type: ADD_BUNDLE_TO_CART_REQUEST,
            payload: { collectionSlug, products }
        });

        return axios.post(`${config.baseURI}/cart/collection`, {
            collectionSlug, products
        }, {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1) {
                    dispatch({
                        type: ADD_BUNDLE_TO_CART_SUCCESS,
                        payload: {
                            collectionSlug, products,
                            cart: resp.data
                        }
                    });
                }
            } else {
                dispatch({
                    type: ADD_BUNDLE_TO_CART_FAILURE,
                    payload: {
                        collectionSlug, products,
                        error: resp.error
                    }
                });
            }
        }).catch(error => {
            dispatch({
                type: ADD_BUNDLE_TO_CART_FAILURE,
                payload: {
                    collectionSlug, products,
                    error: error
                }
            });
        });
    }
}

export function setDeliveryTime(deliveryMethodId, deliveryDate, deliveryTime, auth, analyticsData) {
    return function (dispatch) {
        dispatch({
            type: SET_DELIVERY_TIME_REQUEST,
            payload: {
                deliveryMethodId,
                deliveryDate,
                deliveryTime
            }
        });

        return axios.put(config.baseURI + '/cart/delivery-time', {
            deliveryMethodId: deliveryMethodId,
            date: deliveryDate,
            minutes: deliveryTime
        }, {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1) {
                    dispatch({
                        type: SET_DELIVERY_TIME_SUCCESS,
                        payload: {
                            cart: resp.data
                        }
                    });

                    // PUT returns the updated cart object, so we fire that too
                    dispatch({
                        type: VERIFY_CART_SUCCESS,
                        payload: {
                            cart: resp.data
                        }
                    });

                    // Analytics for successfully selecting a delivery time
                    window.tippleAnalytics.trigger(AnalyticsEvents.delivery_method_added, analyticsData);
                }
            } else {
                dispatch({
                    type: SET_DELIVERY_TIME_FAILURE,
                    payload: {

                    }
                });
            }
        }).catch(error => {
            dispatch({
                type: SET_DELIVERY_TIME_FAILURE,
                payload: {
                    error: error
                }
            });
        });
    }   
}

export function applyPromotionCode(promoCode, cartId, auth) {
    return function (dispatch) {
        

        dispatch({
            type: APPLY_PROMO_CODE_REQUEST,
            payload: {
                promoCode: promoCode
            }
        });

        return axios.put(config.baseURI + '/cart/promotion-code', {
            code: promoCode
        }, {
            headers: standardHeaders(auth),
            validateStatus: function (status) { return status >= 200 && status < 500; },
        }).then((resp) => {
            if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1) {
                    let data = {
                        cart: {id: resp.data.id},
                        promo: {'code': promoCode},
                    }
                    window.tippleAnalytics.trigger(AnalyticsEvents.promo_code_success, data);
                    dispatch({
                        type: APPLY_PROMO_CODE_SUCCESS,
                        payload: {
                            cart: resp.data,
                        }
                    });
                } else {
                    let data = {
                        cart: {id: cartId},
                        promo: {
                            'code': promoCode,
                            error: 'Unknown Error'
                        },
                    }
                    window.tippleAnalytics.trigger(AnalyticsEvents.promo_code_failed, data);

                }
            } else {

                let data = {
                    cart: {id: cartId},
                    promo: {
                        'code': promoCode,
                        error: resp.data.errors? resp.data.errors[0].displayMessage : 'Unknown Error - HTTP Response'
                    },
                }
                window.tippleAnalytics.trigger(AnalyticsEvents.promo_code_failed, data);
                dispatch({
                    type: APPLY_PROMO_CODE_FAILURE,
                    payload: {
                        error: resp.data.errors
                    }
                });
            }
        }).catch(error => {
            let data = {
                cart: {id: cartId},
                promo: {
                    'code': promoCode,
                    error: error? error : 'Unknown Error - Exception'
                },
            }
            window.tippleAnalytics.trigger(AnalyticsEvents.promo_code_failed, data);
            dispatch({
                type: APPLY_PROMO_CODE_FAILURE,
                payload: {
                    error: error
                }
            });
        });
    }   
}

export function clearPromotionCodeError() {
    return function (dispatch) {
        dispatch({
            type: APPLY_PROMO_CODE_CLEAR
        });
    }   
}

export function removePromotionCode(promoCode,auth) {
    return function (dispatch) {
        dispatch({
            type: REMOVE_PROMO_CODE_REQUEST,
            payload: {

            }
        });

        return axios.delete(config.baseURI + '/cart/promotion-code', {
            headers: standardHeaders(auth)
        }).then((resp) => {
            if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1) {
                    let data = {
                        cart: {id: resp.data.id},
                        promo: {code: promoCode}
                    }
                    window.tippleAnalytics.trigger(AnalyticsEvents.promo_code_removed, data);
                    dispatch({
                        type: REMOVE_PROMO_CODE_SUCCESS,
                        payload: {
                            cart: resp.data
                        }
                    });
                }
            } else {
                dispatch({
                    type: REMOVE_PROMO_CODE_FAILURE,
                    payload: {

                    }
                });
            }
        }).catch(error => {
            dispatch({
                type: REMOVE_PROMO_CODE_FAILURE,
                payload: {
                    error: error
                }
            });
        });
    }   
}