import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { withFormik, Field } from 'formik';
import MaskedInput from 'react-text-mask';
import { isOver18 } from 'lib/validation';
import FieldError from 'app/components/user/FieldError';
import styles from './LicenseVerification.module.scss';
import VerificationPopup from '../popups/Verification';

// const loadingError = (props) => {
//     if (props.error) {
//         throw new Error('CHUNK FAILED');
//     }
//     return null;
// };

const states = [
  {
    value: 0,
    label: '',
  },
  {
    value: 1,
    label: 'ACT',
  },
  {
    value: 2,
    label: 'NSW',
  },
  {
    value: 3,
    label: 'NT',
  },
  {
    value: 4,
    label: 'QLD',
  },
  {
    value: 5,
    label: 'SA',
  },
  {
    value: 6,
    label: 'TAS',
  },
  {
    value: 7,
    label: 'VIC',
  },
  {
    value: 8,
    label: 'WA',
  },
];

const LicenseVerification = ({
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
  licenceFlag,
  setLicenceFlag,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const auth = useSelector((state) => state.auth);
  // values.firstName = auth.currentUser.firstname;
  // values.lastName = auth.currentUser.lastname;

  if (licenceFlag) {
    values.firstName = auth.currentUser.firstname;
    values.lastName = auth.currentUser.lastname;
    setLicenceFlag(false);
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
            First Name<span>*</span>
          </label>
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
            value={values.licenseNumber}
            name="licenseNumber"
            id="licenseNumber"
          />
          <label
            data-touched={
              touched.licenseNumber || values.licenseNumber !== '' ? 1 : 0
            }
            htmlFor="licenseNumber"
          >
            License Number<span>*</span>
          </label>
          {errors.licenseNumber && touched.licenseNumber && (
            <FieldError error={errors.licenseNumber} />
          )}
        </div>
        <div className={styles.field}>
          <select
            className={styles.stateselect}
            name="state"
            id="state"
            value={values.state}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            {states.map((state) => (
              <option key={state.value} id={state.label}>
                {state.label}
              </option>
            ))}
          </select>
          <label
            data-touched={touched.state || values.state !== '' ? 1 : 0}
            className={styles.statelabel}
            htmlFor="state"
          >
            State<span>*</span>
          </label>
          {errors.state && touched.state && <FieldError error={errors.state} />}
        </div>
        {(showAgreeTerms || showMarketingOptIn) && (
          <div className={styles.checkboxes}>
            {showAgreeTerms && (
              <div className={styles.field}>
                <Field
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
      values.licenseNumber &&
      values.state &&
      values.agreeTerms &&
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
    licenseNumber: '',
    state: '',
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
    if (!values.licenseNumber) {
      errors.licenseNumber = 'License number is required';
    }
    if (!values.state) {
      errors.state = 'State is required';
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
  displayName: 'LicenseVerification',
};

export default withFormik(formConfig)(LicenseVerification);
