import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { withFormik, Field } from 'formik';
import MaskedInput from 'react-text-mask';
import { emailRegex, australianMobileRegex, mobileNumberMask, passwordRegex } from 'lib/constants/regex';
import { isOver18 } from 'lib/validation';
import FieldError from 'app/components/user/FieldError';
import Loadable from 'react-loadable';
import DefaultTerms from 'app/components/user/templates/DefaultTerms';
import DefaultMarketing from 'app/components/user/templates/DefaultMarketing';

import styles from './RegisterForm.module.scss';

const loadingError = (props) => {
    if (props.error) {
        throw new Error('CHUNK FAILED');
    }
    return null;
};

const templates = {
    defaultTerms: DefaultTerms,
    defaultMarketing: DefaultMarketing,
    '7ElevenTerms': Loadable({
        loader: () => import(/* webpackChunkName: "7ElevenTermsCheckbox" */ 'app/components/user/templates/7ElevenTerms'),
        loading: loadingError,
        modules: ['7ElevenTermsCheckbox'],
        webpack: () => [require.resolveWeak('app/components/user/templates/7ElevenTerms')] // Prevents white flash
    }),
    '7ElevenMarketing': Loadable({
        loader: () => import(/* webpackChunkName: "7ElevenTermsCheckbox" */ 'app/components/user/templates/7ElevenTerms'),
        loading: loadingError,
        modules: ['7ElevenTermsCheckbox'],
        webpack: () => [require.resolveWeak('app/components/user/templates/7ElevenTerms')] // Prevents white flash
    })
};

const RegisterForm = ({
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isRequesting,
    displayErrors = [],
    showAgreeTerms = false,
    showMarketingOptIn = false
}) => {
    const theme = useSelector(store => store.theme);
    const termsComponentName = `${theme?.homeComponent}Terms` ?? 'default';
    const marketingComponentName = `${theme?.homeComponent}Marketing` ?? 'default';
    const TermsCheckboxContent = templates[termsComponentName] ?? templates['defaultTerms'];
    const MarketingCheckboxContent = templates[marketingComponentName] ?? templates['defaultMarketing'];

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.field}>
                <input
                    type="firstName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstName}
                    name="firstName"
                    id="firstName"
                />
                <label data-touched={(touched.firstName || values.firstName !== '') ? 1 : 0} htmlFor="firstName">First Name</label>
                {errors.firstName && touched.firstName && <FieldError error={errors.firstName} />}
            </div>
            <div className={styles.field}>
                <input
                    type="lastName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName}
                    name="lastName"
                    id="lastName"
                />
                <label data-touched={(touched.lastName || values.lastName !== '') ? 1 : 0} htmlFor="lastName">Last Name</label>
                {errors.lastName && touched.lastName && <FieldError error={errors.lastName} />}
            </div>
            <div className={styles.field}>
                <input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    name="email"
                    id="email"
                />
                <label data-touched={(touched.email || values.email !== '') ? 1 : 0} htmlFor="email">Email</label>
                {errors.email && touched.email && <FieldError error={errors.email} />}
            </div>
            <div className={styles.field}>
                <input
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    name="password"
                    id="password"
                />
                <label data-touched={(touched.password || values.password !== '') ? 1 : 0} htmlFor="password">Password</label>
                {errors.password && touched.password && <FieldError error={errors.password} />}
                <p className={styles.hint}>Password must contain a minimum of 8 characters, including an uppercase letter and a number.</p>
            </div>
            <div className={styles.field}>
                <Field
                    type="tel"
                    name="mobile"
                    id="mobile"
                    autoComplete="tel"
                    value={values.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.mobile && touched.mobile ? 'text-input error' : 'valid text-input'}
                    component={MaskedInput}
                    mask={mobileNumberMask}
                />
                <label data-touched={(touched.mobile || values.mobile !== '')? 1 : 0} htmlFor="mobile">Mobile</label>
                {errors.mobile && touched.mobile && <FieldError error={errors.mobile} />}
            </div>
            <div className={styles.field}>
                <Field
                    type="tel"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={values.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.dateOfBirth && touched.dateOfBirth ? 'text-input error' : 'valid text-input'}
                    component={MaskedInput}
                    mask={[/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                />
                <label data-touched={(touched.dateOfBirth || values.dateOfBirth !== '') ? 1 : 0} htmlFor="dateOfBirth">Date of Birth</label>
                {errors.dateOfBirth && touched.dateOfBirth && <FieldError error={errors.dateOfBirth} />}
                <p className={styles.hint}>DD/MM/YYYY</p>
            </div>
            {(showAgreeTerms || showMarketingOptIn) && <div className={styles.checkboxes}>
                {showAgreeTerms && <div className={styles.field}>
                    <Field
                        type="checkbox"
                        name="agreeTerms"
                        id="agreeTerms"
                        value={values.agreeTerms}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <label data-touched={(touched.agreeTerms || values.agreeTerms !== '') ? 1 : 0} htmlFor="agreeTerms"><TermsCheckboxContent /></label>
                    {errors.agreeTerms && touched.agreeTerms && <FieldError className={styles.error} error={errors.agreeTerms} />}
                </div>}
                {showMarketingOptIn && <div className={styles.field}>
                    <Field
                        type="checkbox"
                        name="marketingOptIn"
                        id="marketingOptIn"
                        value={values.marketingOptIn}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <label data-touched={(touched.marketingOptIn || values.marketingOptIn !== '') ? 1 : 0} htmlFor="marketingOptIn"><MarketingCheckboxContent /></label>
                    {errors.marketingOptIn && touched.marketingOptIn && <FieldError error={errors.marketingOptIn} />}
                </div>}
            </div>}
            {displayErrors && <div className={styles.errors}>
                {displayErrors.map(errorMessage => 
                    <FieldError error={errorMessage} />
                )}
            </div>}
            <button type="submit" disabled={isRequesting} className={classNames(styles.submit, isRequesting && styles.progress)}>
                Create Account
            </button>
        </form>
    );
};

