import React from 'react';
import { Link } from 'react-router-dom';
import { PUBLIC_ICON_FOLDER } from 'lib/constants/app';

import styles from './LinkCart.module.scss';

const LinkCart = ({
  assetPath = PUBLIC_ICON_FOLDER,
  cartItemCount = 0,
  className,
}) => {
  return (
    <div className={className}>
      <Link className={styles.link} to="/cart">
        <img
          alt="View Cart"
          src={`${assetPath}icon-cart.svg`}
          className={styles.icon}
        />
        {cartItemCount > 0 && (
          <span className={styles['cart-count']}>{cartItemCount}</span>
        )}
      </Link>
    </div>
  );
};

export default LinkCart;
