import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import styles from './Tooltip.module.scss';

export default ({ text, children, icon, className = null }) => {

    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        document.addEventListener('touchstart', () => setClicked(false), false);

        return () => {
            document.removeEventListener('touchstart', () => setClicked(false), false);
        };
    }, []);

    return <div className={classNames(styles.tooltip, className)} onTouchStart={() => setClicked(!clicked)}>
        {children} {icon? <i className={`fa ${icon}`}></i> : null}
        <span className={classNames(styles.text, clicked && styles.visible)}>{text}</span>
    </div>

};