import React, { Component } from 'react';
import Page from 'app/components/Page';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import { loginUserViaReset } from 'app/resources/action/Login';

import Spinner from 'app/components/Spinner';

import styles from './ConfirmPassword.module.scss';


const validate = (values, props) => {
    let errors = {};

    if (!values.password) {
        errors.password = 'Password is required';
    }

    return errors;
};

const initialValues = {
    password: ''
}


class ConfirmPasswordPage extends Component {

    constructor() {
        super();

        this.state = {

        }
    }

    handleSubmit = (values, { setSubmitting, setErrors }) => {

        this.props.loginUserViaReset(this.props.match.params.email, values.password, this.props.match.params.code, this.props.auth, this.props.history)
            .then(resp => {
                if (resp && (resp.status === 'INVALID_LOGIN' || resp.status === 'VALIDATION' || resp.status === 'VERIFICATION')) {
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

    render() {
        return <Page id="confirm-password" description="....">
            <div className={classNames(styles.wrap, 'content-wrapper')}>
                <div className="container">
                    <div className="row">
                        <div className="content-container col-xs-12 col-sm-12 col-md-12">
                            <div className="row">
                                <div className="content mb-24 px-24 col-xs-12">
                                    <div className="row">
                                        <div className=" col-xs-12 col-sm-12 col-md-8">
                                            <h1>Change Password</h1>


                                            <Formik initialValues={initialValues} onSubmit={this.handleSubmit} validate={validate}>
                                                {props => {
                                                    return (
                                                        <form className="form-material" onSubmit={props.handleSubmit}>
                                                            <div className="field">
                                                                <input
                                                                    id="password"
                                                                    type="password"
                                                                    value={props.values.password}
                                                                    onChange={props.handleChange}
                                                                    onBlur={props.handleBlur}
                                                                    className={props.errors.password && props.touched.password ? 'text-input error' : 'text-input'}
                                                                />
                                                                <label className={(props.values.password !== initialValues.password ? "touched" : "")} htmlFor="password">Password</label>
                                                                {props.errors.password && props.touched.password && props.values.password !== initialValues.password && <div className="field error-message">{props.errors.password}<div className="fa fa-exclamation-triangle pull-left"/></div>}

                                                            </div>

                                                            <button className="btn btn-primary btn-lg btn-block mt-15" type="submit" disabled={!props.isValid || props.isSubmitting}>Confirm</button>
                                                            {props.isSubmitting && <Spinner />}
                                                        </form>
                                                    );
                                                }}
                                            </Formik>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
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
    loginUserViaReset: bindActionCreators(loginUserViaReset, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfirmPasswordPage);
