import * as React from 'react';
import classNames from 'classnames';
import SVG from './SVG';

import formatCurrency from 'lib/currency';

import styles from './Card.module.scss';

const Card = ({
    id,
    name,
    description,
    tooltip,
    price,
    isSelected,
    isEnabled,
    isSelectable,
    onSelect,
    onClick,
    icon,
    iconDisabled,
    iconSelected,
    size,
    isInProgress,
    isRevealed
}) => {
    return (
        <div 
            onClick={() => {
                isSelectable && !isInProgress && onSelect(id);
                isEnabled && onClick(id);
            }} 
            className={classNames(
                styles.card, 
                !isEnabled && styles.unavailable, 
                (isSelected && isEnabled) && styles.selected, 
                size === 'md' && styles.md, 
                size === 'sm' && styles.sm, 
                'tiered-delivery__card'
            )}
        >
            {(isSelected && isEnabled) && <div className={classNames(styles.notification, styles.valid)}><i className="fa fa-check" /></div>}
            {!isSelected && isRevealed && tooltip && <div className={classNames(styles.notification, 'tooltip-top')} data-tooltip={tooltip}><i className="fa fa-info" /></div>}

            <div className={styles.image}>
                {isEnabled ?
                    (isSelected && iconSelected ? <img src={iconSelected} alt={name} height='100%' width='100%' /> : icon ? <img src={icon} alt={name} height='100%' width='100%' /> : '') :
                    (iconDisabled ? <img src={iconDisabled} alt={name} height='100%' width='100%' /> : '')
                }
            </div>

            <div className={styles.text}>
                <div className={styles.title}>{name}</div>
                <div className={styles.description}>{description}</div>
            </div>

            <div className={styles.pricing}>{!price || parseFloat(price, 10) === 0.00 ? 'FREE' : formatCurrency('$', price, 0, 2)}</div>

        </div>
    );
};

export default Card;