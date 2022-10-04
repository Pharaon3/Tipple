import React from 'react';
import classNames from 'classnames';

import styles from './RadioButton.module.scss';

const RadioButton = ({ name, onChange, checked = false, label }) => {
    return (
        <label className={classNames(styles.radio)}>
            <span className={styles.input}>
                <input 
                    type="radio" 
                    name={name}
                    onChange={onChange}
                    checked={checked}
                />
                <span className={styles.control}></span>
            </span>
            {label && <span className={styles.label}>{label}</span>}
        </label>
    );
};

export default RadioButton;