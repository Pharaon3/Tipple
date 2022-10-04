import { AnalyticsEvents, MapUrlToPageData } from '../analytics';
import { getStore } from '../../store';
import { Object } from 'core-js';
import { stripNulls } from 'lib/util/object';
import { getHostname } from 'app/utils/getHostname';

const getFeatureFlags = () => {
    const dataStore = getStore();

    if (!dataStore) {
        return {};
    }

    const state = dataStore.getState();

    const flags = state.features && state.features.flags ? state.features.flags : {};

    let featureFlags = {};

    Object.keys(flags).forEach(flag => {
        featureFlags[`feature_${flag}`] = flags[flag];
    });

    return featureFlags;
};

export const Traits = {
    'birthday': null,
    'email': null,
    'firstName': null,
    'lastName': null,
    'phone': null,
    'createdAt': null,
    'type': null,
    'logged_in': null,
    'session_id': null,
    'web_message_id': null,
    'address': null
};

export default class Segment {

    analyticsLoaded = false;

    defaultOptions = {
        app: {
            name: process?.env?.REACT_APP_NAME,
            version: process?.env?.REACT_APP_VERSION
        }
    }

    defaultParameters = {
        'beta': false
    }

    log(...args) {
        if (window.trackAnalytics) {
            console.log(...args);
        }
    }

