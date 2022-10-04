import React from 'react';
import classNames from 'classnames';
import { withFormik } from 'formik';
import FieldError from 'app/components/user/FieldError';

import styles from './LoginForm.module.scss';

const LoginForm = ({
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isRequesting,
    displayErrors = [],
    onClickForgotPassword
}) => {
    return (
        <form onSubmit={handleSubmit}>
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
            </div>
            {displayErrors && <div className={styles.errors}>
                {displayErrors.map((errorMessage, i) => 
                    <FieldError error={errorMessage} key={i} />
                )}
            </div>}
            <button type="submit" disabled={isRequesting} className={classNames(styles.submit, isRequesting && styles.progress)}>
                Let's Go!
            </button>
            <div className={styles.forgot}>
                <a href="#forgot-password" onClick={onClickForgotPassword} className="cursor-pointer">Forgot Password?</a>
            </div>
        </form>
    );
};

const formConfig = {
    mapPropsToValues: () => ({ 
        password: '' 
    }),
    validate: values => {
        const errors = {};
    
        if (!values.password) {
          errors.password = 'Required';
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
    displayName: 'LoginForm'
};

export default withFormik(formConfig)(LoginForm);