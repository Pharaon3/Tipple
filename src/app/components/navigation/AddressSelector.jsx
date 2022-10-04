import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { displayAddressSelect } from 'app/resources/action/Address';

import styles from './AddressSelector.module.scss';

const AddressSelector = ({ showMobile }) => {
    const dispatch = useDispatch();
    const cartAddress = useSelector(state => state?.cart?.currentCart?.address ?? null);
    const addressText = cartAddress ? `${cartAddress.addressLine1 ?? ''}${cartAddress.addressLine2 ? `, ${cartAddress.addressLine2 ?? ''}` : ''}, ${cartAddress.city ?? ''}` : 'Enter your delivery address';

    const handleClick = () => {
        dispatch(displayAddressSelect());
    };

    return (
        <div className={classNames(styles.wrap, showMobile && styles.mobile)} onClick={handleClick}>
            <strong className={styles.title}>Delivering to:</strong>
            <p className={styles.address}>
                {addressText}
                <i className="fa fa-chevron-down"></i>
            </p>
        </div>
    );
};

export default AddressSelector;