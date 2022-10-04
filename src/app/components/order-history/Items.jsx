import React, { Component } from 'react';
import HistoryItem from './Item';

import styles from './Items.module.scss';

export default class HistoryItems extends Component {

    render() {
        return (
            <div className={styles.items}>
                {this.props.items.map((item, index) => {
                    return <HistoryItem key={item.order.orderNumber + index} item={item} />
                })}
            </div>
        );

    }
}