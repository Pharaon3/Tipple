import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NavigationContainer from '../components/Generic/NavigationContainer';
import Page from '../components/Page';
import styles from './IdVerification.module.scss';
import './IdVerification.module.scss';
import VerificationSelect from '../components/user-verification/VerificationSelect';
import PassportVerification from '../components/user-verification/PassportVerification';
import LicenseVerification from '../components/user-verification/LicenseVerification';
import '../components/Generic/NavigationContainer.module.scss';
import axios from 'axios';
import {
  idVerification,
  idVerificationSuccess,
} from 'app/resources/action/IdVerification';

const verificationType = {
  LICENSE: 'LICENCE',
  PASSPORT: 'PASSPORT',
};

const IdVerification = (props) => {
  // Name of the window.
  var windowName = 'Mastercard Interstitial Claims Sharing';
  // height of the window.
  var windowHeight = '650';
  // Width of the window.
  var windowWidth = '900';
  // if scroll bar is allowed.
  var windowScroll = 'yes';

  const [step, setStep] = useState(1);
  const [type, setType] = useState();
  const [country, setCountry] = useState();
  const [licenceFlag, setLicenceFlag] = useState(true);
  const [passportFlag, setPassportFlag] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const idverificationflag = useSelector(
    (state) => state.idverification.idverificationflag
  );
  // dispatch(idVerificationSuccess(1))

  /*
  useEffect(() => {
    const script = document.createElement('script');
    //script.src = 'https://mtf.assets.idservice.com/aus/lib/mids-1.2.0.js';
	script.src = require('./mids-1.2.0.js');
    script.async = true;
    script.id = 'midsLib';
    document.body.appendChild(script);
  });
*/

  const handleLicenseVerification = (formValues) => {
    let licenceData = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      dob: formValues.dateOfBirth.split('/').reverse().join('-'),
      idType: 'LICENCE',
      idNumber: formValues.licenseNumber,
      idState: formValues.state,
      idCountry: 'AUS',
    };

    dispatch(idVerificationSuccess(1));
    dispatch(idVerification(licenceData, auth));
    // axios
    //   .get('https://tipple.xyz/api/user/id-verification/manual' + licenceData)
    //   .then((response) => {
    //     console.log(response.data);
    //   });
  };

  const handlePassportVerification = (formValues) => {
    let passportData = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      dob: formValues.dateOfBirth.split('/').reverse().join('-'),
      idType: 'PASSPORT',
      idNumber: formValues.passportNumber,
      idState: '',
      idCountry: 'AUS',
    };
    dispatch(idVerificationSuccess(1));
    dispatch(idVerification(passportData, auth));
  };

  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

  function getCompleteUrl(domain, path, regions, region) {
    var keys = Array.from(Object.keys(regions));
    var completeUrl;

    if (isBlank(region)) {
      region = 'AU';
    }

    region = region.toUpperCase();

    if (keys.includes(region)) {
      completeUrl = domain.concat(regions[region]).concat(path);
    } else {
      console.log(`Region Not Supported`);
      throw new Error('Region Not Supported');
    }

    return completeUrl;
  }

  const verifyBtnClick = () => {
    var assetsUrl = 'https://mtf.assets.idservice.com/aus';
    var regions = { US: '.com', AU: '.com.au', EU: '.eu' };
    var domain = 'https://sandbox.api.mastercard';
    var path = '/idservice-rp/auth-requests';
    var scopes = 'ageOver(18):0:365';
    var redirectUri = 'https://tipple.xyz/verify/identification';
    var state = null;
    var countryCode = 'AU';
    var flow = 'DWEB2APP';
    var responseType = 'code';
    var clientId = 'zeETEms9EjoHrQv5Yku3uB4aiqxbIURCDrkDtDiCfbb41408';
    var codeChallenge = 'OHTD1YV3g4EnN5e42ZA3i_gu5ccpLw5OwmzSHactZ_U';
    var codeChallenceMethod = 'S256';
    var nonce = 'f90f675c-7b48-491a-8354-4daa6b00c767';
    var rpName = 'Tipple';
    var rpLogoUrl =
      'https://content.tipple.com.au/tipple/logo/tipple_rp_logo.png';
    var locale = 'en-AU';
    var region = 'AU';
    var subRpId = 'ID_OF_SUB_RP_IF_RP_RESELLER';
    var authUrl = getCompleteUrl(domain, path, regions, region);
    var params = `?scopes=${scopes}&redirect_uri=${redirectUri}&state=${state}&`;
    params += `country_code=${countryCode}&flow=${flow}&response_type=${responseType}&client_id=${clientId}&`;
    params += `code_challenge=${codeChallenge}&code_challenge_method=${codeChallenceMethod}&nonce=${nonce}&`;
    params += `rp_name=${rpName}&rp_logo_url=${rpLogoUrl}&locale=${locale}&sub_rp_id=${subRpId}`;
    var authUrlWithParams = authUrl + encodeURI(params);
    openPopupWindow(
      authUrlWithParams,
      windowName,
      windowWidth,
      windowHeight,
      windowScroll
    );
  };

  function openPopupWindow(url, windowName, w, h, scroll) {
    const leftPosition = window.top.outerWidth / 2 + window.top.screenX - w / 2;
    const topPosition = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    var settings = `height=${h},width=${w},top=${topPosition},left=${leftPosition},scrollbars=${scroll},resizable`;
    var popupWindow = window.open(url, windowName, settings);
    popupWindow.focus();
  }

  return (
    <Page>
      <NavigationContainer>
        {step === 1 && (
          <div className={styles.container}>
            <h4>Age Verification is required to continue</h4>
            <p>
              We partner with ID, a secure digital identity service by
              Mastercard. With ID, you're in control of your identity data
            </p>
            <a
              href="https://www.optus.com.au/customer-extras/mastercard-id"
              className={styles.helpText}
              target="_blank"
            >
              Learn more about ID
            </a>
            <div className="jumbotron main">
              {/*
              <div
                id="missds"
                className="mids-dark mids-corner-radius-8px mids-cta-continue en-US"
                callback_function="rpFunction"
                scopes="ageOver(18):0:365"
                redirect_uri="https://tipple.xyz/verify/identification"
                country_code="AU"
                flow="DWEB2APP"
                response_type="code"
                client_id="zeETEms9EjoHrQv5Yku3uB4aiqxbIURCDrkDtDiCfbb41408"
                code_challenge="OHTD1YV3g4EnN5e42ZA3i_gu5ccpLw5OwmzSHactZ_U"
                code_challenge_method="S256"
                nonce="f90f675c-7b48-491a-8354-4daa6b00c767"
                rp_name="Tipple"
                locale="en-AU"
                rp_logo_url="https://content.tipple.com.au/tipple/logo/tipple_rp_logo.png"
                region="AU"
                sub_rp_id="ID_OF_SUB_RP_IF_RP_RESELLER"
              />
			*/}
              <button onClick={verifyBtnClick} className={styles.verifyBtn}>
                <div id="frame" className={styles.btnDiv}>
                  <div id="logoFrame" className={styles.btnDivDiv}>
                    <img
                      id="logo"
                      src="https://mtf.assets.idservice.com/aus/content/assets/img/id-badge.svg"
                      className={styles.btnDivDivImg}
                    />
                  </div>
                  <span id="cta" className={styles.btnDivSpan}>
                    Verify with ID
                  </span>
                </div>
              </button>
            </div>
            <div>
              <hr />
            </div>
            <h6>Don't have ID?</h6>
            <p>
              You can do a one-time verification. You will have the option to
              create a reusable identity after checkout.
            </p>
            {/*<button onClick={() => setStep(2)}>Verify my details</button>*/}
            <button onClick={() => setStep(2)} className={styles.verifyMyIdBtn}>
              <div>
                <span className={styles.VMDspan}>Verify my details</span>
              </div>
            </button>
          </div>
        )}
        {step === 2 && (
          <VerificationSelect
            onContinue={(type, country) => {
              setStep(3);
              setType(type);
              setCountry(country);
            }}
          />
        )}
        {step === 3 && type === verificationType.LICENSE && (
          <LicenseVerification
            displaying={idverificationflag}
            licenceFlag={licenceFlag}
            setLicenceFlag={setLicenceFlag}
            onSubmit={handleLicenseVerification}
          />
        )}
        {step === 3 && type === verificationType.PASSPORT && (
          <PassportVerification
            displaying={idverificationflag}
            passportFlag={passportFlag}
            setPassportFlag={setPassportFlag}
            onSubmit={handlePassportVerification}
          />
        )}
      </NavigationContainer>
    </Page>
  );
};

export default IdVerification;
