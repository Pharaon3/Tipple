import React, { Component } from 'react';
import classNames from 'classnames';
import Modal from 'app/components/Modal';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from 'app/components/Spinner';
import { hideLoginPopup, loginUserViaEmail } from 'app/resources/action/Login';
import { displayForgotPasswordPopup } from 'app/resources/action/ForgotPassword';
import { Formik } from 'formik';

import styles from './Login.module.scss';

const validate = (values, props) => {
    let errors = {};

    if (!values.username) {
        errors.username = 'Email is Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,7}$/i.test(values.username)) {
        errors.username = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Password is required';
    }

    return errors;
};

const initialValues = {
    username: '',
    password: ''
}

class LoginPopup extends Component {

    componentDidUpdate(prevProps) {
        if (!prevProps.displayLogin && this.props.displayLogin) {
            this.emailInput.focus();
        }
    }

    closeClick = (ev) => {
        ev.preventDefault();

        this.props.hideLoginPopup();
    }

    handleSubmit = (values, { setSubmitting, setErrors }) => {
        this.props.loginUserViaEmail(values.username, values.password, this.props.auth)
            .then(resp => {
                if (resp && resp.status === 'INVALID_LOGIN') {
                    setErrors({
                        password: resp.loginDisplayMessage
                    })
                } else {
                    this.setState({
                        isVisible: false
                    })
                }

                setSubmitting(false);
            });
    }

    toggleForgotPassword = (ev) => {
        ev.preventDefault();

        this.props.hideLoginPopup();
        this.props.displayForgotPasswordPopup();
    }

    render() {

        return this.props.displayLogin ? <Modal analyticsMessage="Log In" analyticsType="popup" analyticsFrom={window.location.pathname}>
            <div className={styles.overlay} id="loginModal">

                <div onClick={this.closeClick} className="loading-overlay-transparent orange fadein"></div>
                <div className={classNames(styles.content, 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>

                    <div className="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                        <span className="ui-dialog-title">
                            <h1>Log In</h1>
                            <a href="#close" onClick={this.closeClick} role="button" className="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all">
                                <span className="fa fa-fw fa-close"></span>
                            </a>
                        </span>
                    </div>
                    <div className="ui-dialog-content ui-widget-content">
                        <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validate={validate}>
                            {props => {
                                return (
                                    <form className="form-material" onSubmit={props.handleSubmit}>

                                        <div className="field">
                                            <input
                                                ref={(input) => { this.emailInput = input; }}
                                                id="username"
                                                type="username"
                                                value={props.values.username}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className={props.errors.username && props.touched.username ? 'text-input error' : 'text-input'}
                                            />
                                            <label className={(props.values.username !== initialValues.username ? styles.touched : '')} htmlFor="username">Email</label>
                                            {props.errors.username && props.touched.username && props.values.username !== initialValues.username && <div className="field error-message">{props.errors.username}<div className="fa fa-exclamation-triangle pull-left"></div></div>}
                                        </div>

                                        <div className="field">
                                            <input
                                                id="password"
                                                type="password"
                                                value={props.values.password}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className={props.errors.password && props.touched.password ? 'text-input error' : 'text-input'}
                                            />
                                            <label className={(props.values.password !== initialValues.password ? styles.touched : '')} htmlFor="password">Password</label>
                                            {props.errors.password && props.touched.password && props.values.password !== initialValues.password && <div className="field error-message">{props.errors.password}<div className="fa fa-exclamation-triangle pull-left"></div></div>}
                                        </div>

                                        <button className="btn btn-primary btn-lg btn-block mt-15" id="loginSubmitBtn" type="submit" disabled={!props.isValid || props.isSubmitting}>Log In</button>
                                        {props.isSubmitting && <Spinner />}
                                    </form>
                                );
                            }}
                        </Formik>

                        <div className="row">
                            <div className="col-xs-12 text-center mt-24 mb-12">
                                <a href="#forgot-password" onClick={this.toggleForgotPassword} className="cursor-pointer">Forgot Password?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Modal> : null

    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    isAuthenticating: state.auth.isAuthenticating,
    loginDisplayMessage: state.auth.loginDisplayMessage,
    displayLogin: state.auth.displayLogin
});

const mapDispatchToProps = (dispatch) => ({
    displayForgotPasswordPopup: bindActionCreators(displayForgotPasswordPopup, dispatch),
    hideLoginPopup: bindActionCreators(hideLoginPopup, dispatch),
    loginUserViaEmail: bindActionCreators(loginUserViaEmail, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPopup);
