import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import formatCurrency from 'lib/currency';

import { Link } from 'react-router-dom';

import styles from './AddToCartButtons.module.scss';

const AddToCartButtons = ({ product = {}, outOfStock = false, isDisabled = false, onAddToCart, addTotal, variantGroupsValid = true }) => {
    const currentCart = useSelector(state => state.cart?.currentCart);
    let buttonText = `Add to Cart${addTotal ? ` (${formatCurrency('$', addTotal ?? 0, 0, 2)})` : ''}`;

    if (product?.variants?.length > 0 && !variantGroupsValid) {
        buttonText = 'Select Options';
    }

    return (
        <div className={styles.add}>
            <div className="row">
                <div className="col-xs-12 pt-8">
                    {currentCart ? <button onClick={onAddToCart} className={classNames('btn btn-primary btn-block add', outOfStock && 'out-of-stock')} disabled={(isDisabled || outOfStock) ?? false}>{outOfStock ? 'Out of Stock' : buttonText}</button> : <Link to={`/product/${product.slug}`}><button className="btn btn-primary btn-block">View</button></Link>}
                </div>
            </div>
        </div>
    );
};

export default AddToCartButtons;