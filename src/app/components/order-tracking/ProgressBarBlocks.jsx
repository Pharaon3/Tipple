import React from 'react';
import classNames from 'classnames';

import styles from './ProgressBarBlocks.module.scss';

const ProgressBarBlocks = ({ total = 1, current = 1, className }) => {
    const blocks = [];

    for (let i = 0; i < total; i++) {
        blocks.push(i + 1);
    }

    return (
        <div className={classNames(styles.blocks, className)}>
            {blocks.map(block => (
                <span 
                    key={block}
                    className={classNames(
                        styles.block,
                        block === current && styles.active,
                        block < current && styles.complete
                    )}
                />
            ))}
        </div>
    );
};

export default ProgressBarBlocks;