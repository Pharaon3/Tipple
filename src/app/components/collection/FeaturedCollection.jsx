import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import classNames from 'classnames';
import { INTERACTIONS, triggerAnalytics } from 'lib/analytics/collection';
import { throttle } from 'lib/util/function';
import { imageUrl } from 'lib/util/image';
import { collectionLinkUrl } from 'lib/util/collectionLinkUrl';
import { useWindowSize } from 'app/hooks/useWindowSize';
import SliderArrowButton from './SliderArrowButton';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './FeaturedCollection.module.scss';

const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    adaptiveHeight: false,
    draggable: false,
    swipeToSlide: true,
    // swipe: false
    rows: 1,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                // slidesToScroll: 3
            }
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 1,
                // slidesToScroll: 2
            }
        }
    ]
};

const FeaturedCollection = ({ collection, items = [], className, to = '', analyticsProps = {} }) => {
    const { width: windowWidth } = useWindowSize();
    const handleScroll = throttle(() => triggerAnalytics(collection, INTERACTIONS.SCROLL, analyticsProps?.from), 1000);
    const handleSliderClick = () => {
        triggerAnalytics(collection, INTERACTIONS.SCROLL, analyticsProps?.from);
    };

    return (
        <div className={classNames(styles.collection, className)}>
            <h2 className={styles.title}>{collection.name}</h2>
            {windowWidth > 991 ? 
                <div className={styles.slider}>
                    <Slider {...settings} className={styles['slick-slider']} key={collection.id}
                        onSwipe={handleScroll}
                        nextArrow={
                            items.length > 2 ? 
                            <SliderArrowButton 
                                direction='right' 
                                customClass={classNames(styles['slick-arrow'], styles['is-next'])} 
                                handleSliderClick={handleSliderClick} 
                            /> : null
                        }
                        prevArrow={
                            items.length > 2 ? 
                            <SliderArrowButton 
                                direction='left' 
                                customClass={classNames(styles['slick-arrow'], styles['is-prev'])} 
                                handleSliderClick={handleSliderClick} 
                            /> : null
                        }
                    >
                        {items.map((item, i) => 
                            <Link to={collectionLinkUrl(item, to)} className={styles.feature} key={i}
                                onClick={() => triggerAnalytics(collection, INTERACTIONS.OPEN, analyticsProps?.from, item, i + 1, items.length)}
                            >
                                <div className={styles.image}>
                                    <img src={imageUrl(item.image, 'products/') ?? '/static/assets/img/1x1.gif'} alt={item.name} onError={(e) => {
                                        if (e.target.src !== '/static/assets/img/1x1.gif') {
                                            e.target.src = '/static/assets/img/1x1.gif'
                                        }
                                    }} />
                                </div>
                                <strong className={styles.quote}>{item.quoteName ?? item.name}</strong>
                                {item.subtitle && <p className={styles.text}>{item.subtitle}</p>}
                            </Link>
                        )}
                    </Slider>
                </div>
            :
                <div className={styles.wrap} onScroll={handleScroll}>
                    <div className={styles['slider-mobile']}>
                        {items.map((item, i) => 
                            <Link to={collectionLinkUrl(item, to)} className={styles.feature} key={i}
                                onClick={() => triggerAnalytics(collection, INTERACTIONS.OPEN, analyticsProps?.from, item, i + 1, items.length)}
                            >
                                <div className={styles.image}>
                                    <img src={imageUrl(item.image, 'products/') ?? '/static/assets/img/1x1.gif'} alt={item.name} onError={(e) => {
                                        if (e.target.src !== '/static/assets/img/1x1.gif') {
                                            e.target.src = '/static/assets/img/1x1.gif'
                                        }
                                    }} />
                                </div>
                                <strong className={styles.quote}>{item.quoteName ?? item.name}</strong>
                                {item.subtitle && <p className={styles.text}>{item.subtitle}</p>}
                            </Link>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default FeaturedCollection;