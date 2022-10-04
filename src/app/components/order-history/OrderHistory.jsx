import React, { Component } from 'react';

import HistoryItems from 'app/components/order-history/Items';

import styles from './OrderHistory.module.scss';

export default class OrderHistory extends Component {
    goBack = () => {
        this.props.history.goBack();
    };

    render() {

        return (
            <div className={styles.wrap}>
                <div className="row clearfix cart-item-holder" id="historyItemHolder">
                    {this.props.orders && <HistoryItems items={this.props.orders} />}
                </div>
            </div>
        );
    }
}