    trigger(eventName, eventData, analyticsData) {
        // modify address payload if provided to match segment spec
        if (analyticsData && analyticsData.address) {
            analyticsData.address = this._formatAddress({
                address: analyticsData.address
            })
        }
        this.defaultParameters = { ...this.defaultParameters, ...getFeatureFlags(), ...analyticsData };

        if (!Object.hasOwnProperty.call(global, 'analytics')) {
            this.log('SEGMENT TRACK NOT ENABLED: ' + eventName, { ...eventData, ...analyticsData }, this.defaultParameters);
            return false;
        }
        this.log('SEGMENT TRIGGERING: ' + eventName, eventData, this.defaultParameters);
        switch (eventName) {
            case AnalyticsEvents.analytics_exception:
                this._track('Analytics Exception', { ...eventData });
                break;
            case AnalyticsEvents.checkout_new_payment:
                this._track('Payment Info Entered', { ...eventData.payment });
                break;
            case AnalyticsEvents.checkout_new_payment_failed:
                this._track('Payment Info Failed', { ...eventData.payment });
                break;
            case AnalyticsEvents.promo_code_removed:
                this._track('Coupon Removed', this._formatPromo(eventData));
                break;
            case AnalyticsEvents.promo_code_added:
                this._track('Coupon Entered', this._formatPromo(eventData));
                break;
            case AnalyticsEvents.promo_code_success:
                this._track('Coupon Applied', this._formatPromo(eventData));
                break;
            case AnalyticsEvents.promo_code_failed:
                this._track('Coupon Denied', this._formatPromo(eventData));
                break;
            case AnalyticsEvents.address_entry_started:
                this._track('Address Entry Started', {});
                break;
            case AnalyticsEvents.address_entered:
                this._track('Searched Address', { entered_address: eventData.entered_address });
                break;
            case AnalyticsEvents.address_entered_valid:
                this._track('Entered Address', this._formatAddress(eventData));
                this._track('Valid Address', this._formatAddress(eventData));
                break;
            case AnalyticsEvents.address_entered_cancel:
                this._track('Address Cancel', this._formatAddress(eventData));
                break;
            case AnalyticsEvents.address_entered_invalid:
                this._track('Entered Address', this._formatAddress(eventData));
                this._track('Invalid Address', this._formatAddress(eventData));
                break;
            case AnalyticsEvents.user_logout:
                this._track('User Logout', {}, {}, () => {
                    this._reset();
                });
                break;
            case AnalyticsEvents.account_created:
                this._track('Account Created', this._formatAccount(eventData));
                break;
            case AnalyticsEvents.checkout_failed:
                this._track('Order Failed', this._formatCheckout(eventData));
                break;
            case AnalyticsEvents.product_viewed:
                this._track('Product Viewed', this._formatProduct(eventData));
                break;
            case AnalyticsEvents.product_list_viewed:
                this._track('Product List Viewed', this._formatProductList(eventData));
                break;
            case AnalyticsEvents.product_list_filtered:
                this._track('Product List Filtered', this._formatProductListFiltered(eventData));
                break;
            case AnalyticsEvents.category_clicked:
                this._track('Category Clicked', this._formatCategoryClicked(eventData));
                break;
            case AnalyticsEvents.collection_interaction:
                this._track('Collection Interaction', this._formatCollectionInteraction(eventData));
                break;
            case AnalyticsEvents.home_viewed:
                this._track('Home Viewed', this._formatHomeViewed(eventData));
                break;
            case AnalyticsEvents.category_viewed:
                this._track('Category Viewed', this._formatCategoryViewed(eventData));
                break;
            case AnalyticsEvents.cart_viewed:
                this._track('Cart Viewed', this._formatCart(eventData));
                break;
            case AnalyticsEvents.delivery_methods_viewed:
                this._track('Delivery Methods Viewed', this._formatDeliveryMethods(eventData));
                break;
            case AnalyticsEvents.delivery_method_clicked:
                this._track('Delivery Method Clicked', this._formatDeliveryMethodClicked(eventData));
                break;
            case AnalyticsEvents.delivery_method_added:
                this._track('Delivery Method Added', this._formatDeliveryMethodAdded(eventData));
                break;
            case AnalyticsEvents.delivery_method_denied:
                this._track('Delivery Method Denied', this._formatDeliveryMethodDenied(eventData));
                break;
            case AnalyticsEvents.add_to_cart:
                this._track('Product Added', this._formatProductAdd(eventData));
                break;
            case AnalyticsEvents.product_variant_selected:
                this._track('Product Variant Selected', this._formatProductVariantSelected(eventData));
                break;
            case AnalyticsEvents.remove_from_cart:
                this._track('Product Removed', this._formatProductAdd(eventData));
                break;
            case AnalyticsEvents.checkout_process_started:
                this._track('Checkout Process Started');
                break;
            case AnalyticsEvents.checkout_step_viewed:
                this._track('Checkout Step Viewed', this._formatCheckoutStepViewed(eventData));
                break;
            case AnalyticsEvents.checkout_step_completed:
                this._track('Checkout Step Completed', this._formatCheckoutStepCompleted(eventData));
                break;
            case AnalyticsEvents.checkout_nav_item_clicked:
                this._track('Checkout Nav Item Clicked', this._formatCheckoutNavItemClicked(eventData));
                break;
            case AnalyticsEvents.checkout_viewed:
                this._track('Checkout Started', this._formatCheckout(eventData));
                break;
            case AnalyticsEvents.ecommerce_purchase:
                this._track('Order Completed', this._formatCheckoutCompleted(eventData));
                break;
            case AnalyticsEvents.checkout_process_completed:
                this._track('Checkout Process Completed');
                break;
            case AnalyticsEvents.order_tracking_viewed:
                this._track('Order Tracking Viewed', this._formatOrderTracking(eventData));
                break;
            case AnalyticsEvents.user_is_guest:
                this._identify(null);
                break;
            case AnalyticsEvents.user_login_success:
                this._track('User Login', {});
                break;
            case AnalyticsEvents.user_login_failed:
                this._track('User Login Failed', {});
                break;
            case AnalyticsEvents.user_identify:
                //this._alias(eventData.user,() => {});
                this._identify(eventData.user);
                break;
            case AnalyticsEvents.user_alert:
                this._track('User Alert', this._formatModal(eventData));
                break;
            case AnalyticsEvents.user_alert_action:
                this._track('User Alert Action', this._formatModalAction(eventData));
                break;
            case AnalyticsEvents.support_request:
                this._track('Support Request', this._formatSupportRequest(eventData));
                break;
            case AnalyticsEvents.app_pageview:
                const pageData = eventData && eventData.page && eventData.page.path ? MapUrlToPageData(eventData.page.path) : { 'name': 'Not Set' };
                let pageProperties = eventData ? eventData.data : {};

                if (!pageData.ignorePage) {
                    this._page(pageData.name, pageData.category, pageProperties);
                }
                break;
            case AnalyticsEvents.search:
            case AnalyticsEvents.update_cart:
            case AnalyticsEvents.add_delivery_method:
            case AnalyticsEvents.popup_sorry:
            case AnalyticsEvents.sorry_subscribe:
            default:
                this._track('Unhandled', { 'eventName': eventName, ...eventData, ...analyticsData });
                break;
        }
        return true;
    }

