import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Formik, Field } from 'formik';
import MaskedInput from 'react-text-mask';

import config from 'app/config';

import { isOver18 } from 'lib/validation';

import styles from './AgeVerification.module.scss';

const validate = (values, props) => {
    let errors = {};

    if (!values.dob) {
        errors.dob = 'Please enter your date of birth.';
    } else if (!/^^(?:(?:31-(?:(?:0?[13578])|(1[02]))-(19|20)?\d\d)|(?:(?:29|30)-(?:(?:0?[13-9])|(?:1[0-2]))-(?:19|20)?\d\d)|(?:29-0?2-(?:19|20)(?:(?:[02468][048])|(?:[13579][26])))|(?:(?:(?:0?[1-9])|(?:1\d)|(?:2[0-8]))-(?:(?:0?[1-9])|(?:1[0-2]))-(?:19|20)?\d\d))$/i.test(values.dob.replace(/\//g, '-'))) {
        errors.dob = 'Invalid date of birth';
    } else if (!isOver18(values.dob.split('/').reverse().join('-'))) {
        errors.dob = 'Need to be older than 18';
    }

    return errors;
};

const initialValues = {
    dob: ''
};

class AgeVerification extends Component {

    handleSubmit = (values) => {
        Cookies.set(config.ageVerificationCookie, 'verified', {
            path: '/',
            expires: null,  // Expire at end of browser session
            secure: config && config.insecureCookies === true ? false : true
        });

        this.props.onSetOver18(true);
    };

    render() {
        return (
            <div className={styles.wrap}>
                <div className={styles.gate}>
                    <h3>Woah, Hold Up!</h3>
                    <p>Enter your Date of Birth <br />or <a href="/login" onClick={(e) => { e.preventDefault(); this.props.onClickLogin(); }}>Log In</a> to your account to view <br />Cigarettes.</p>
                    <Formik
                        onSubmit={this.handleSubmit}
                        initialValues={initialValues}
                        validate={validate}>
                        {props => {
                            return (
                                <form className="form-material" onSubmit={props.handleSubmit}>
                                    <div className="field">
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
                                        {props.errors.dob && props.touched.dob && <div className="field error-message">{props.errors.dob}<div className="fa fa-exclamation-triangle pull-left"></div></div>}
                                    </div>
                                    <div className={styles.submit}>
                                        <button disabled={props.values.dob === null || !props.isValid || props.isSubmitting} className="btn btn-primary btn-lg btn-block" id="checkoutBtn" type="submit">Submit</button>
                                    </div>
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        );
    }
}

export default AgeVerification;