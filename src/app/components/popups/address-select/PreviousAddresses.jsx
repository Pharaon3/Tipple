import React from 'react';

import styles from './PreviousAddresses.module.scss';

const PreviousAddresses = ({ recentAddresses = [], assetPath, onSelectAddress }) => {
    return (
        <div className={styles.addresses}>
            <strong>Select Previous Addresses</strong>
            {recentAddresses.map(address => 
                <div className={styles.address} onClick={() => onSelectAddress(address)} key={address.id}>
                    <img src={`${assetPath}/icon-home.svg`} alt="Address" />
                    <span>{address.addressLine1}, {address.city}, {address.state}, {address.postcode}</span>
                </div>
            )}
        </div>
    );
};

export default PreviousAddresses;