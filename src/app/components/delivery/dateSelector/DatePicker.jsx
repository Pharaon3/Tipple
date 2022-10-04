import * as React from 'react';
import classNames from 'classnames';
import useSmoothScroll from 'use-smooth-scroll'
import DateCard from './DateCard';

import styles from './DatePicker.module.scss';

const DatePicker = ({
    onSelect,
    selected,
    days
}) => {
    const ref = React.useRef()
    const scrollTo = useSmoothScroll('x', ref);

    return (<div className={classNames(styles.picker, 'row')} id="tieredDatePicker">
        <i onClick={() => {
            scrollTo(ref.current.scrollLeft - 65)
        }} className={classNames(styles.left, 'fa fa-chevron-left')} />

        <div className={styles.scroller} ref={ref}>
            {days.map(day => {
                return (<DateCard 
                    key={day.value} 
                    onClick={!day.disabled ? () => {onSelect(day.value)} : () => {}} 
                    isSelected={selected === day.value} 
                    isDisabled={day.disabled}
                    date={day.value}
                />);
            })}
        </div>

        <i onClick={() => {
            scrollTo(ref.current.scrollLeft + 65);
        }} className={classNames(styles.right, 'fa fa-chevron-right')} />
    </div>)
}
export default DatePicker;