import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import styles from './StepSelector.module.scss';

const StepSelector = ({
  step = 1,
  onChangeStep,
  cartItemCount = 0,
  isDeliveryAvailable = false,
  isPaymentAvailable = false,
}) => {
  const theme = useSelector((store) => store.theme);
  const assetPath = theme?.name
    ? `/static/assets/theme/${theme.name.toLowerCase()}/img`
    : `/static/assets/img/icons`;

  return (
    <div
      className={classNames(
        styles.wrap,
        step === 2 && styles['step-2'],
        step === 3 && styles['step-3']
      )}
    >
      <div
        className={classNames(
          styles.step,
          step === 1 && styles.active,
          step > 1 && styles.complete
        )}
        onClick={() => onChangeStep(1)}
      >
        <img
          src={`${assetPath}/icon-checkout-cart${
            step === 1 ? '-active' : ''
          }.svg`}
          alt="Cart"
        />
        <span
          className={classNames(
            styles.stepLabel,
            step === 1 && styles.active,
            step > 1 && styles.complete
          )}
        >
          Cart ({cartItemCount})
        </span>
      </div>
      <div
        className={classNames(
          styles.step,
          step === 2 && styles.active,
          step > 2 && styles.complete,
          isDeliveryAvailable && styles.available
        )}
        onClick={() => isDeliveryAvailable && onChangeStep(2)}
      >
        <img
          src={`${assetPath}/icon-checkout-delivery${
            step === 2 ? '-active' : ''
          }.svg`}
          alt="Delivery"
        />
        <span
          className={classNames(
            styles.stepLabel,
            step === 2 && styles.active,
            step > 2 && styles.complete,
            isDeliveryAvailable && styles.available
          )}
        >
          Delivery
        </span>
      </div>
      <div
        className={classNames(
          styles.step,
          step === 3 && styles.active,
          isPaymentAvailable && styles.available
        )}
        onClick={() => isPaymentAvailable && onChangeStep(3)}
      >
        <img
          src={`${assetPath}/icon-checkout-payment${
            step === 3 ? '-active' : ''
          }.svg`}
          alt="Payment"
        />
        <span
          className={classNames(
            styles.stepLabel,
            step === 3 && styles.active,
            isPaymentAvailable && styles.available
          )}
        >
          Payment
        </span>
      </div>
    </div>
  );
};

export default StepSelector;
