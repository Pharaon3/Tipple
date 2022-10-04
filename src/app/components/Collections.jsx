import React from 'react';
import SliderCollection from 'app/components/collection/SliderCollection';
import FeaturedCollection from 'app/components/collection/FeaturedCollection';
import TileCollection from 'app/components/collection/TileCollection';
import BadgeCollection from 'app/components/collection/BadgeCollection';

import styles from './Collections.module.scss';

const Collections = ({ collections, to = '', analyticsProps = {} }) => {

    return (
        <>
            {collections?.filter(collection => collection.items?.length > 0)
                .map((collection,i) => {
                    if (collection.displayType === 'SLIDER') {
                        return <SliderCollection className={styles.collection} collection={collection} items={collection.items} key={`${collection.id}_${i}`} to={to} analyticsProps={analyticsProps} />
                    } else if (collection.displayType === 'TILE') {
                        return <TileCollection className={styles.collection} collection={collection} items={collection.items} key={`${collection.id}_${i}`} to={to} analyticsProps={analyticsProps} />
                    } else if (collection.displayType === 'FEATURE') {
                        return <FeaturedCollection className={styles.collection} collection={collection} items={collection.items} key={`${collection.id}_${i}`} to={to} analyticsProps={analyticsProps} />
                    } else if (collection.displayType === 'BADGE') {
                        return <BadgeCollection className={styles.collection} collection={collection} items={collection.items} key={`${collection.id}_${i}`} to={to} analyticsProps={analyticsProps} />
                    } else {
                        // Unsupported
                        return <></>
                    }
                }
            )}
        </>
    );
};

export default Collections;