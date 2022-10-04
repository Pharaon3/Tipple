import React from 'react';

import styles from './CartErrors.module.scss';

const CartErrors = ({ errors = [] }) => {
    if (!errors || errors?.length === 0) {
        return null;
    }

    return (
        <div className={styles.errors}>
            {errors.map(error => <div className={styles.error}>
                    <i className="fa fa-exclamation-triangle pull-left" />
                    {error}
                </div>
            )}
        </div>
    );
};

export default CartErrors;