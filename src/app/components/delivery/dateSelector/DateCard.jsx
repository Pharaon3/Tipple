import * as React from 'react';
import classNames from 'classnames';
import formatDate from 'date-fns/format';

import styles from './DateCard.module.scss';

const DateCard = ({
    date,
    isSelected,
    isDisabled,
    onClick
}) => {

    return (<div className={classNames(styles.card, isSelected && styles.selected, 'tiered-delivery__date-card', isDisabled && styles.unavailable)} onClick={onClick}>
        <div className={styles.dayOfWeek}>{formatDate(date, 'ddd')}</div>
        <div className={styles.day}>{formatDate(date, 'DD')}</div>

        <div className={styles.month}>{formatDate(date, 'MMM')}</div>

    </div>)

}

export default DateCard;