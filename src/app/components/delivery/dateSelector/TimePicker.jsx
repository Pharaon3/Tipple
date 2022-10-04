import * as React from 'react';
import Dropdown from 'app/components/Dropdown';

import styles from './TimePicker.module.scss';

const TimePicker = ({
    onSelect,
    selected,
    times
}) => {

    return (<div className={styles.picker} id="tieredTimePicker">
        <Dropdown value={selected} onClick={onSelect} className="tipple-select" placeholder="Select a Delivery Time" options={times} />
    </div>)

}

export default TimePicker;