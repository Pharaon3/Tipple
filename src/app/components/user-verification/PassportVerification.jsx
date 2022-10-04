import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { withFormik, Field } from 'formik';
import MaskedInput from 'react-text-mask';
import { isOver18 } from 'lib/validation';
import FieldError from 'app/components/user/FieldError';
import VerificationPopup from '../popups/Verification';
import styles from './PassportVerification.module.scss';

// const loadingError = (props) => {
//     if (props.error) {
//         throw new Error('CHUNK FAILED');
//     }
//     return null;
// };

const PassportVerification = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  isRequesting,
  displayErrors = [],
  showAgreeTerms = true,
  showMarketingOptIn = false,
  displaying,
  passportFlag,
  setPassportFlag,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const auth = useSelector((state) => state.auth);
  // values.firstName = auth.currentUser.firstname;
  // values.lastName = auth.currentUser.lastname;

  if (passportFlag) {
    values.firstName = auth.currentUser.firstname;
    values.lastName = auth.currentUser.lastname;
    setPassportFlag(false);
  }
  return (
    <div>
      <h6>Please fill in the following details</h6>
      <p>
        Please enter the details as they appear in your government-issued photo
        ID
      </p>
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
          <label
            data-touched={touched.firstName || values.firstName !== '' ? 1 : 0}
            htmlFor="firstName"
          >
            Given Name<span>*</span>
          </label>
          <p>Include all names as they appear in your passport</p>
          {errors.firstName && touched.firstName && (
            <FieldError error={errors.firstName} />
          )}
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
          <label
            data-touched={touched.lastName || values.lastName !== '' ? 1 : 0}
            htmlFor="lastName"
          >
            Last Name<span>*</span>
          </label>
          {errors.lastName && touched.lastName && (
            <FieldError error={errors.lastName} />
          )}
        </div>

        <div className={styles.field}>
          <Field
            type="tel"
            name="dateOfBirth"
            id="dateOfBirth"
            value={values.dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.dateOfBirth && touched.dateOfBirth
                ? 'text-input error'
                : 'valid text-input'
            }
            component={MaskedInput}
            mask={[
              /[0-9]/,
              /[0-9]/,
              '/',
              /[0-9]/,
              /[0-9]/,
              '/',
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
            ]}
          />
          <label
            data-touched={
              touched.dateOfBirth || values.dateOfBirth !== '' ? 1 : 0
            }
            htmlFor="dateOfBirth"
          >
            Date of Birth(DD/MM/YYYY)<span>*</span>
          </label>
          {errors.dateOfBirth && touched.dateOfBirth && (
            <FieldError error={errors.dateOfBirth} />
          )}
        </div>

        <div className={styles.field}>
          <input
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.passportNumber}
            name="passportNumber"
            id="passportNumber"
          />
          <label
            data-touched={
              touched.passportNumber || values.passportNumber !== '' ? 1 : 0
            }
            htmlFor="passportNumber"
          >
            Passport Number<span>*</span>
          </label>
          {errors.passportNumber && touched.passportNumber && (
            <FieldError error={errors.passportNumber} />
          )}
        </div>
        {(showAgreeTerms || showMarketingOptIn) && (
          <div className={styles.checkboxes}>
            {showAgreeTerms && (
              <div className={styles.field}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  id="agreeTerms"
                  value={values.agreeTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label
                  data-touched={
                    touched.agreeTerms || values.agreeTerms !== '' ? 1 : 0
                  }
                  htmlFor="agreeTerms"
                >
                  I agree to my identifying information being checked with the
                  Issuer or Official Record
                </label>
                {errors.agreeTerms && touched.agreeTerms && (
                  <FieldError
                    className={styles.error}
                    error={errors.agreeTerms}
                  />
                )}
              </div>
            )}
          </div>
        )}
        {displayErrors && (
          <div className={styles.errors}>
            {displayErrors.map((errorMessage) => (
              <FieldError error={errorMessage} />
            ))}
          </div>
        )}
        {displaying === 3 ? (
          <div className={styles.failed}>
            <p>
              <i class="fa fa-exclamation-triangle"></i>Verification failed.
            </p>
            <p>Please retry or contact support.</p>
          </div>
        ) : (
          ''
        )}
        <button
          type="submit"
          disabled={isRequesting}
          className={classNames(
            styles.btnVerify,
            isRequesting && styles.progress
          )}
          onClick={() => setOpenModal(true)}
        >
          Verify
        </button>
      </form>
      {values.firstName &&
      values.lastName &&
      values.dateOfBirth &&
      values.passportNumber &&
      values.agreeTerms &&
      openModal === true &&
      openModal === true &&
      (displaying === 1 || displaying === 2) ? (
        <VerificationPopup displayed={displaying}></VerificationPopup>
      ) : (
        ''
      )}
    </div>
  );
};

const formConfig = {
  mapPropsToValues: ({ showAgreeTerms }) => ({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    passportNumber: '',
    showAgreeTerms,
    agreeTerms: showAgreeTerms ? false : '',
  }),
  validate: (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'First name is required';
    }
    if (!values.lastName) {
      errors.lastName = 'Last name is required';
    }
    if (!values.passportNumber) {
      errors.passportNumber = 'Passport number is required';
    }
    if (!values.dateOfBirth) {
      errors.dateOfBirth = 'Please enter your date of birth.';
    } else if (
      !/^^(?:(?:31-(?:(?:0?[13578])|(1[02]))-(19|20)?\d\d)|(?:(?:29|30)-(?:(?:0?[13-9])|(?:1[0-2]))-(?:19|20)?\d\d)|(?:29-0?2-(?:19|20)(?:(?:[02468][048])|(?:[13579][26])))|(?:(?:(?:0?[1-9])|(?:1\d)|(?:2[0-8]))-(?:(?:0?[1-9])|(?:1[0-2]))-(?:19|20)?\d\d))$/i.test(
        values.dateOfBirth.replace(/\//g, '-')
      )
    ) {
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
  displayName: 'PassportVerification',
};

export default withFormik(formConfig)(PassportVerification);
