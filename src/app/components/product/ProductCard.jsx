import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import formatCurrency from 'lib/currency';
import { imageUrl } from 'lib/util/image';
import {  getProductPricing } from 'lib/util/product';

import styles from './ProductCard.module.scss';

// TODO: Rename hasCart, this is really just whether to display price or not. Shouldn't be tied to cart.
export const ProductCard = ({ product, hasCart = false, className = null, linkToPackSize = null }) => {
    const { price, salePrice, onSale } = getProductPricing(product);

    const outOfStock = product?.defaultPack?.status === 'INACTIVE';
    const defaultPack = product?.defaultPack;

    const packSizeLink = linkToPackSize ? `?packSize=${linkToPackSize}` : defaultPack ? `?packSize=${defaultPack?.packSize}` : '';
    const displayPackSize = linkToPackSize ? linkToPackSize : defaultPack?.packSize;

    return (
        <div className={classNames(styles.card, hasCart && outOfStock && styles['out-of-stock'], className)}>
            <Link to={`/product/${product.slug}${packSizeLink}`}>
                <div className={styles.image}>
                    <img src={imageUrl(product?.primaryImageSrc, 'products/')} className="product" alt={product.name} onError={(e) => {
                        if (e.target.src !== '/static/assets/img/products/default-product.png') {
                            e.target.src = '/static/assets/img/products/default-product.png'
                        }
                    }} />
                </div>
                <div className={classNames(styles.details, styles.special)}>
                    <p className={styles['block-with-textd']}>{product.name}{displayPackSize && displayPackSize > 1 ? ` ${displayPackSize}pk` : ''}</p>
                    <div className={styles.price}>
                        {hasCart && outOfStock && <strong>Out of Stock</strong>}
                        {hasCart && !outOfStock && !onSale && <strong>{formatCurrency('$', price, 0, 2)}</strong>}
                        {hasCart && !outOfStock && onSale && <strong className={styles.strikethrough}>{formatCurrency('$', price, 0, 2)}</strong>}
                        {hasCart && !outOfStock && onSale && <strong className={styles.sale}>{formatCurrency('$', salePrice, 0, 2)}</strong>}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export const ProductCardLoader = () => 
    <div className={styles.loader}>
        <div className={classNames(styles.skeleton, styles.image)}></div>
        <div className={classNames(styles.skeleton, styles.text)}></div>
        <div className={classNames(styles.skeleton, styles.price)}></div>
    </div>
;

export default ProductCard;