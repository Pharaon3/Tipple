import React from 'react';

import styles from './Spinner.module.scss';

export default () => (
    <div className={styles.spinner}>
        <div className="loader">
            <svg className="circular" viewBox="25 25 50 50">
                <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="1" strokeMiterlimit="10"/>
            </svg>
        </div>
    </div>
);