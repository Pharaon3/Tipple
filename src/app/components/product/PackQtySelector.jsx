import React, { useState } from 'react';

import Dropdown from 'app/components/Dropdown';

import { getDescriptiveProductPackName } from 'app/resources/cart';
import { PRODUCT_DEFAULT_QTY } from 'lib/constants/app';

import styles from './PackQtySelector.module.scss';

const PackQtySelector = ({ onPackSelected, product = {}, packSize, onChangeQuantity = () => {} }) => {
    const [quantity, setQuantity] = useState(PRODUCT_DEFAULT_QTY);

    const selectPack = size => onPackSelected(size);

    const incrementQuantity = () => {
        if (quantity < 99) {
            setQuantity(quantity + 1);
            onChangeQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            onChangeQuantity(quantity - 1);
        }
    };

    const packOptions = product.pricePacks.map(opt => ({
        value: opt?.packSize,
        label: getDescriptiveProductPackName(opt?.packSize)
    }));

    return (
        <div className={styles.add}>
            <div className="row">
                <div className="col-xs-6 clearfix">
                    <div className="brand-text-black text-left"><small>Pack Size</small></div>
                    {packOptions.length > 1 && <Dropdown maxOffset={3} className="pack-size tipple-select" onClick={selectPack} options={packOptions} value={packSize} />}
                    {packOptions.length === 1 && <div className="single-pack-size">{packOptions[0].label}</div>}
                </div>
                <div className="col-xs-6 clearfix">
                    <div className="brand-text-black text-left"><small>Quantity</small></div>
                    <div className="input-group">
                        <span className="input-group-btn">
                            <button type="button" className={"btn btn-default btn-number btn-pack left px-0"} disabled={(quantity <= 1 ? "disabled" : "")} onClick={decrementQuantity}>
                                <i className="material-icons">&#xE15B;</i>
                            </button>
                        </span>
                        <span className="form-control input-number input-pack noselect">{quantity}</span>
                        <span className="input-group-btn">
                            <button type="button" className={"btn btn-default btn-number btn-pack right px-0"} disabled={(quantity >= 99 ? " disabled": "")} onClick={incrementQuantity}>
                                <i className="material-icons">&#xE145;</i>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackQtySelector;