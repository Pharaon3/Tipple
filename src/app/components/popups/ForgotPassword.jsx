import React, { Component } from 'react';
import classNames from 'classnames';
import Modal from 'app/components/Modal';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from 'app/components/Spinner';
import { sendForgotPassword, hideForgotPasswordPopup } from 'app/resources/action/ForgotPassword';
import { Formik } from 'formik';

import styles from './ForgotPassword.module.scss';

const validate = (values) => {
    let errors = {};

    if (!values.email) {
        errors.email = 'Email is Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,7}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    return errors;
};

const initialValues = {
    email: ''
}

class ForgotPasswordPopup extends Component {

    componentDidUpdate(prevProps) {
        if (!prevProps.displayForgotPassword && this.props.displayForgotPassword) {
            this.emailInput.focus();
        }
    }

    closeClick = (ev) => {
        ev.preventDefault();
        this.props.hideForgotPasswordPopup();
    }

    handleSubmit = (values, { setSubmitting, setErrors }) => {
        this.props.sendForgotPassword(values.email, this.props.auth)
            .then(resp => {
                if (resp && resp.status === 'INVALID_LOGIN') {
                    setErrors({
                        email: resp.displayMessage
                    })
                } else {

                }

                setSubmitting(false);
            })
    }

    render() {
        return this.props.displayForgotPassword ? <Modal analyticsMessage="Forgot Password" analyticsType="popup" analyticsFrom={window.location.pathname}>
            <div className={styles.overlay}>

                <div onClick={this.closeClick} className="loading-overlay-transparent orange fadein"></div>
                <div className={classNames(styles.content, 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>

                    <div className="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                        <span className="ui-dialog-title">
                            <h1>Forgot Password</h1>
                            <a href="#close" onClick={this.closeClick} role="button" className="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all">
                                <span className="fa fa-fw fa-close"></span>
                            </a>
                        </span>
                    </div>
                    <div className="ui-dialog-content ui-widget-content">
                        <p>No worries, we’ll email you instructions to set a new password after entering in your email below.</p>
                        <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validate={validate}>
                            {props => {
                                return (
                                    <form className="form-material" onSubmit={props.handleSubmit}>

                                        <div className="field">
                                            <input
                                                ref={(input) => { this.emailInput = input; }}
                                                id="email"
                                                type="email"
                                                value={props.values.email}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className={props.errors.email && props.touched.email ? 'text-input error' : 'text-input'}
                                            />
                                            <label className={(props.values.email !== initialValues.email ? styles.touched : '')} htmlFor="email">Email</label>
                                            {this.props.errorMessage && <div className="field error-message">{this.props.errorMessage}<div className="fa fa-exclamation-triangle pull-left"></div></div>}
                                            {this.props.successMessage && <div className="field">{this.props.successMessage}<div className="fa fa-check pull-right"></div></div>}
                                        </div>

                                        <button className="btn btn-primary btn-lg btn-block mt-15" type="submit" disabled={!props.isValid || props.isSubmitting}>Submit</button>
                                        {props.isSubmitting && <Spinner />}
                                    </form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        </Modal> : null
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    displayForgotPassword: state.auth.displayForgotPassword,
    isSendingForgotPassword: state.auth.isSendingForgotPassword,
    successMessage: state.auth.sfpSuccessMessage,
    errorMessage: state.auth.sfpErrorMessage
});

const mapDispatchToProps = (dispatch) => ({
    sendForgotPassword: bindActionCreators(sendForgotPassword, dispatch),
    hideForgotPasswordPopup: bindActionCreators(hideForgotPasswordPopup, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordPopup);
