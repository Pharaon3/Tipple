import React from 'react';
import { shallow } from 'enzyme';
import Page from 'app/components/Page';
import { cart as sampleCart } from 'lib/../../tests/sampleData/cart';
import { Products } from './Products';
import mockHistory from 'lib/test/mocks/history';

// TODO: Centralise these
window.newrelic = jest.fn();
window.scrollTo = jest.fn();
window.tippleAnalytics = {
    trigger: jest.fn()
};

jest.useFakeTimers();

const sampleMatch = {
    params: {
        orderId: '1234abcd'
    }
};

const sampleLocation = {
    search: ''
};

const mockRestActions = {
    list: jest.fn(),
    clear: jest.fn()
};

const defaultProps = {
    auth: {},
    match: sampleMatch,
    collectionId: 1,
    collectionTitle: 'Test',
    history: mockHistory,
    location: sampleLocation,
    currentUser: {
        id: 1
    },
    currentCart: sampleCart,
    sortOption: '',
    searchText: '',
    lastProductCategorySlug: 'beer',
    lastCollectionId: null,
    products: undefined,
    productsIsRequesting: false,
    productshasRequested: false,
    categories: [],
    currentStoreId: 3,
    setLocationProps: jest.fn(),
    setLastCollectionId: jest.fn(),
    setSearchText: jest.fn(),
    categoryActions: mockRestActions,
    productActions: mockRestActions
};

const renderComponent = givenProps => {
    const props = { ...defaultProps, ...givenProps };

    return (
        <Products
            auth={props.auth}
            match={props.match}
            collectionId={props.collectionId}
            collectionTitle={props.collectionTitle}
            history={props.history}
            location={props.location}
            currentUser={props.currentUser}
            currentCart={props.currentCart}
            sortOption={props.sortOption}
            searchText={props.searchText}
            lastProductCategorySlug={props.lastProductCategorySlug}
            lastCollectionId={props.lastCollectionId}
            products={props.products}
            productsIsRequesting={props.productsIsRequesting}
            categories={props.categories}
            currentStoreId={props.currentStoreId}
            setLocationProps={props.setLocationProps}
            setLastCollectionId={props.setLastCollectionId}
            setSearchText={props.setSearchText}
            categoryActions={props.categoryActions}
            productActions={props.productActions}
        />
    );
};

it('should render page with given props', () => {
    const wrapper = shallow(renderComponent());
    const pageSelector = wrapper.find(Page);

    expect(pageSelector.exists()).toBe(true);
});