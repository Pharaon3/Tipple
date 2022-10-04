import { createReducer } from 'lib/createReducer';
import { 
  THEME_FAILURE,
  THEME_REQUEST,
  THEME_SUCCESS,
  THEME_INITIALIZED
} from '../constants/Theme';
import { getDomainConfig } from 'lib/util/theme';
import themeConfig from 'app/themeConfig';

const domainConfig = getDomainConfig(themeConfig);

const initialState = {
  name: '',
  homeComponent: '',
  footerComponent: '',
  cssURL: '',
  faviconURL: '',
  headerLogoURL: '',
  isRequesting: false,
  hasError: false,
  error: '',
  initialized: false,
  defaultStoreId: domainConfig ? domainConfig.defaultStoreId : '',
  storePath: '',
  referrals: false,
  metaTitle: '',
  metaDescription: '',
  disclaimers: {
    product: '',
    cart: '',
    checkout: ''
  },
  login: {
    emailTitle: 'Good times ahead! 🕺',
    emailBody: 'Have we met before? Enter your email to get the party started!',
    passwordTitle: 'Hey! I thought that was you 👋',
    passwordBody: 'But just to make sure, enter your password to log in.',
    newEmailTitle: 'Tell me about yourself!',
    newEmailBody: null
  }
};

export default createReducer(initialState, {
  [THEME_REQUEST]: (state, data) => {
    return {...state, isRequesting: true};
  },
  [THEME_SUCCESS]: (state, data) => {
    return {
      ...state,
      ...data.payload,
      defaultStoreId: data.payload?.defaultStoreId ?? state.defaultStoreId,
      isRequesting: false
    };
  },
  [THEME_FAILURE]: (state, data) => {
    return {
      ...state, 
      isRequesting: false,
      hasError: true,
      error: data.payload.error
    };
  },
  [THEME_INITIALIZED]: (state, data) => {
    return {...state, initialized: true};
  }
})

