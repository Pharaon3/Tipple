import React from 'react';
import classNames from 'classnames';
import formatCurrency from 'lib/currency';
import Tooltip from 'app/components/Tooltip';

import styles from './SubTotals.module.scss';

const SubTotals = ({
    items = []
}) => (
    <>
        {items.map((item, i) => (
            <div key={i} className={classNames(styles.row, 'clearfix', item.type === 'DELIVERY' ? 'delivery-fee' : '', item.type === 'DISCOUNT' ? 'discount' : '')}>
                <div className={styles.item}>
                    {item.name}
                    {item.type === 'DISCOUNT' && !item.isApplied && <Tooltip className={styles.tooltip} text={item.tooltip} icon="fa-question-circle">(Not Applied)</Tooltip>}
                    {(item.type !== 'DISCOUNT' || item.isApplied) && (item.tooltip && item.tooltip !== 'VALID') && <Tooltip className={styles.tooltip} text={item.tooltip} icon="fa-question-circle"></Tooltip>}
                </div>
                <div className={classNames(styles.item, 'text-right subtotals-amount')}>
                    {parseInt(item.value, 10) === 0 && item.type === 'DELIVERY' ? 'FREE' : formatCurrency('$', item.value, 0, 2)}
                </div>
            </div>
        ))}
    </>
);

export default SubTotals;