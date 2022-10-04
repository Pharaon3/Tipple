import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducerRegistry from './lib/reducerRegistry';

import cartReducer from './app/resources/reducers/Cart';
import addressReducer from './app/resources/reducers/Address';
import authReducer from './app/resources/reducers/Auth';
import productReducer from './app/resources/reducers/Product';
import searchParamsReducer from './app/resources/reducers/SearchParams';
import featuresReducer from './app/resources/reducers/Features';
import promoCodeReducer from './app/resources/PromoCode';
import checkEmailReducer from './app/resources/modules/checkEmail';
import tdmRevealReducer from './app/resources/modules/tdmReveal';
import themeReducer from './app/resources/reducers/Theme';
import orderCommentReducer from './app/resources/modules/orderComment';
import idVerificationReducer from './app/resources/reducers/IdVerification';
// import { reducer as formReducer } from 'redux-form';

// A nice helper to tell us if we're on the server
export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

let store = null;
let wasServer = false;

export const wasServerRendered = () => wasServer;

export const getStore = () => store;

const createReduxStore = (url = '/') => {

  const enhancers = [];

  // Dev tools are helpful
  if (process.env.NODE_ENV === 'development' && !isServer) {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  const middleware = [thunk];
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  );

  // Do we have preloaded state available? Great, save it.
  const initialState = isServer || window.__PRELOADED_STATE__ === undefined ? {} : window.__PRELOADED_STATE__;

  // Delete it once we have it stored in a variable
  if (!isServer) {
    if (window.__PRELOADED_STATE__) {
      window.initialRenderDone = true;
      wasServer = true;
    }
    delete window.__PRELOADED_STATE__;
  }

  const combine = (reducers) => {
    const reducerNames = Object.keys(reducers);
    Object.keys(initialState).forEach(item => {
      if (reducerNames.indexOf(item) === -1) {
        reducers[item] = (state = null) => state;
      }
    });
    
    reducers['auth'] = authReducer;
    reducers['address'] = addressReducer;
    reducers['cart'] = cartReducer;
    reducers['product'] = productReducer;
    reducers['searchParams'] = searchParamsReducer;
    reducers['features'] = featuresReducer;
    reducers['promoCode'] = promoCodeReducer;
    reducers['checkEmail'] = checkEmailReducer;
    reducers['tdmReveal'] = tdmRevealReducer;
    reducers['theme'] = themeReducer;
    reducers['orderComment'] = orderCommentReducer;
    reducers['idverification'] = idVerificationReducer;

    return combineReducers(reducers);
  };  

  let appReducer = combine(reducerRegistry.getReducers());

  const rootReducer = (state, action) => {
    // FIXME: Should this be here? Login / Logout / Auth stuff is mixed in several places, revisit.
    // After a user logs out we need to reset the auth so we get a proper token in App.jsx
    if (action.type === 'LOGOUT_USER_SUCCESS') {
      state = {
        auth: {
          userIdentifier: state.auth.userIdentifier,
          deviceIdentifier: state.auth.deviceIdentifier,
          didAttemptTokenVerification: false,   // This needs to reset so App.jsx can detect it needs to verify token again
          currentUser: null,
          token: null
        },
        cart: {
          didAttemptCartVerification: true,
          currentCart: null
        },
        // Make sure we retain theme settings, these aren't (currently) based on logged in status
        theme: {
          ...state.theme
        }
      }
    }
  
    return appReducer(state, action)
  }

  // Create the store
  store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
  );
  
  reducerRegistry.setChangeListener(reducers => {
    appReducer = combine(reducers);
    store.replaceReducer(rootReducer);
  });

  return store;
};

export default createReduxStore;
