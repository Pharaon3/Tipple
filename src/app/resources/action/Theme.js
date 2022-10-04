import axios from 'axios';
import config from 'app/config';

import {
  THEME_FAILURE,
  THEME_REQUEST,
  THEME_SUCCESS,
  THEME_INITIALIZED
} from '../constants/Theme';
import { setItem } from 'lib/util/localStorage';
import { decodeSearchParams } from 'lib/searchParams';
import { getHostname } from 'app/utils/getHostname';

export function loadTheme(fallbackHostname) {
  return function (dispatch) {

    let hostname = getHostname(fallbackHostname);

    try {

      dispatch({
        type: THEME_REQUEST
      });

      const { s: storeSlug }  = decodeSearchParams(window?.location.search);
      const timestamp = new Date().getTime();
      return (storeSlug ? (
        axios.get(`${config.baseURI}/store/slug/${storeSlug}`)
          .then((resp) => {
            return resp?.data?.data ?? null;
          }).catch(() => {
            return null;
          })
      ) : Promise.resolve(null))
        .then((storeId) => {
          return axios.get(`${config.baseURI}/site/config/${hostname}?${timestamp}`)
            .then((resp) => {
              if (resp.status === 200) {
                if (resp.error === undefined && resp.data.storeId !== -1) {

                  setItem('tipple_site_id', resp.data.siteId);

                  // request for additional theme contents
                  return axios.get(`${config.baseURI}/site/config/${hostname}/content?${timestamp}`)
                  .then(content => {

                    dispatch({
                      type: THEME_SUCCESS,
                      payload: {
                        ...resp.data.theme,
                        defaultStoreId: storeId ?? resp.data.defaultStoreId,
                        storePath: resp.data.storePath,
                        referrals: resp.data?.referrals === true,
                        metaTitle: resp.data?.metaTitle ?? '',
                        metaDescription: resp.data?.metaDescription ?? '',
                        showAgreeTerms: resp.data?.showAgreeTerms ?? false,
                        showMarketingOptIn: resp.data?.showMarketingOptIn ?? false,
                        useLandbot: resp.data?.useLandbot ?? false,
                        landbotSupportV3: resp.data?.landbotSupportV3 ?? null,
                        landbotOrderV3: resp.data?.landbotOrderV3 ?? null,
                        siteName: resp.data?.siteName ?? '',
                        disclaimers: {
                          product: content?.data?.disclaimerProduct || '',
                          cart: content?.data?.disclaimerCart || '',
                          checkout: content?.data?.disclaimerCheckout || ''
                        },
                        login: {
                          emailTitle: content?.data?.loginEmailTitle || 'Good times ahead! 🕺',
                          emailBody: content?.data?.loginEmailBody || 'Have we met before? Enter your email to get the party started!',
                          passwordTitle: content?.data?.loginPasswordTitle || 'Hey! I thought that was you 👋',
                          passwordBody: content?.data?.loginPasswordBody || 'But just to make sure, enter your password to log in.',
                          newEmailTitle: content?.data?.loginNewEmailTitle || 'Tell me about yourself!',
                          newEmailBody: content?.data?.loginNewEmailBody || null
                        }
                      }
                    });
                    
                  });

                }
              } else {
                dispatch({
                  type: THEME_FAILURE,
                  payload: {
                    error: resp.error
                  }
                });
              }
            }).catch(error => {
              dispatch({
                type: THEME_FAILURE,
                payload: {
                  error
                }
              });
            });
        });

    } catch(error) {
      
    }
  }
}

export function setThemeInitialised() {
  return function (dispatch) {
    dispatch({
      type: THEME_INITIALIZED
    });
  }
}