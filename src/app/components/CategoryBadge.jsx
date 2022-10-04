import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { AnalyticsEvents } from 'lib/analytics';

import styles from './CategoryBadge.module.scss';

const CategoryBadge = ({ category = {}, analyticsProps = {}, to = '', className }) => {

    const triggerAnalyticsCategory = () => {
        if (category && typeof window !== 'undefined') {
            global.tippleAnalytics.trigger(AnalyticsEvents.category_clicked, 
                {
                    id: category?.id,
                    slug: category?.slug,
                    name: category?.name,
                    from: analyticsProps?.from,
                    type: category?.parentId && parseInt(category?.parentId, 10) > 0 ? 'subcategory' : 'parent',
                    parentCategory: analyticsProps?.parentCategory?.name
                }
            );
        }
    };

    return (
        <Link className={classNames(styles.category, className)} key={category.id} to={to} onClick={triggerAnalyticsCategory}>
            <div className={styles.icon} style={{ backgroundColor: category.backgroundColor }}>
                <img src={category.imageSvgSrc} alt={category.name} />
            </div>
            <h5 className={styles.label}>{category.name}</h5>
        </Link>
    );
};

export default CategoryBadge;