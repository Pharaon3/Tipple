import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Slider from 'react-slick';
import ProductCard from 'app/components/product/ProductCard';
import SliderArrowButton from './SliderArrowButton';
// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { INTERACTIONS, triggerAnalytics } from 'lib/analytics/collection';
import { throttle } from 'lib/util/function';
import { useWindowSize } from 'app/hooks/useWindowSize';

import styles from './SliderCollection.module.scss';


const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    adaptiveHeight: true,
    draggable: false,
    swipeToSlide: true,
    // swipe: false
    rows: 1,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                // slidesToScroll: 3
            }
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 2,
                // slidesToScroll: 2
            }
        }
    ]
};

const SliderCollection = ({ collection, items = [], className, analyticsProps = {} }) => {
    const { width: windowWidth } = useWindowSize();
    const history = useHistory();
    const hasCart = useSelector(store => store.cart.currentCart ? true : false);

    const handleSliderScroll = throttle(() => triggerAnalytics(collection, INTERACTIONS.SCROLL, analyticsProps?.from), 500);
    const handleSliderClick = () => {
        triggerAnalytics(collection, INTERACTIONS.SCROLL, analyticsProps?.from);
    };

    // FIXME: This assumes we know the only variance in URL structure. Figure out a better way to handle this across the app 
    // that will allow for future proofing and using any URLs.
    const getPath = () => {
        const path = history?.location?.pathname;
        const urlParts = (path.match(/(\/.)/g) || []).length;
        
        return urlParts === 3 ? (path.lastIndexOf('/') === path.length - 1 ? path : path.concat('/')).concat('categories') : path;
    };

    const showArrowBtns = (windowWidth <= 992 && items.length > 3) ||
        (windowWidth <= 1200 && items.length > 4) ||
        (windowWidth > 1200 && items.length > 5);

    return (
        <div className={classNames(styles.collection, className)}>
            <div className={styles.heading}>
                <h2 className={styles.title}>{collection.name}</h2>
                <Link to={`${getPath()}?collection=${collection.id}&title=${encodeURIComponent(collection.heading?.title ?? collection.name)}`} className={styles.link} onClick={() => triggerAnalytics(collection, INTERACTIONS.SEE_ALL, analyticsProps?.from)}>
                    See All
                    <i className="fa fa-chevron-right"></i>
                </Link>
            </div>
            {windowWidth > 991 ? 
                <div className={styles.slider}>
                    <Slider {...settings} className={styles['slick-slider']} key={collection.id}
                        onSwipe={handleSliderScroll}
                        nextArrow={
                            showArrowBtns ? 
                            <SliderArrowButton 
                                direction='right' 
                                customClass={classNames(styles['slick-arrow'], styles['is-next'])} 
                                handleSliderClick={handleSliderClick}
                            /> : null
                        }
                        prevArrow={
                            showArrowBtns ?
                            <SliderArrowButton 
                                direction='left' 
                                customClass={classNames(styles['slick-arrow'], styles['is-prev'])} 
                                handleSliderClick={handleSliderClick} 
                            /> : null
                        }
                    >
                        {items.map((item, i) => 
                            <div className={styles.product} key={i}>
                                <ProductCard product={{ ...item, primaryImageSrc: item.image }} linkToPackSize={item.productPackSize} hasCart={hasCart} />
                            </div>
                        )}
                    </Slider>
                </div>
            :
                <div className={styles.wrap} onScroll={handleSliderScroll}>
                    <div className={styles['slider-mobile']}>
                        {items.map((item, i) => 
                            <div className={classNames(styles.product, styles.mobile)} key={i}>
                                <ProductCard product={{ ...item, primaryImageSrc: item.image }} linkToPackSize={item.productPackSize} hasCart={hasCart} />
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default SliderCollection;