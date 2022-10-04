/* eslint-disable */

import Cookies from 'js-cookie';
import * as uuidv4 from 'uuid/v4';
import config from 'app/config';
import { getStore } from '../store';
import { getItem } from './util/localStorage';

export const AnalyticsData = {
  data: { },
  cart: null,
  user: null,
  page: null,
  error: null
};

export const AnalyticsEvents = {
  product_viewed: 'product_viewed',
  product_list_viewed: 'product_list_viewed',
  product_list_filtered: 'product_list_filtered',
  cart_viewed: 'cart_viewed',
  checkout_viewed: 'checkout_viewed',           // app/routes/Checkout.jsx
  search: 'search',
  category_clicked: 'category_clicked',
  collection_interaction: 'collection_interaction',
  home_viewed: 'home_viewed',
  category_viewed: 'category_viewed',

  address_entry_started: 'address_entry_started',
  address_entered: 'address_entered',
  address_entered_valid: 'address_entered_valid',
  address_entered_invalid: 'address_entered_invalid',
  address_entered_cancel: 'address_entered_cancel',

  address_unserviceable_complete: 'address_unserviceable_complete',

  // Checkout flow
  checkout_process_started: 'checkout_process_started',
  checkout_process_completed: 'checkout_process_completed',
  checkout_step_viewed: 'checkout_step_viewed',
  checkout_step_completed: 'checkout_step_completed',
  checkout_nav_item_clicked: 'checkout_nav_item_clicked',
  delivery_method_clicked: 'delivery_method_clicked',
  delivery_method_added: 'delivery_method_added',
  delivery_method_denied: 'delivery_method_denied',

  checkout_failed: 'checkout_failed',           // app/routes/Checkout.jsx
  update_cart: 'update_cart',
  add_to_cart: 'add_to_cart',
  product_variant_selected: 'product_variant_selected',
  remove_from_cart: 'remove_from_cart',
  add_delivery_method: 'add_delivery_method',
  promo_code_added: 'promo_code_added',
  promo_code_success: 'promo_code_success',
  promo_code_failed: 'promo_code_failed',
  promo_code_removed: 'promo_code_removed',
  ecommerce_purchase: 'ecommerce_purchase',       // app/routes/Checkout.jsx
  checkout_new_payment: 'checkout_new_payment',
  account_created: 'account_created',

  delivery_methods_viewed: 'delivery_methods_viewed',
  order_tracking_viewed: 'order_tracking_viewed',

  user_login_success: 'user_login_success',       // app/resources/action/Login.js
  user_login_failed: 'user_login_failed',
  user_logout: 'user_logout',                     // app/resources/action/Logout.js
  user_is_guest: 'user_is_guest',                 // app/App.js
  user_identify: 'user_identify',                 // app/App.js

  app_pageview: 'app_pageview',                   // app/App.js

  popup_sorry: 'popup_sorry',
  sorry_subscribe: 'sorry_subscribe',

  analytics_exception: 'analytics_exception',

  support_request: 'support_request',

  user_alert: 'user_alert',
  user_alert_action: 'user_alert_action'
}

