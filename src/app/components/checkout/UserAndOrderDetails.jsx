import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import config from 'app/config';
import classNames from 'classnames';
import { isOver18 } from 'lib/validation';

import { SITE_ID_BUSINESS } from 'lib/constants/app';

import { displayLoginPopup } from 'app/resources/action/Login';

import { Formik, Field } from 'formik';
import MaskedInput from 'react-text-mask';
import _debounce from 'lib/debounce';
import { getItem } from 'lib/util/localStorage';

import styles from './UserAndOrderDetails.module.scss';

const siteId = getItem('tipple_site_id') || config.siteId;
const isTippleBusiness = siteId === SITE_ID_BUSINESS;

const maxGiftMessageLength = 120;

const australianMobileMaskRegex = /^(\+|6)+/i;
const australianMobileRegex = /^(\+6)*[0-9]{10,12}$/i;
const emailRegex = /.+@.+\..+/i;

// Generate a mobile number input mask based on whether the user is entering one in international format or not.
const mobileNumberMask = rawValue => {
    if (rawValue.search(australianMobileMaskRegex) !== -1) {
        return ['+', /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/];
    } else {
        return ['0', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/];
    }
};

const validate = (values, props) => {
    let errors = {};

    if (!props.auth.token) {

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
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(values.password)) {
            errors.password = 'Password must contain 1 upper case, and 1 number, and be at least 8 characters';
        }

        if (!values.mobile) {
            errors.mobile = 'Mobile is required';
        } else if (!australianMobileRegex.test(values.mobile.replace(/\s/gi, ''))) {
            errors.mobile = 'Australian mobile number required';
        }

        if (!values.dob) {
            errors.dob = 'Please enter your date of birth.';
        } else if (!/^^(?:(?:31-(?:(?:0?[13578])|(1[02]))-(19|20)?\d\d)|(?:(?:29|30)-(?:(?:0?[13-9])|(?:1[0-2]))-(?:19|20)?\d\d)|(?:29-0?2-(?:19|20)(?:(?:[02468][048])|(?:[13579][26])))|(?:(?:(?:0?[1-9])|(?:1\d)|(?:2[0-8]))-(?:(?:0?[1-9])|(?:1[0-2]))-(?:19|20)?\d\d))$/i.test(values.dob.replace(/\//g, '-'))) {
            errors.dob = 'Invalid date of birth';
        } else if (!isOver18(values.dob.split('/').reverse().join('-'))) {
            errors.dob = 'Need to be older than 18';
        }
    }

    if (isTippleBusiness) {
        if (!values.businessName) {
            errors.businessName = 'Business Name is required';
        }

        if (values.showAccountsEmail) {
            if (!values.invoiceForwardingEmail) {
                errors.invoiceForwardingEmail = 'Please enter your accounts email address';
            } else if (!emailRegex.test(values.invoiceForwardingEmail)) {
                errors.invoiceForwardingEmail = 'Invalid accounts email address';
            }
        }
    }

    if (values.gift) {

        if (!values.giftRecipient) {
            errors.giftRecipient = 'Recipient\'s Name required';
        }

        if (!values.giftRecipientNumber) {
            errors.giftRecipientNumber = 'Recipient\'s Mobile required';
        } else if (!australianMobileRegex.test(values.giftRecipientNumber.replace(/\s/gi, ''))) {
            errors.giftRecipientNumber = 'Australian mobile number required';
        }

        if (values.giftMessage.length > maxGiftMessageLength) {
            errors.giftMessage = 'Gift message length is too long';
        }
    }

    return errors;
};

const initialValues = {
    isExistingAccount: false,
    gift: false,
    showComment: false,
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    dob: '',
    giftRecipient: '',
    giftRecipientNumber: '',
    giftMessage: '',
    businessName: '',
    invoiceForwardingEmail: ''
};

class ErrorFocus extends React.Component {
    componentDidUpdate(prevProps) {
        const { isSubmitting, isValidating, errors } = this.props.formik;

        const keys = Object.keys(errors);
        if (keys.length > 0 && isSubmitting && !isValidating) {
            const selector = `[id="${keys[0]}"]`;
            const errorElement = document.querySelector(selector);
            if (errorElement) {
                errorElement.focus();
            }
        }
    }

    render() {
        return null;
    }
}

let orderDetailsStorage = {

}

class SideEffect extends Component {

    onChange = _debounce(this.props.onChange, 200);

    saveForm = _debounce((data) => {
        orderDetailsStorage = data;
    }, this.props.debounce);

    componentDidMount(prevProps) {
        const { formik } = this.props;
        this.onChange({
            values: formik.values,
            errors: formik.errors,
            isValid: formik.isValid,
            isSubmitting: formik.isSubmitting,
            isValidating: formik.isValidating
        });

        if (orderDetailsStorage && orderDetailsStorage.formikv && orderDetailsStorage.cartId === this.props.cart.id) {
            this.props.formik.setFormikState({
                values: orderDetailsStorage.formikv
            })
        }
    }

    componentDidUpdate(prevProps) {
        const { formik } = this.props;

        this.saveForm({
            formikv: formik.values,
            cartId: this.props.cart.id
        });

        this.onChange({
            values: formik.values,
            errors: formik.errors,
            isValid: formik.isValid,
            isSubmitting: formik.isSubmitting,
            isValidating: formik.isValidating
        });
    }

    render() {
        return null;
    }
}

export class UserAndOrderDetails extends Component {

    gmTextAreaAdjust = () => {
        this.giftMessage.style.height = 'auto';
        this.giftMessage.style.height = this.giftMessage.scrollHeight + 'px';
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
    }

    componentDidMount() {
        this.formikRef.validateForm();
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.auth.currentUser && this.props.auth.currentUser) {
            this.formikRef.validateForm();
        }
    }

    render() {
        if (!this.props.cart) {
            return <div />
        }

        const mobileExists = false;
        const emailExists = false;

        return <div className={styles.wrap}>
            <Formik
                ref={(formikRef) => {
                    this.formikRef = formikRef;
                    this.props.setFormRef(formikRef);
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 400);
                    resetForm(initialValues);
                }}
                initialValues={initialValues} validate={(values) => {
                    return validate(values, this.props);
                }}>
                {props => {
                    return (
                        <form className="form-material" onSubmit={(this.handleSubmit)}>
                            <SideEffect cart={this.props.cart} formik={props} onChange={({ values, errors }) => {
                                this.props.onUpdateUserData && this.props.onUpdateUserData(Object.keys(errors).length === 0, values);
                            }} />
                            <ErrorFocus formik={props} />
                            {!this.props.user && [<div key="user-details" className="row">
                                <div className="col-xs-12">
                                    <div className="row mb-30">
                                        <div className="col-xs-12">
                                            <div className="row section section-user-details ">
                                                <div className="col-xs-12">
                                                    <div className="row">
                                                        <div className="col-xs-12 title">User Details</div>
                                                    </div>
                                                </div>
                                                <div className="col-xs-12">
                                                    <div className="field">
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            id="firstName"
                                                            autocomplete="given-name"
                                                            value={props.values.firstName}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            className={props.errors.firstName && props.touched.firstName ? 'text-input error' : 'text-input'}
                                                        />
                                                        <label htmlFor="firstName" className={(props.values.firstName !== initialValues.firstName ? "touched" : "")}>First Name<span>*</span></label>

                                                        {props.errors.firstName && props.touched.firstName && <div className="field error-message">{props.errors.firstName}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                    </div>

                                                    <div className="field">
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            id="lastName"
                                                            autocomplete="family-name"
                                                            value={props.values.lastName}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            className={props.errors.lastName && props.touched.lastName ? 'text-input error' : 'text-input'} />
                                                        <label htmlFor="lastName" className={(props.values.lastName !== initialValues.lastName ? "touched" : "")}>Last Name<span>*</span></label>

                                                        {props.errors.lastName && props.touched.lastName && <div className="field error-message">{props.errors.lastName}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                    </div>
                                                </div>

                                                <div className="col-xs-12">
                                                    <div className="field">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            id="email"
                                                            autocomplete="email"
                                                            value={props.values.email}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            className={props.errors.email && props.touched.email ? 'text-input error' : 'text-input'} />
                                                        <label htmlFor="email" className={(props.values.email !== initialValues.email ? "touched" : "")}>Email<span>*</span></label>

                                                        {props.errors.email && props.touched.email && <div className="field error-message">{props.errors.email}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                    </div>

                                                    <div className="field">

                                                        <Field
                                                            type="tel"
                                                            name="mobile"
                                                            id="mobile"
                                                            autocomplete="tel"
                                                            value={props.values.mobile}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            className={props.errors.mobile && props.touched.mobile ? 'text-input error' : 'valid text-input'}
                                                            component={MaskedInput} mask={mobileNumberMask} />

                                                        <label htmlFor="mobile" className={(props.values.mobile !== initialValues.mobile ? "touched" : "")}>Mobile Number<span>*</span></label>

                                                        {props.errors.mobile && props.touched.mobile && <div className="field error-message">{props.errors.mobile}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                    </div>
                                                </div>
                                                <div className="col-xs-12">
                                                    <div className="field">
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            id="password"
                                                            autocomplete="off"
                                                            value={props.values.password}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            className={props.errors.password && props.touched.password ? 'text-input error' : 'text-input'} />
                                                        <label htmlFor="password" className={(props.values.password !== initialValues.password ? "touched" : "")}>Password<span>*</span></label>
                                                        <p className="instruction-text">Password must contain a minimum of 8 characters, including an uppercase letter and a number.</p>

                                                        {props.errors.password && props.touched.password && <div className="field error-message">{props.errors.password}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                    </div>
                                                </div>
                                                <div className="col-xs-12">
                                                    <div className="field mb-20">

                                                        <Field
                                                            type="tel"
                                                            name="dob"
                                                            id="dob"
                                                            value={props.values.dob}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            className={props.errors.dob && props.touched.dob ? 'text-input error' : 'valid text-input'}
                                                            component={MaskedInput} mask={[/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]} />

                                                        <label htmlFor="dob" className={(props.values.dob !== initialValues.dob ? "touched" : "")}>Date of Birth (DD/MM/YYYY)<span>*</span></label>
                                                        {props.errors.dob && props.touched.dob && <div className="field error-message">{props.errors.dob}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                    </div>
                                                </div>

                                                {(mobileExists || emailExists) && <div className="field error-message">
                                                    Looks like your {mobileExists ? "mobile number" : "email"} is already associated with a Tipple account. <b><a href="/" className="cursor-pointer" onClick={this.props.handleLogin}>Log in here</a></b>
                                                    <div className="fa fa-exclamation-triangle pull-left"/>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>, <br key="ud-br" />]}
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="row section">
                                        <div className="col-xs-12">
                                            <div className="row">
                                                <div className="col-xs-12 title">Order Details</div>
                                            </div>
                                        </div>
                                        {isTippleBusiness &&
                                            <div className="col-xs-12">
                                                <div className="field field--business-last">
                                                    <input
                                                        type="text"
                                                        name="businessName"
                                                        id="businessName"
                                                        maxLength="255"
                                                        value={props.values.businessName}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        className={props.errors.businessName && props.touched.businessName ? 'text-input error' : 'text-input'} />
                                                    <label htmlFor="businessName" className={(props.values.businessName !== initialValues.businessName ? "touched" : "")}>Business Name<span>*</span></label>

                                                    {props.errors.businessName && props.touched.businessName && <div className="field error-message">{props.errors.businessName}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                </div>
                                            </div>
                                        }
                                        {isTippleBusiness &&
                                            <div className={classNames('col-xs-12', props.values.showAccountsEmail ? '' : 'border-bottom-primary')}>
                                                <div className="form-material mt-5 ml-1">
                                                    <input type="checkbox" id="showAccountsEmail" name="showAccountsEmail"
                                                        checked={props.values.showAccountsEmail}
                                                        value={props.values.showAccountsEmail}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                    />
                                                    <label htmlFor="showAccountsEmail">Forward Invoice to Accounts</label>

                                                    {props.values.showAccountsEmail && <div className="col-xs-12">
                                                        <div className="pt-0">
                                                            <div className="field field--inset">
                                                            <input
                                                                type="text"
                                                                name="invoiceForwardingEmail"
                                                                id="invoiceForwardingEmail"
                                                                value={props.values.invoiceForwardingEmail}
                                                                onChange={props.handleChange}
                                                                onBlur={props.handleBlur}
                                                                className={props.errors.invoiceForwardingEmail && props.touched.invoiceForwardingEmail ? 'text-input error' : 'text-input'} />
                                                                <label htmlFor="invoiceForwardingEmail" className={(props.values.invoiceForwardingEmail !== initialValues.invoiceForwardingEmail ? "touched" : "")}>Accounts Email<span>*</span></label>

                                                                {props.errors.invoiceForwardingEmail && props.touched.invoiceForwardingEmail && <div className="field error-message">{props.errors.invoiceForwardingEmail}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                            </div>
                                                        </div>
                                                    </div>}
                                                </div>
                                            </div>
                                        }
                                        <div className="col-xs-12">
                                            <div className="form-material mt-5 ml-1">
                                                <input type="checkbox" id="gift" name="gift"
                                                    value={props.values.gift}
                                                    checked={props.values.gift}
                                                    onChange={props.handleChange}
                                                    onBlur={props.handleBlur}
                                                />
                                                <label htmlFor="gift">Send order as gift</label>
                                                {props.values.gift && <div className="section-gift-details col-xs-12">
                                                    <div className="field">
                                                        <input
                                                            type="text"
                                                            name="giftRecipient"
                                                            id="giftRecipient"
                                                            value={props.values.giftRecipient}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            className={props.errors.giftRecipient && props.touched.giftRecipient ? 'mb-5 text-input error' : 'mb-5 text-input'}
                                                        />
                                                        <label htmlFor="giftRecipient" className={(props.values.giftRecipient !== initialValues.giftRecipient ? "touched" : "")}>Recipient's Name<span>*</span></label>
                                                        {props.errors.giftRecipient && props.touched.giftRecipient && <div className="field error-message">{props.errors.giftRecipient}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                    </div>
                                                    <div className="field">


                                                        <Field
                                                            type="tel"
                                                            name="giftRecipientNumber"
                                                            id="giftRecipientNumber"
                                                            value={props.values.giftRecipientNumber}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            className={props.errors.giftRecipientNumber && props.touched.giftRecipientNumber ? 'text-input error' : 'valid text-input'}
                                                            component={MaskedInput} mask={mobileNumberMask} />

                                                        <label htmlFor="giftRecipientNumber" className={(props.values.giftRecipientNumber !== initialValues.giftRecipientNumber ? "touched" : "")}>Recipient’s Mobile Number<span>*</span></label>
                                                        {props.errors.giftRecipientNumber && props.touched.giftRecipientNumber && <div className="field error-message">{props.errors.giftRecipientNumber}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                    </div>
                                                    <div className="field">
                                                        <textarea
                                                            rows="1"
                                                            name="giftMessage"
                                                            id="giftMessage"
                                                            value={props.values.giftMessage}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            ref={ref => this.giftMessage = ref}
                                                            onKeyUp={this.gmTextAreaAdjust}
                                                            style={{ overflow: "hidden" }}
                                                            maxLength="maxCount"
                                                            className={props.errors.giftMessage && props.touched.giftMessage ? 'ng-invalid error' : 'ng-valid'}
                                                        />
                                                        <label htmlFor="giftMessage" className={(props.values.giftMessage !== initialValues.giftMessage ? "touched" : "")}>Gift Message<span/></label>
                                                        <div className="pull-right counter pb-15">
                                                            { props.values.giftMessage?.length ?? 0}/{maxGiftMessageLength}
                                                        </div>
                                                        {props.errors.giftMessage && props.touched.giftMessage && <div className="field error-message">{props.errors.giftMessage}<div className="fa fa-exclamation-triangle pull-left"/></div>}
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                    </div >
                                </div >
                            </div >
                        </form>
                    )
                }}
            </Formik>
        </div >
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    user: state.auth.currentUser,
    cart: state.cart.currentCart,
    searchParams: state.searchParams,
    content: state.CONTENT
});

const mapDispatchToProps = (dispatch) => ({
    displayLoginPopup: bindActionCreators(displayLoginPopup, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAndOrderDetails);