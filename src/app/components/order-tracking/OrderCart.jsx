import React from 'react';
import classNames from 'classnames';
import formatCurrency from 'lib/currency';

import styles from './OrderCart.module.scss';

const OndemandOrderHeader = ({order, children}) => {
    return (
        <div className={styles.info}>
            <strong>Order No {order?.orderNumber}</strong>
            <span>{order?.address?.formattedAddress}</span>
            {children}
        </div>);
}

const PickupOrderHeader = ({order, children}) => {
    return (<>
        <div className={styles.info}>
            <div>
                <strong>Order No {order?.orderNumber}</strong>
                <span>{order?.address?.formattedAddress}</span>
            </div>
            <a className={styles.infoBlock} href={`https://www.google.com/maps/search/?api=1&query=${order?.store?.name}+${order?.store?.formattedAddress}`} target="_blank" rel="noopener noreferrer">
                <i className="fa fa-2x fa-map-marker"></i>
                <div className={styles.infoDetail}>
                    <div>{order?.store?.name}</div>
                    <div>{order?.store?.formattedAddress}</div>
                </div>
            </a>
            <a href={`tel:${order?.store?.phone}`} className={styles.infoBlock}>
                <i className="fa fa-2x fa-phone"></i>
                <div className={styles.infoDetail}>
                    <span>{order?.store?.phone}</span>
                </div>
            </a>
            {children}
        </div>
    </>)
}

const OrderCart = ({ order, className, children }) => {
    const cart = order?.cart ?? {};
    const HeaderComponent = order?.deliveryType==='PICK_UP'? PickupOrderHeader : OndemandOrderHeader;

    return (
        <div className={className}>
            <div className={styles.card}>
                <HeaderComponent order={order}>
                    {children}
                </HeaderComponent>
                <div className={styles.cart}>
                    {cart?.items?.map(item => (
                        <div className={styles.row} key={item?.productId}>
                            <div className={classNames(styles.item, item.bundleItems?.length > 0 && styles.isBundle)}>
                                <div className={styles.image}>
                                    <img src={item?.primaryImageSrc ?? '/static/assets/img/1x1.gif'} alt={item?.productName} onError={(e) => {
                                        if (e.target.src !== '/static/assets/img/1x1.gif') {
                                            e.target.src = '/static/assets/img/1x1.gif'
                                        }
                                    }} />
                                </div>
                                <span className={styles.qty}>{item?.quantity}x</span>
                                { ProductNameWithPackSize(item?.productName, item?.packSize) }
                                <div className={styles.pricing}>
                                    {item?.salePrice && <span className={styles.sale}>{formatCurrency('$', item?.price * item?.quantity, 0, 2)}</span>}
                                    <span className={styles.price}>{formatCurrency('$', (item?.salePrice ?? item?.price) * item?.quantity, 0, 2)}</span>
                                </div>
                            </div>
                            {item.bundleItems?.length > 0 && item.bundleItems.map(bundleItem => (
                                <div className={classNames(styles.item, styles.bundleItem)} key={bundleItem?.productId}>
                                    <div className={styles.image}>
                                        <img src={bundleItem?.primaryImageSrc} alt={bundleItem?.productName} />
                                    </div>
                                    <span className={styles.qty}>{bundleItem?.quantity}x</span>
                                    { ProductNameWithPackSize(bundleItem?.productName, bundleItem?.packSize) }

                                    <div className={styles.pricing}>
                                        {bundleItem?.salePrice && <span className={styles.sale}>{formatCurrency('$', bundleItem?.price * bundleItem?.quantity, 0, 2)}</span>}
                                        <span className={styles.price}>{formatCurrency('$', (bundleItem?.salePrice ?? bundleItem?.price) * bundleItem?.quantity, 0, 2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProductNameWithPackSize = (productName, packSize) => {
  return <div className={styles.name}>
      <div>{productName}</div>
      <div>{`${packSize > 1 ? `${packSize} pack` : ""}`}</div>
  </div>
}

export default OrderCart;