const formConfig = {
    mapPropsToValues: ({ checkedEmail, showAgreeTerms, showMarketingOptIn }) => ({ 
        firstName: '',
        lastName: '',
        email: checkedEmail || '',
        mobile: '',
        password: '',
        dateOfBirth: '',
        showAgreeTerms,
        agreeTerms: showAgreeTerms ? false : null,
        marketingOptIn: showMarketingOptIn ? false : null
    }),
    validate: (values) => {
        const errors = {};
    
        if (!values.firstName) {
            errors.firstName = 'First name is required';
        }
        if (!values.lastName) {
            errors.lastName = 'Last name is required';
        }

        if (!values.email) {
            errors.email = 'Please enter your email address';
        } else if (!emailRegex.test(values.email)) {
            errors.email = 'Invalid email address';
        }

        if (!values.password) {
            errors.password = 'Please create a new password';
        } else if (!passwordRegex.test(values.password)) {
            errors.password = 'Password must contain 1 upper case, and 1 number, and be at least 8 characters';
        }

        if (!values.mobile) {
            errors.mobile = 'Mobile is required';
        } else if (!australianMobileRegex.test(values.mobile.replace(/\s/gi, ''))) {
            errors.mobile = 'Australian mobile number required';
        }

        if (!values.dateOfBirth) {
            errors.dateOfBirth = 'Please enter your date of birth.';
        } else if (!/^^(?:(?:31-(?:(?:0?[13578])|(1[02]))-(19|20)?\d\d)|(?:(?:29|30)-(?:(?:0?[13-9])|(?:1[0-2]))-(?:19|20)?\d\d)|(?:29-0?2-(?:19|20)(?:(?:[02468][048])|(?:[13579][26])))|(?:(?:(?:0?[1-9])|(?:1\d)|(?:2[0-8]))-(?:(?:0?[1-9])|(?:1[0-2]))-(?:19|20)?\d\d))$/i.test(values.dateOfBirth.replace(/\//g, '-'))) {
            errors.dateOfBirth = 'Invalid date of birth';
        } else if (!isOver18(values.dateOfBirth.split('/').reverse().join('-'))) {
            errors.dateOfBirth = 'Need to be older than 18';
        }

        if (values?.showAgreeTerms && !values.agreeTerms) {
            errors.agreeTerms = 'You must agree to the terms and conditions';
        }
    
        return errors;
    },
    handleSubmit: (values, { setSubmitting, props }) => {
        if (props.onSubmit) {
            props.onSubmit(values);
        }

        setTimeout(() => {
            setSubmitting(false);
        }, 400);
    },
    displayName: 'RegisterForm'
};

export default withFormik(formConfig)(RegisterForm);