import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Slider from 'react-slick';
import CategoryBadge from 'app/components/CategoryBadge';
// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './SubCategorySlider.module.scss';

const SliderNextArrow = ({ className, customClass, style, onClick, handleSliderClick }) => {
    return (
        <div
            className={classNames(className, customClass)}
            style={{ ...style, display: "flex" }}
            onClick={() => {
                onClick && onClick();
                // handleSliderClick();
            }}
        >
            <i className="fa fa-chevron-right"></i>
        </div>
    );
};

const SliderPrevArrow = ({ className, customClass, style, onClick, handleSliderClick }) => {
    return (
        <div
            className={classNames(className, customClass)}
            style={{ ...style, display: 'flex' }}
            onClick={() => {
                onClick && onClick();
                // handleSliderClick();
            }}
        >
            <i className="fa fa-chevron-left"></i>
        </div>
    );
};

const settings = {
    infinite: false,
    speed: 300,
    slidesToShow: 10,
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
                slidesToShow: 8
            }
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 4
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 3
            }
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 3
            }
        }
    ]
};

const SubCategorySlider = ({ subcats = [], className, homeCategories = [] }) => {
    let windowInnerWidth = 0;

    try {
        windowInnerWidth = window !== undefined ? window?.innerWidth : 0;
    } catch (e) {
    }
    const [windowWidth, setWindowWidth] = useState(windowInnerWidth);

    const updateWindowWidth = () => {
        setWindowWidth(window?.innerWidth);
    };

    useEffect(() => {
        if (window) {
            window.addEventListener('resize', updateWindowWidth);
        }

        return () => {
            if (window) {
                window.removeEventListener('resize', updateWindowWidth);
            }
        };
    });

    return (
        <div className={classNames(styles.subcategories, className)}>
            {windowWidth > 991 ? 
                <div className={styles.slider}>
                    <Slider {...settings} className={styles['slick-slider']} key="subcategories"
                        nextArrow={<SliderNextArrow customClass={classNames(styles['slick-arrow'], styles['is-next'])} />}
                        prevArrow={<SliderPrevArrow customClass={classNames(styles['slick-arrow'], styles['is-prev'])} />}
                    >
                        {subcats?.map((cat, i) => 
                            <div className={styles.category} key={i}>
                                <CategoryBadge 
                                    key={cat.id} 
                                    category={cat} 
                                    analyticsProps={{
                                        parentCategory: cat?.parentId ? homeCategories.find(c => c.id === cat?.parentId) : null,
                                        from: 'Category'
                                    }} 
                                    to={location => `${location.pathname}/${cat.slug}`} 
                                />
                            </div>
                        )}
                    </Slider>
                </div>
            :
                <div className={styles.wrap}>
                    <div className={styles['slider-mobile']}>
                        {subcats?.map((cat, i) => 
                            <div className={classNames(styles.category, styles.mobile)} key={i}>
                                <CategoryBadge 
                                    key={cat.id} 
                                    category={cat} 
                                    analyticsProps={{
                                        parentCategory: cat?.parentId ? homeCategories.find(c => c.id === cat?.parentId) : null,
                                        from: 'Category'
                                    }} 
                                    to={location => `${location.pathname}/${cat.slug}`} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
};

export default SubCategorySlider;