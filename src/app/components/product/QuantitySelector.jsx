import React from 'react';
import classNames from 'classnames';

import styles from './QuantitySelector.module.scss';

const QuantitySelector = ({ quantity, onAdd, onSubtract, isAddDisabled }) => {
    return (
        <div>
            {quantity > 0 && 
            <>
                <button 
                    onClick={onSubtract}
                >
                    <i className="material-icons">&#xE15B;</i>
                </button>
                <span className={styles.quantity}>{quantity}</span>
            </>}
            <button 
                onClick={onAdd}
                disabled={isAddDisabled}
                className={classNames(isAddDisabled && styles.disabled)}
            >
                <i className="material-icons">&#xE145;</i>
            </button>
        </div>
    );
};

export default QuantitySelector;