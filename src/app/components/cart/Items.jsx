import React from 'react';
import CartItem from './Item';

import styles from './Items.module.scss';

const CartItems = ({ items }) => {
  return (
    <div className={styles.items}>
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CartItems;