    _reset() {
        window.analytics.reset();
    }

    _identify(user, address) {
        let traits = {
            logged_in: false,
            type: 'GUEST',
            ...this.defaultParameters
        };
        let userId = null;
        let created = '';
        if (user) {
            created = user.createdDate;
            userId = user.id;
            traits.birthday = user.dob;
            traits.email = user.email;
            traits.firstName = user.firstname;
            traits.lastName = user.lastname;
            traits.phone = user.mobile ? user.mobile.toString() : '';
            traits.createdAt = created;
            traits.type = user.type ? user.type.toString() : '';
            traits.logged_in = true;
        }
        if (address) {
            //traits.address = this.formatAddress({address});
        }

        window.analytics.identify(userId, traits, this.defaultOptions);
    }


    _track(event, properties = {}, options = {}, callback = () => { }) {
        window.analytics.track(event, { ...this.defaultParameters, ...properties }, { ...this.defaultOptions, ...options }, callback);
    }

    _page(name, category, properties = {}, options = {}, callback = () => { }) {
        if (category != null) {
            window.analytics.page(category, name, { ...this.defaultParameters, ...properties }, { ...this.defaultOptions, ...options }, callback);
        } else {
            window.analytics.page(name, { ...this.defaultParameters, ...properties }, { ...this.defaultOptions, ...options }, callback);
        }
    }

    _alias(user, callback) {
        window.analytics.alias(user.id, undefined, this.defaultOptions, callback);
    }

    _formatModal(data) {

        let ret = {};
        const pageData = MapUrlToPageData(data.modal.from)
        if (data.modal) {
            ret = Object.assign(ret, {
                message: data.modal.message,
                type: data.modal.type,
                from: pageData.name
            });
        }

        ret = Object.assign(ret, this.defaultParameters);
        return ret;

    }

    _formatModalAction(data) {

        let ret = {};
        const pageData = MapUrlToPageData(data.modal.from)
        if (data.modal) {
            ret = Object.assign(ret, {
                message: data.modal.message,
                type: data.modal.type,
                from: pageData.name,
                action: data.modal.action,
                payload: data.modal.payload || {}
            });
        }

        ret = Object.assign(ret, this.defaultParameters);
        return ret;

    }

    _formatProductList(data) {
        let ret = {
            list_id: data.list_id || null,
            category: data.category || null,
            collection: data.collection || null,
            collection_id: data.collectionId || null,
            query: data.query || null,
            sort: data.sort || null,
            type: data.type || null,
            count: data.count,
            from: data.from,
            promotion_ref: data.promotion_ref,
            count_inactive: data.countInactive
        };

        return ret;
    }

    // Product List Filtered
    _formatProductListFiltered(data) {
        return stripNulls({
            category: data.category || null,
            collection: data.collection || null,
            collection_id: data.collectionId || null,
            list_id: data.category ? data.category.id : null,
            filters: data.filters || null,
            sorts: data.sorts?.length > 0 ? data.sorts : null,
            from: data.from?.length > 0 ? data.from : null,
            query: data.query || null
        });
    }

    _formatCategoryClicked(data) {
        return stripNulls({
            id: data.id || null,
            slug: data.slug || null,
            name: data.name || null,
            from: data.from || null,
            type: data.type || null,
            parentCategory: data.parentCategory || null
        });
    }

    _formatCollectionInteraction(data) {
        return stripNulls({
            interaction: data.interaction || null,
            id: data.id || null,
            name: data.name || null,
            type: data.type || null,
            from: data.from || null,
            count: data.count || null,
            item_id: data.item_id || null,
            item_name: data.item_name || null,
            item_position: data.item_position || null,
            item_type: data.item_type || null,
            promotion_ref: data.promotion_ref || null
        });
    }

    _formatHomeViewed(data) {
        return stripNulls({
            collections: data.collections?.length > 0 ? data.collections : null
        });
    }

    _formatCategoryViewed(data) {
        return stripNulls({
            id: data.id || null,
            slug: data.slug || null,
            name: data.name || null,
            collections: data.collections?.length > 0 ? data.collections : null
        });
    }

