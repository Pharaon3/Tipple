import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import classNames from 'classnames';
import { PUBLIC_ICON_FOLDER } from 'lib/constants/app';
import formatCurrency from 'lib/currency';
import registerProductRedux from 'app/resources/api/product';
import { debounce } from 'lib/util/function';
import { getUrlParam } from 'lib/searchParams';
import { onKeyUpEscape } from 'lib/util/dom';

import styles from './GlobalSearch.module.scss';

const productRedux = registerProductRedux('PRODUCT_SEARCH', ['LIST', 'CLEAR']);

// TODO: Move this somewhere central! It's used all over.
const getProductPricePack = product => {
    if (product?.defaultPack) {
        return product.defaultPack;
    }

    let currentSelectedPack = (product?.pricePacks || []).find(pp => {
        return pp.initial;
    });

    if (currentSelectedPack === undefined && product.pricePacks?.length) {
        currentSelectedPack = product.pricePacks[0];
    }

    return currentSelectedPack;
};

const GlobalSearch = ({ assetPath = PUBLIC_ICON_FOLDER, wrapperClassName, onSearchToggled }) => {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const history = useHistory();

    const urlQuery = getUrlParam(history?.location?.search, 'q');
    const [expanded, setExpanded] = useState(!!urlQuery);

    const auth = useSelector(state => state?.auth);
    const currentStoreId = useSelector(state => state?.cart?.currentCart?.storeId ?? state?.theme?.defaultStoreId);
    const searchResults = useSelector(state => state?.PRODUCT_SEARCH?.items ?? []);
    const hasSearchRequested = useSelector(state => state?.PRODUCT_SEARCH?.hasRequested ?? false);
    const isSearchRequesting = useSelector(state => state?.PRODUCT_SEARCH?.isRequesting ?? false);
    const zoneId = useSelector(state => state.cart?.currentCart?.address?.zoneId ?? null);

    const focusSearch = (targetElement) => {
        // create invisible dummy input to receive the focus first
        const fakeInput = document.createElement('input');
        fakeInput.setAttribute('type', 'text');
        fakeInput.setAttribute('readonly', true);
        fakeInput.style.position = 'absolute';
        fakeInput.style.opacity = 0;
        fakeInput.style.height = 0;
        fakeInput.style.fontSize = '16px'; // disable auto zoom

        // you may need to append to another element depending on the browser's auto
        // zoom/scroll behavior
        document.body.prepend(fakeInput);

        // focus so that subsequent async focus will work
        fakeInput.focus();

        window.requestAnimationFrame(() => {
            // now we can focus on the target input
            targetElement.focus();

            // cleanup
            fakeInput.remove();

        });
    };

    const toggleSearch = () => {
        setSearchVisible(!expanded);
        if (!expanded) {
            focusSearch(inputRef.current);
        }
    };

    const setSearchVisible = isVisible => {
        setExpanded(isVisible);
        onSearchToggled(isVisible);
    };

    const clearSearch = () => {
        inputRef.current.value = '';
        dispatch(productRedux.actionCreators.clear());
    };

    const handleClose = () => {
        clearSearch();
        setSearchVisible(false);
        history.replace(history.location.pathname);
    };

    const handleKeyUp = e => {
        onKeyUpEscape(e, () => setSearchVisible(false));
    };

    const handleChange = e => {
        if (e?.target?.value === '') {
            dispatch(productRedux.actionCreators.clear());
        }
        searchProducts(e?.target?.value ?? '');
    };

    const searchProducts = debounce(query => {
        if (query) {
            const params = {
                storeIds: currentStoreId,
                inline: 'images{src},pricePacks',
                fields: 'name,sku,slug',
                requirePrice: true,
                limit: 20,
                includeOutOfStock: true,
                q: `*${query}*`
            };

            dispatch(productRedux.actionCreators.list(auth, params, undefined, {
                successCallback: () => {
                    const queryString = String(history?.location?.search ?? '').replace(/&*q=([^&]*)/gi, '');

                    if (queryString.startsWith('?')) {
                        history.replace(`${history?.location?.pathname}${queryString.concat(`${queryString.length > 1 ? '&' : ''}q=${query}`)}`);
                    } else {
                        history.push(`${history?.location?.pathname}?q=${query}`);
                    }
                }
            }));
        }
    }, 500);

    useEffect(() => {
        if (!urlQuery) {
            setSearchVisible(false);
        }
    }, [history?.location?.pathname]);

    // Clear the search and results when our zone changes.
    useEffect(() => {
        clearSearch();
    }, [zoneId])

    useEffect(() => {
        if (urlQuery  && !isSearchRequesting) {
            inputRef.current.value = urlQuery;
            setSearchVisible(true);
            searchProducts(urlQuery);
        }

        if (urlQuery === null) {
            setSearchVisible(false);
        }
    }, [urlQuery]);


    return (
        <>
            <div className={classNames(styles.wrap, wrapperClassName, expanded && styles['is-expanded'])} onClick={toggleSearch}>
                <div className={classNames(styles.container, styles.search)} onClick={e => e.stopPropagation()}>
                    <img alt="Search" src={`${assetPath}icon-search.svg`} className={classNames(styles.icon)} />
                    <input ref={inputRef} type="text" placeholder="Type to start searching" onChange={handleChange} onKeyUp={handleKeyUp} defaultValue={urlQuery} />
                    <img alt="Close" src={`${assetPath}icon-close.svg`} className={styles.close} onClick={handleClose} />
                </div>
                {(searchResults && expanded && hasSearchRequested && !isSearchRequesting) && <div className={classNames(styles.container, styles.results)}>
                    {searchResults.length > 0 && searchResults.map(product => {
                        const pricePack = getProductPricePack(product);
                        const packSizeLink = pricePack ? `?packSize=${pricePack?.packSize}` : '';

                        return (
                            <Link to={`/product/${product?.slug}${packSizeLink}`} key={product?.id} className={styles.product} onClick={clearSearch}>
                                <div className={styles.image}>
                                    <img src={product?.primaryImageSrc ?? '/static/assets/img/1x1.gif'} alt={product.name} onError={(e) => {
                                        if (e.target.src !== '/static/assets/img/1x1.gif') {
                                            e.target.src = '/static/assets/img/1x1.gif'
                                        }
                                    }} />
                                </div>
                                <div className={styles.name}>
                                    <strong>{product?.name}</strong>
                                    <div className={styles.price}>
                                        <span className={pricePack?.salePrice > 0 ? styles.sale : ""}>{formatCurrency('$', pricePack?.salePrice > 0 ? pricePack?.salePrice : (pricePack?.price ?? 0), 0, 2)}</span>
                                        {pricePack?.salePrice > 0 && <span className={styles.strikethrough}>{formatCurrency('$', pricePack?.price, 0, 2)}</span>}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                    {searchResults.length === 0 &&
                        <div className={styles.noresults}>No results found.</div>
                    }
                </div>}
                {expanded && isSearchRequesting && <div className={styles.results}>
                    {[0,1,2,3].map((i) => (<div className={styles.loader} key={i}>
                        <div className={classNames(styles.skeleton, styles.image)}/>
                        <div className={styles.name}>
                            <div className={classNames(styles.skeleton, styles.title)}/>
                            <div className={classNames(styles.skeleton, styles.price)}/>
                        </div>
                    </div>))}
                </div>}
            </div>
            <div className={classNames(styles.overlay, expanded && styles['is-expanded'])}/>
            <img onClick={toggleSearch} alt="Search" src={`${assetPath}icon-search.svg`} className={classNames(styles.icon)} />
        </>
    );
};

export default GlobalSearch;