export const MapUrlToPageData = function(url) {
  if(url === undefined || url === null) {
    return {'name': 'Address'};
  }
  if (url === 'custom-category') {
    return {'name': 'Category'};
  }
  if (url === 'custom-product-grid') {
    return {'name': 'Product Grid'};
  }
  if (url === 'custom-user-register') {
    return {'name': 'Register'};
  }
  if (url === 'custom-user-login') {
    return {'name': 'Login'};
  }
  if (url === 'bundle-builder') {
    return {'name': 'Bundle Builder'};
  }
  let urlBits = url.split('/');
  if(urlBits[0] === '') {
    urlBits.shift();
  }
  if(urlBits.length === 0 || urlBits[0] ==='') {
    return {'name': 'Address'};
  }
  const urlData = {'name': 'Not Set'};
  switch(urlBits[0]) {
    case 'bottleshop':
    case 'shop':
      if(urlBits.length === 4 && urlBits[3]=='categories') {
        urlData.name = 'Home';
      } else {
        // This is a category, but if there are no collections, we might need to fire Product Grid instead.
        // Ignore this pageview fire, and it will be done manually by the component loading.
        urlData.name = 'Category';
        urlData.ignorePage = true;
      }
    break;
    case 'new-south-wales':
    case 'victoria':
      if(urlBits.length >= 3 && urlBits[2]=='categories') {
        urlData.name = 'Home';
      } else {
        urlData.name = 'Category';
        urlData.ignorePage = true;
      }
    break;
    case 'beer-delivery':
    case 'wine-delivery':
    case 'liquor-delivery':
      urlData.name = 'Product Landing Page';
    break;
    case 'sydney':
    case 'melbourne':
      urlData.name = 'City Landing Page';
    break;
    case 'suburb':
      urlData.name = 'Categories';
    break;
    case 'cart':
    case 'delivery':
    case 'checkout':
      urlData.name = 'Checkout Process';
    break;
    case 'product':
      urlData.name = 'Product';
    break;
    case 'orders':
      urlData.name = 'Order List';
    break;
    case 'track':
      urlData.name = 'Order Tracking';
    break;
    case 'logout':
      urlData.name = 'Logout';
    break;
    case 'user':
      urlData.name = 'Check Account';
    break;
    case 'content':
      urlData.name = 'Info Details: ';
    break;
    case 'contact-us':
    if(urlBits.length === 2) {
      urlData.name = 'Info Details: '+urlBits[1];
    } else {
      urlData.name = 'Info Details';
    }
    break;
    case 'forgot_password':
      urlData.name = 'Password Forgot';
      if(urlBits.length === 3) {
        urlData.name = 'Password New';
      }
    break;
    case 'notfound':
      urlData.name = '404';
    break;
  }

  return urlData;
}

export class Analytics {

  _analytics  = [];
  /**
   * Creates an instance of Analytics.
  * @param {Segment} segment
   */
  constructor() {
    var Segment = require('./analytics/segment').default;
    const s = new Segment();
    this._analytics.push(s);
  }

  trigger(eventName, data) {

    const session_id = Cookies.get(config.userIdentifierCookie);
    let eventData = Object.assign({}, data);

    let locationData = {
      // Need to explicitly (re)set address, otherwise analytics seems to hold onto old data to send to segment
      // if it is not set below from currentCart?.address
      address: undefined
    };
    const store = getStore();
    const reduxStore = store.getState();

    if (reduxStore?.cart?.currentCart?.address) {
      locationData.address = { ...reduxStore.cart.currentCart.address };
      locationData.storeId = locationData.address.storeId;
      locationData.zoneId = locationData.address.zoneId;
    }

    // Shared data to track the users' cart
    const cartData = {};

    if (reduxStore?.cart?.currentCart) {
      cartData.checkout_id = reduxStore?.cart?.currentCart?.cartGuid;
    }
    const siteId = getItem('tipple_site_id') || config.siteId;

    const analyticsData = {
      session_id,
      session: session_id,
      web_message_id: uuidv4(),
      site_id: siteId,
      siteId,
      ...locationData,
      ...cartData
    };
    
    // We need to trigger this to all the different analytics components
    // but before we push the data, the data needs to sorted for that specific analytics platform
    try { // never crash because of analytics
      this._analytics.map(e => e.trigger(eventName, eventData, analyticsData));
      return true;
    } catch (e ) {


      try { // maybe segment still works - send a message in a bottle
        this._analytics.map(a => a.trigger(AnalyticsEvents.analytics_exception, { error: e }));
      }  catch (e2) {
        // but seriously, dont crash because of analytics
      }

      if (global.newrelic) {
        global.newrelic.noticeError(e);
      }

    }
    return false;
  }
  
}

export function enableAnalytics(config) {
  const segmentConfig = Object.assign({},config);
  const data = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
  analytics.load("${segmentConfig.segmentKey}");
  }}();`;
  
  //return data;
  window.eval(data);
}

