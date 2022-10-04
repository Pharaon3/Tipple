import React from 'react';
import classNames from 'classnames';

import styles from './LabelValue.module.scss';

const LabelValue = ({ label = '', value = '', className = '' }) => {
    return (
        <div className={classNames(styles.label, className)}>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
};

export default LabelValue;