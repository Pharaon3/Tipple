import React, { useState } from 'react';
import classNames from 'classnames';
import formatCurrency from 'lib/currency';
import QuantitySelector from 'app/components/product/QuantitySelector';
import RadioButton from 'app/components/RadioButton';

import styles from './VariantGroup.module.scss';

const VariantGroup = ({ variantGroup, itemQuantities, onSetItemQuantity, isValid = false }) => {
    const [hasInteracted, setHasInteracted] = useState(false);

    const getTotalGroupQuantity = () => Object.keys(itemQuantities).reduce((ac, itemKey) => ac + itemQuantities[itemKey], 0);

    const shouldDisablePlusButton = item => {
        const groupQty = getTotalGroupQuantity();
        return (itemQuantities[item?.variantGroupItemId] >= item.maxQuantity || groupQty >= variantGroup.maxRequired);
    };

    /**
     * Set the quantity for an item in a list with display type of SINGLE. Quantity will always be one, and we 
     * also need to set the quantity of any other group items that were previously 1, to 0.
     * @param {*} item 
     * @param {*} qty 
     */
    const setItemQty = (item, qty) => {
        const variantGroupItemsToZero = variantGroup?.items?.filter(groupItem => groupItem?.variantGroupItemId !== item.variantGroupItemId);
        const newItemQuantities = {
            ...variantGroupItemsToZero.reduce((itemQtys, groupItem) => ({
                ...itemQtys,
                [groupItem?.variantGroupItemId]: 0
            }), {}),
            [item?.variantGroupItemId]: qty
        };

        Object.keys(newItemQuantities).forEach(variantGroupItemId => {
            // It's either being selected or deselected; ignore all other options.
            if (newItemQuantities[variantGroupItemId] === 1 || itemQuantities[variantGroupItemId] === 1) {
                const ignoreAnalytics = itemQuantities[variantGroupItemId] === 1;   // This is going down to 0, we don't need to fire analytics for it

                onSetItemQuantity(variantGroup?.variantGroupId, parseInt(variantGroupItemId, 10), newItemQuantities[variantGroupItemId], ignoreAnalytics);
            }
        });
        setHasInteracted(true);
    };

    /**
     * Increase the quantity of this item as long as it doesn't violate the maximums for either this individual item 
     * or the group as a whole.
     * @param {*} item 
     */
    const increaseItemQty = item => {
        const newQuantity = itemQuantities[item?.variantGroupItemId] + 1;

        if (getTotalGroupQuantity() + 1 <= variantGroup?.maxRequired && (!item.maxQuantity || newQuantity <= item?.maxQuantity)) {
            onSetItemQuantity(item?.variantGroupId, item?.variantGroupItemId, newQuantity);
            setHasInteracted(true);
        }
    };

    const decreaseItemQty = item => {
        const newQuantity = itemQuantities[item?.variantGroupItemId] > 1 ? itemQuantities[item?.variantGroupItemId] - 1 : 0;

        onSetItemQuantity(item?.variantGroupId, item?.variantGroupItemId, newQuantity);
        setHasInteracted(true);
    };

    return (
        <section className={classNames(styles.group, hasInteracted && !isValid && styles.invalid)}>
            <strong className={styles.title}>
                {variantGroup?.name}
                {variantGroup?.minRequired >= 1 && <span className={styles.required}>{variantGroup?.minRequired > 1 ? `${variantGroup.minRequired} ` : ''}Required</span>}
            </strong>
            <ul className={styles.options}>
                {variantGroup?.items?.map(item => 
                    <li className={styles.item} key={`{$item?.variantGroupId}_${item?.variantGroupItemId}`}>
                        <img className={styles.image} src={item?.imageSrc ?? '/static/assets/img/1x1.gif'} alt={item?.name} onError={(e) => {
                            if (e.target.src !== '/static/assets/img/1x1.gif') {
                                e.target.src = '/static/assets/img/1x1.gif'
                            }
                        }} />
                        <div className={styles.name}>
                            <span>{item?.name} {item?.packSize && item?.packSize > 1 ? ` ${item?.packSize}pk` : ''}</span>
                            {item?.price > 0 && <span className={styles.price}>{formatCurrency('$', item?.price ?? 0, 0, 2)}</span>}
                        </div>
                        <div className={styles.selection}>
                            {variantGroup?.displayType === 'SINGLE' && 
                                <RadioButton
                                    name={`variantGroup_${item?.variantGroupId}`} 
                                    onChange={() => setItemQty(item, 1)}
                                    checked={itemQuantities[item?.variantGroupItemId] > 0}
                                />
                            }
                            {variantGroup?.displayType === 'ADDON' && <div>
                                <QuantitySelector 
                                    quantity={itemQuantities[item?.variantGroupItemId]} 
                                    onAdd={() => increaseItemQty(item)}
                                    onSubtract={() => decreaseItemQty(item)}
                                    isAddDisabled={shouldDisablePlusButton(item)}
                                />
                            </div>}
                        </div>
                    </li>
                )}
            </ul>
        </section>
    );
};

export default VariantGroup;