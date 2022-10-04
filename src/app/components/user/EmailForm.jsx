import React from 'react';
import classNames from 'classnames';
import { withFormik } from 'formik';
import { emailRegex } from 'lib/constants/regex';
import FieldError from 'app/components/user/FieldError';

import styles from './EmailForm.module.scss';

const EmailForm = ({
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isRequesting
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.field}>
                <input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    name="email"
                    id="email"
                />
                <label data-touched={touched.email ? 1 : 0} htmlFor="email">Email Address</label>
                {errors.email && touched.email && <FieldError error={errors.email} />}
            </div>
            <button type="submit" disabled={isRequesting} className={classNames(styles.submit, isRequesting && styles.progress)}>
                Let's Go!
            </button>
        </form>
    );
};

const formConfig = {
    // default values
    mapPropsToValues: () => ({ 
        email: '' 
    }),
    validate: values => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Please enter your email address';
        } else if (!emailRegex.test(values.email)) {
            errors.email = 'Invalid email address';
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
    displayName: 'EmailForm'
};

export default withFormik(formConfig)(EmailForm);