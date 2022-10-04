import React from 'react';

import styles from './CigaretteBanner.module.scss';

const CigaretteBanner = () => {
    return (
        <div className={styles.banner}>
            <img src="/static/assets/img/cigarette-warning.png" alt="Quitting will improve your health" />
            <div className={styles.copy}>
                <p>
                    It is illegal to sell tobacco products to a person under 18 and it is 
                    illegal to purchase a tobacco product for use by a person under 18.
                </p>
                <p>Prices include all taxes.</p>
            </div>
        </div>
    );
};

export default CigaretteBanner;