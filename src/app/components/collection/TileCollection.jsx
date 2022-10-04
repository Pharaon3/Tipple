import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { INTERACTIONS, triggerAnalytics } from 'lib/analytics/collection';
import { throttle } from 'lib/util/function';
import { imageUrl } from 'lib/util/image';
import { collectionLinkUrl } from 'lib/util/collectionLinkUrl';

import styles from './TileCollection.module.scss';

const TileCollection = ({ collection, items = [], className, to = '', analyticsProps = {} }) => {
    const handleScroll = throttle(() => triggerAnalytics(collection, INTERACTIONS.SCROLL, analyticsProps?.from), 1000);
    return (
        <div className={classNames(styles.collection, className)}>
            <h2 className={styles.title}>{collection.name}</h2>
            <div className={styles.wrap} onScroll={handleScroll}>
                <div className={styles.slider}>
                    {items.map((item, i) => 
                        <Link to={collectionLinkUrl(item, to)} className={styles.tile} style={{ backgroundColor: item?.color }} key={i}
                            onClick={() => triggerAnalytics(collection, INTERACTIONS.OPEN, analyticsProps?.from, item, i + 1, items.length)}
                        >
                            {item.image && <img src={imageUrl(item.image, 'products/')} alt={item.name} onError={(e) => {
                                if (e.target.src !== '/static/assets/img/1x1.gif') {
                                    e.target.src = '/static/assets/img/1x1.gif'
                                }
                            }} />}
                            <span className={styles.text}>{item.name}</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TileCollection;