    _formatAccount(data) {

        let ret = {};

        if (data.address) {
            ret = Object.assign(ret, {
                store_id: data.address.storeId ? data.address.storeId : null,
                zone_id: data.address.zoneId ? data.address.zoneId : null,
                address: {
                    street: data.address.addressLine1 + (data.address.addressLine2 ? ' ' + data.address.addressLine2 : ''),
                    city: data.address.city,
                    postalCode: data.address.postcode,
                    state: data.address.state,
                    country: data.address.country,
                    lat: data.address.lat,
                    lng: data.address.lng,
                    store_id: data.address.storeId ? data.address.storeId : null,
                    zone_id: data.address.zoneId ? data.address.zoneId : null
                }
            });
        }

        return ret;

    }

    _checkoutStepData(data) {
        return {
            step: data.step || null,
            step_name: data.step_name || null,
            delivery_display_type: data.delivery_display_type || null,
            payment_method: data.payment_method || null,
            coupon: data.coupon || null,
            discount: data.discount || null
        };
    }

    _formatCheckoutStepViewed(data) {
        return {
            step: data.step || null,
            step_name: data.step_name || null,
            delivery_display_type: data.delivery_display_type || null,
            payment_method: data.payment_method || null
        };
    }

    _formatCheckoutStepCompleted(data) {
        return {
            ...this._checkoutStepData(data)
        };
    }

    _formatCheckoutNavItemClicked(data) {
        return {
            from: data.from || null,
            to: data.to || null
        };
    }

    _formatCheckoutCompleted(data) {
        let ret = this._formatCheckout(data);
        ret.is_tipple_tracking = data.isTippleTracking;
        return ret;
    }

    _formatCheckout(data) {

        let ret = {
            error_message: data.data && ('error_message' in data.data) ? data.data.error_message : null,
            error_body: data.data && ('error_body' in data.data) ? data.data.error_body : null,
            error_code: data.data && ('error_code' in data.data) ? data.data.error_code : null,
            reason: data.data && ('error_message' in data.data) ? data.data.error_message : null
        };

        const shipping_type = data.cart.deliveryMethod ? data.cart.deliveryMethod.deliveryType : data.cart.deliveryTimeMinutes === -1 ? 'ASAP' : 'FUTURE';

        if (data.cart) {
            ret = Object.assign(ret, {
                revenue: data.cart.subTotal,
                value: data.cart.total,
                total: data.cart.total,
                shipping: data.cart.lineItems ? data.cart.lineItems.reduce(
                    (a, c) => c.type === 'DELIVERY' ? a + c.value : a
                    , 0) : null,
                shipping_type: shipping_type,
                tobacco: data.cart.containsTobacco,
                cart_size: data.cart.items ? data.cart.items.reduce((a, c) => a + c.quantity, 0) : null,
                currency: 'AUD',
                surcharge: data.cart.surcharge,
                service_fee: data.cart.serviceFee,
                coupon: data.cart.discounts ? data.cart.discounts.reduce(
                    (a, d) => { if (d.discountApplied && d.promoCode) a.push(d.promoCode.code); return a }
                    , []).join(', ') : null,
                products: data.cart.items ? data.cart.items.map(ci => 
                    (Array.isArray(ci.bundleItems) && ci.bundleItems.length > 0 && ci.groupRef ? 
                        (ci.bundleItems.map(p => ({
                            product_id: p.productId,
                            name: p.productName,
                            variant: p.packSize,
                            price: p.salePrice > 0 ? p.salePrice : p.price,
                            quantity: p.quantity,
                            item_group: ci.groupRef,
                            promotion_ref: ci.bundleReferencePath
                        })
                    )) :
                    ({
                        product_id: ci.productId,
                        name: ci.productName,
                        variant: ci.packSize,
                        price: ci.salePrice > 0 ? ci.salePrice : ci.price,
                        quantity: ci.quantity
                    }))
                ).flat() : null
            });
        }

        if (data.address) {
            ret = Object.assign(ret, {
                address: {
                    street: data.address.addressLine1 + (data.address.addressLine2 ? ' ' + data.address.addressLine2 : ''),
                    city: data.address.city,
                    postalCode: data.address.postcode,
                    state: data.address.state,
                    country: data.address.country,
                    lat: data.address.lat,
                    lng: data.address.lng,
                    store_id: data.address.storeId ? data.address.storeId : null,
                    zone_id: data.address.zoneId ? data.address.zoneId : null
                }
            });
        }

        ret = Object.assign(ret, {
            gift: data.checkout && data.checkout.gift ? data.checkout.gift : false,
            card_type: data.checkout && data.checkout.paymentType ? data.checkout.paymentType : null,
            order_number: data.order ? data.order.orderNumber : null,
            order_id: data.order ? data.order.orderId : null,
        });

        return ret;

    }

