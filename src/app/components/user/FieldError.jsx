import React from 'react';
import classNames from 'classnames';

import styles from './FieldError.module.scss';

const FieldError = ({ error, className }) => {
    return (
        <div className={classNames(styles.error, className)}>
            <div className={styles.message}>{error}</div>
            <div className={classNames(styles.icon, 'fa fa-exclamation-triangle pull-left')} />
        </div>
    );
};

export default FieldError;