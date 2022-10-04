import React from 'react';
import classNames from 'classnames';

import styles from './ActionBar.module.scss';

const ActionBar = ({ children, className }) => {
    return (
        <div className={classNames(styles.wrap, className)}>
            {children}
        </div>
    );
};

export default ActionBar;