    _formatOrderTracking(data) {
        return {
            is_tipple_tracking: data.isTippleTracking,
            order_number: data.order ? data.order.orderNumber : null,
            order_status: data?.order?.status ?? null
        };
    }

    _formatCart(data) {

        let ret = {};

        if (data.cart) {
            const hostname = `https://${getHostname()}`;
            ret = Object.assign(ret, {
                cart_id: data.cart.id,
                surcharge: data.cart.surcharge,
                service_fee: data.cart.serviceFee,
                products: data.cart.items ? data.cart.items.map(ci => {
                    if (Array.isArray(ci.bundleItems) && ci.bundleItems.length > 0) {
                        if (ci.groupRef) {
                            // Actual bundle as it has a groupRef
                            return ci.bundleItems.map(p => ({
                                currency: 'AUD',
                                image_url: p.primaryImageSrc,
                                item_group: ci.groupRef,
                                name: p.productName,
                                price: p.salePrice > 0 ? p.salePrice : p.price,
                                product_id: p.productId + '',
                                promotion_ref: ci.bundleReferencePath,
                                quantity: p.quantity,
                                sku: p.sku || '',
                                url: `${hostname}/product/${p.slug}`,
                                value: (p.salePrice > 0 ? p.salePrice : p.price) * p.quantity,
                                variant: p.packSize + ''
                            }));
                        } else {
                            // Has bundleItems but no groupRef, so it's a product with variants
                            return {
                                currency: 'AUD',
                                image_url: ci.primaryImageSrc,
                                item_group: null,
                                name: ci.productName,
                                price: ci.salePrice > 0 ? ci.salePrice : ci.price,
                                product_id: ci.productId + '',
                                quantity: ci.quantity,
                                sku: ci.sku || '',
                                url: ci.url || `${hostname}/product/${ci.slug}`,
                                value: (ci.salePrice > 0 ? ci.salePrice : ci.price) * ci.quantity,
                                variant: ci.packSize + '',
                                variants: ci.bundleItems.map(p => ({
                                    group_name: p?.variantGroupName,
                                    product_name: p?.productName,
                                    product_id: p?.productId,
                                    pack_size: p?.packSize,
                                    quantity: p?.quantity,
                                    price: p?.salePrice > 0 ? p?.salePrice : p?.price,
                                }))
                            };
                        }
                    } else {
                        return ({
                            currency: 'AUD',
                            image_url: ci.primaryImageSrc,
                            item_group: null,
                            name: ci.productName,
                            price: ci.salePrice > 0 ? ci.salePrice : ci.price,
                            product_id: ci.productId + '',
                            quantity: ci.quantity,
                            sku: ci.sku || '',
                            url: ci.url || `${hostname}/product/${ci.slug}`,
                            value: (ci.salePrice > 0 ? ci.salePrice : ci.price) * ci.quantity,
                            variant: ci.packSize + ''
                        });
                    }
                }).flat() : null,
            });
  
        }

        ret = Object.assign(ret, this.defaultParameters);

        return ret;
    }

    _deliveryMethodData(data) {
        return {
            delivery_method_id: data.delivery_method_id || null,
            delivery_method: data.delivery_method || null,
            delivery_fee: data.delivery_fee || 0,
            description: data.description || null,
            delivery_type: data.delivery_type || null,
            delivery_display_type: data.delivery_display_type || null,
            delivery_estimate: data.delivery_estimate ?? null,
            delivery_estimate_min: data.delivery_estimate_min ?? null,
            delivery_estimate_max: data.delivery_estimate_max ?? null,
            unavailable_reason: data.unavailable_reason ?? null
        };
    }

