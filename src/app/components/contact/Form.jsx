import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Formik } from 'formik';

import Spinner from 'app/components/Spinner';
import registerSubscriptionRedux from 'app/resources/api/subscription';
import styles from './Form.module.scss';

const subscriptionRedux = registerSubscriptionRedux('SUBSCRIPTION', ['CREATE']);

const validate = (values, props) => {
    let errors = {};

    if (!values.name) {
        errors.name = 'Name is required';
    }

    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,7}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.message) {
        errors.message = 'Message is required';
    }

    return errors;
};

const initialValues = {
    name: '',
    email: '',
    contactNumber: '',
    message: '',
}

class ContactUsForm extends Component {

    state = {
        hasCreated: false
    }

    createSubscription = (values) => {
        this.props.subscriptionActions.create({
            firstName: values.name,
            email: values.email,
            contactNumber: values.contactNumber,
            message: values.message,
            referrer: 'Contact Us Page'
        }, this.props.auth);
    }

    static getDerivedStateFromProps(props, state) {

        if (props.hasCreated === true && state.hasCreated === false) {
            return {
                hasCreated: true
            }
        }

        return {

        }
    }

    render() {

        if (this.state.hasCreated) {
            return <div className={styles.wrap}>
                <div className="form-submitted">
                    <div className="form-content">
                        <h2>Cheers for contacting us.</h2><p>We always love to hear from you.<br />So talk to us any time you like!</p>
                    </div>
                </div>
            </div>;
        }

        return <div className={styles.wrap}>

            <Formik initialValues={initialValues} onSubmit={this.createSubscription} validate={validate}>
                {props => {
                    return (
                        <form className="form-material" onSubmit={props.handleSubmit}>

                            <div className="field">
                                <input
                                    id="name"
                                    type="text"
                                    value={props.values.name}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    className={props.errors.name && props.touched.name ? 'text-input error' : 'text-input'}
                                />
                                <label className={(props.values.name !== initialValues.name ? "touched" : "")} htmlFor="name">First Name</label>
                                {props.errors.name && props.touched.name && <div className="field error-message">{props.errors.name}<div className="fa fa-exclamation-triangle pull-left"></div></div>}

                            </div>
                            <div className="field">
                                <input
                                    id="email"
                                    type="email"
                                    value={props.values.email}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    className={props.errors.email && props.touched.email ? 'text-input error' : 'text-input'}
                                />
                                <label className={(props.values.email !== initialValues.email ? "touched" : "")} htmlFor="email">Email</label>
                                {props.errors.email && props.touched.email && <div className="field error-message">{props.errors.email}<div className="fa fa-exclamation-triangle pull-left"></div></div>}

                            </div>

                            <div className="field">
                                <input
                                    id="contactNumber"
                                    type="tel"
                                    value={props.values.contactNumber}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    className={props.errors.contactNumber && props.touched.contactNumber ? 'text-input error' : 'text-input'}
                                />
                                <label className={(props.values.contactNumber !== initialValues.contactNumber ? "touched" : "")} htmlFor="contactNumber">Contact Number</label>
                                {props.errors.contactNumber && props.touched.contactNumber && <div className="field error-message">{props.errors.contactNumber}<div className="fa fa-exclamation-triangle pull-left"></div></div>}

                            </div>

                            <div className="field">
                                <textarea
                                    value={props.values.message}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    className={props.errors.message && props.touched.message ? 'ng-invalid error' : 'ng-valid'}
                                    name="message" autoComplete="off"></textarea>
                                <label className={(props.values.message !== initialValues.message ? "touched" : "")} htmlFor="message">Message</label>
                                {props.errors.message && props.touched.message && <div className="field error-message">{props.errors.message}<div className="fa fa-exclamation-triangle pull-left"></div></div>}

                            </div>
                            <button className="btn btn-primary btn-lg btn-block mt-15" type="submit" disabled={!props.isValid || this.props.isSubmitting}>Submit</button>
                            {this.props.isSubmitting && <Spinner />}
                        </form>
                    );
                }}
            </Formik>

        </div >
    }

}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    isSubmitting: state.SUBSCRIPTION.isRequestingCreate,
    hasCreated: state.SUBSCRIPTION.hasCreated,
    subscription: state.SUBSCRIPTION
});

const mapDispatchToProps = (dispatch) => ({
    subscriptionActions: bindActionCreators(subscriptionRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsForm);