import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FieldError from 'app/components/user/FieldError';
import Page from 'app/components/Page';
import EmailForm from 'app/components/user/EmailForm';
import LoginForm from 'app/components/user/LoginForm';
import RegisterForm from 'app/components/user/RegisterForm';
import { checkEmail, resetCheckEmail } from 'app/resources/modules/checkEmail';
import { loginUserViaEmail } from 'app/resources/action/Login';
import registerRedux from 'app/resources/api/user';
import { displayForgotPasswordPopup } from 'app/resources/action/ForgotPassword';
import { AnalyticsEvents } from '../../lib/analytics';

import { getUrlParam } from 'lib/searchParams';

import styles from './User.module.scss';

const register = registerRedux('REGISTER', ['CREATE']);

const LOGIN_ERROR_STATUSES = ['INVALID_LOGIN', 'USER_STATUS_BANNED'];

const User = ({ location }) => {
    const [loginErrors, setLoginErrors] = useState(null);
    const [redirect] = useState(getUrlParam(location.search, 'redirect'));
    const [registrationComplete, setRegistrationComplete] = useState(null);

    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector(state => state.auth);
    const theme = useSelector(state => state.theme);
    const currentUser = useSelector(state => state?.auth?.currentUser ?? null);
    const emailExists = useSelector(state => state?.checkEmail?.emailExists);
    const checkedEmail = useSelector(state => state?.checkEmail?.emailChecked);
    const hasRequested = useSelector(state => state?.checkEmail?.hasRequested);
    const hasError = useSelector(state => state?.checkEmail?.hasError);
    const isRequesting = useSelector(state => state?.checkEmail?.isRequesting);
    const isRequestingLogin = useSelector(state => state?.auth?.isAuthenticating ?? false);
    const hasRequestedLogin = useSelector(state => state?.auth?.didAttemptAuthentication ?? false);
    const isVerifyingToken = useSelector(state => state?.auth?.isVerifyingToken ?? false);
    const isRequestingRegister = useSelector(state => state?.REGISTER?.isRequestingCreate ?? false);
    const registerErrors = useSelector(state => (state?.REGISTER?.errors ?? []).map(error => error?.displayMessage));
    const themeLogin = useSelector(state => state.theme?.login);
    const hasRegistered = useSelector(state => state.REGISTER?.hasCreated && state.REGISTER?.item ? true : false);
    const currentCart = useSelector(state => state.cart?.currentCart);
    const didAttemptCart = useSelector(state => state.cart?.didAttemptCartVerification ?? false);

    const showNoUser = !currentUser && (!hasRequested || hasError);
    const showLogin = !currentUser && emailExists && hasRequested;
    const showRegister = !currentUser && !emailExists && !hasError && hasRequested;

    const handleCheckEmail = (formValues) => {
        dispatch(checkEmail(formValues?.email, auth));
    };

    const handleLogin = (formValues) => {
        dispatch(loginUserViaEmail(checkedEmail, formValues.password, auth))
            .then(resp => {
                if (resp && LOGIN_ERROR_STATUSES.includes(resp.status)) {
                    setLoginErrors([resp.loginDisplayMessage]);
                } else {
                    setLoginErrors(null);

                    if (typeof window !== 'undefined') {
                        window.tippleAnalytics.trigger(AnalyticsEvents.user_login_success, {});
                    }
                }
            });
    };

    const handleBackClick = () => {
        if (showNoUser) {
            history.goBack();
        }

        if (showLogin || showRegister) {
            dispatch(resetCheckEmail());
            dispatch(resetCheckEmail());

            if (typeof window !== 'undefined') {
                global.tippleAnalytics.trigger(AnalyticsEvents.app_pageview, { 'page': { 'path': '/user', }, 'data': { 'appUrl': history?.location?.pathname } });
            }
        }
    };

    const handleRegister = (formValues) => {
        let registerData = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            mobile: formValues.mobile.replace(/\s+/g, ''),
            email: formValues.email,
            dob: formValues.dateOfBirth.split('/').reverse().join('-'),
            password: formValues.password,
            agreeTerms: formValues.agreeTerms,
            marketingOptIn: formValues.marketingOptIn
        };

        dispatch(register.actionCreators.create(registerData, auth));
    };

    const handleForgotPassword = e => {
        e.preventDefault();
        dispatch(displayForgotPasswordPopup());
    };

    useEffect(() => {
        if (hasRegistered) {
            setRegistrationComplete(true);
        }
    }, [hasRegistered]);

    // Reset form errors if we've checked a new email address.
    useEffect(() => {
        if (hasRequested && emailExists) {
            setLoginErrors(null);
        }
    }, [hasRequested, emailExists]);

    // Check if we've completed a registration, and if so, fire the segment events and redirect.
    // currentCart might be empty, as this can 404 on an incognito window. Therefore we'll check didAttemptCart
    useEffect(() => {
        if (registrationComplete && didAttemptCart) {
            const accountData = {
                cart: currentCart,
                address: currentCart?.address
            };

            if (typeof window !== 'undefined') {
                window.tippleAnalytics.trigger(AnalyticsEvents.account_created, accountData);
                window.tippleAnalytics.trigger(AnalyticsEvents.user_login_success, {});
            }

            setTimeout(() => {
                history.push(redirect);
            }, 500);
        }
    }, [registrationComplete, currentCart, didAttemptCart, history, redirect]);

    // Once we've verified the token - which happens after auth, whether login or register - wait
    // until we have loaded the currentUser before redirecting  the user back to where they came from.
    useEffect(() => {
        if (!isVerifyingToken && currentUser && hasRequestedLogin) {
            history.push(redirect);
        }
    }, [isVerifyingToken, currentUser, hasRequestedLogin]);

    useEffect(() => {
        if (showRegister && typeof window !== 'undefined') {
            global.tippleAnalytics.trigger(AnalyticsEvents.app_pageview, { 'page': { 'path': 'custom-user-register', }, 'data': { 'appUrl': history?.location?.pathname } });
        }

        if (showLogin && typeof window !== 'undefined') {
            global.tippleAnalytics.trigger(AnalyticsEvents.app_pageview, { 'page': { 'path': 'custom-user-login', }, 'data': { 'appUrl': history?.location?.pathname } });
        }
    }, [showRegister, showLogin, history]);

    // Clear the email check when we navigate away, otherwise it will show the password screen next time they visit.
    useEffect(() => {
        return () => {
            dispatch(resetCheckEmail());
        }
    }, []);

    return (
        <Page id="user" description="....">
            <div className={styles.container}>
                <div className={styles.content}>
                    <button className={styles.back} onClick={handleBackClick}>
                        <i className="fa fa-chevron-left"></i>
                    </button>
                    {showLogin &&
                        <>
                        <h2 className={styles.title}>{themeLogin?.passwordTitle}</h2>
                        <p className={styles.subtitle}>{themeLogin?.passwordBody}</p>
                            <p className={styles.email}>{checkedEmail}</p>

                            <div className={styles.form}>
                                <LoginForm 
                                    onSubmit={handleLogin} 
                                    displayErrors={loginErrors} 
                                    onClickForgotPassword={handleForgotPassword}
                                    isRequesting={isRequestingLogin || isVerifyingToken}
                                />
                            </div>
                        </>
                    }
                    {showRegister && 
                        <>
                            <h2 className={styles.title}>{themeLogin?.newEmailTitle}</h2>
                            <p className={styles.subtitle}>{themeLogin?.newEmailBody}</p>

                            <div className={styles.form}>
                                <RegisterForm 
                                    onSubmit={handleRegister}
                                    checkedEmail={checkedEmail}
                                    displayErrors={registerErrors}
                                    showAgreeTerms={theme?.showAgreeTerms ?? false}
                                    showMarketingOptIn={theme?.showMarketingOptIn ?? false}
                                    isRequesting={isRequestingRegister || hasRegistered || registrationComplete}
                                />
                            </div>
                        </>
                    }
                    {showNoUser && 
                        <>
                            <h2 className={styles.title}>{themeLogin?.emailTitle}</h2>
                            <p className={styles.subtitle}>{themeLogin?.emailBody}</p>

                            <div className={styles.form}>
                                <EmailForm onSubmit={handleCheckEmail} isRequesting={isRequesting} />
                            </div>
                            {hasError && <FieldError error="Something went wrong. Please try again." />}
                        </>
                    }
                </div>
            </div>
        </Page>
    );
};

export default User;