    _formatDeliveryMethodAdded(data) {
        return {
            ...this._deliveryMethodData(data)
        };
    }

    _formatDeliveryMethodDenied(data) {
        return {
            ...this._deliveryMethodData(data),
            reason: data.reason || null
        };
    }

    _formatDeliveryMethodClicked(data) {
        return {
            ...this._deliveryMethodData(data)
        };
    }

    _formatDeliveryMethods(data) {
        let ret = {
            ...this._checkoutStepData(data)
        };

        if (data.cart) {
            ret.cart_id = data.cart.id;
        };

        ret.is_skipped = data.isSkipped;
        ret.is_manual_skipped = data.manualSkip;
        ret.skipped_count = data.nextSkipped;
        ret.click_to_reveal = data.click_to_reveal;
        ret.unavailable_reason = data.unavailable_reason ?? null;

        return Object.assign(ret, this.defaultParameters);
    }

    _formatPromo(data) {

        let ret = {};

        if (data.promo) {
            ret = Object.assign(ret, {
                coupon_name: data.promo.code,
                promo_code: data.promo.code
            });
            if (data.promo.error) {
                ret = Object.assign(ret, {
                    reason: data.promo.error
                });
            }
        }

        if (data.cart) {
            ret = Object.assign(ret, {
                cart_id: data.cart.id,
            });
        }

        return ret;
    }

    _formatProduct(data) {

        let ret = {};

        if (data.product) {
            ret = Object.assign(ret, {
                currency: 'AUD',
                name: data.product.name,
                product_id: data.product.id,
                quantity: data.product.quantity,
                variant: data.product.packSize,
                price: data.product.salePrice > 0 ? data.product.salePrice : data.product.price,
                value: (data.product.salePrice > 0 ? data.product.salePrice : data.product.price) * data.product.quantity,
                image_url: data.product.primaryImageSrc,
                url: data.product.url,
                sku: data.product.sku || null,
                status: data.product.status,
                variant_groups: data?.variant_groups ?? null
            });
        }

        return ret;
    }

    _formatProductAdd(data) {

        let ret = {};

        if (data.product) {
            ret = Object.assign(ret, {
                currency: 'AUD',
                name: data.product.name,
                product_id: data.product.id,
            });
        }

        if (data.addToCart) {
            ret = Object.assign(ret, {
                cart_id: data.addToCart.cart_id,
                quantity: data.addToCart.quantity,
                variant: data.addToCart.packSize,
                price: data.addToCart.price
            });
        }

        if (data.promotion_ref) {
            ret = {...ret, promotion_ref: data.promotion_ref};
        }

        if (data?.variants) {
            ret = {
                ...ret,
                variants: data.variants
            };
        }

        return ret;
    }

    _formatProductVariantSelected(data) {
        return {
            name: data?.name ?? null,
            item_name: data?.item_name ?? null,
            item_id: data?.item_id ?? null,
            product_name: data?.product_name ?? null,
            product_id: data?.product_id ?? null,
            type: data?.type ?? null,
            quantity: data?.quantity ?? null,
            price: data.price ?? null
        }
    }

    _formatAddress(data) {

        let ret = {};

        if (data.data) {
            ret = Object.assign(ret, {
                fromGeocodeAddress: !!data.data.fromGeocodeAddress
            });
        }

        if (data.address) {

            ret = Object.assign(ret, {
                street: data.address.addressLine1 + (data.address.addressLine2 ? ' ' + data.address.addressLine2 : ''),
                city: data.address.suburb || data.address.city,
                postalCode: data.address.postcode,
                state: data.address.state,
                country: data.address.country,
                lat: data.address.lat,
                lng: data.address.lng,
                store_id: data.address.storeId ? data.address.storeId : null,
                zone_id: data.address.zoneId ? data.address.zoneId : null
            });
        }

        if (data.source) {
            ret.address_source = data.source;
        }

        if (data.page) {
            ret.address_page = data.page;
        }

        if (data.error) {
            ret.error = data.error
        }

        return ret;

    }

    _formatSupportRequest(data) {
        return {
            from: data.from ?? null,
            order_in_progress: data.orderInProgress ?? null,
            type: 'chat'
        };
    }
};


