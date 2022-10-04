import React from 'react';

import styles from './ContentFooter.module.scss';

const ContentFooter = () => {
    return (
        <section className={styles.footer}>
            <div className={styles.tip}>
                <img src="/static/assets/img/icons/icon-scooter.svg" alt="Alcohol Delivered For Just $7.95" />
                <span>Alcohol Delivered For Just $7.95</span>
            </div>
            <div className={styles.tip}>
                <img src="/static/assets/img/icons/icon-beer.svg" alt="Over 500+ Products" />
                <span>Over 500+ Products</span>
            </div>
        </section>
    );
};

export default ContentFooter;