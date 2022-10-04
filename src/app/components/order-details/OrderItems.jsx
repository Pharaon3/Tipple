import React, { Component } from 'react';
import OrderItem from "./OrderItem";

import styles from './OrderItems.module.scss';

export default class OrderItems extends Component {

    render() {
        return (
            <div className={styles.items}>
                {this.props.items.map(item => {
                    return <OrderItem key={item.productId} item={item} />
                })}
            </div>
        );

    }
}