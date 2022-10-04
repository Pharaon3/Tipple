import React from 'react';
import { shallow } from 'enzyme';
import Page from 'app/components/Page';
import Cart from 'app/components/cart/Cart';
import Checkout from 'app/components/checkout/Checkout';
import Delivery from 'app/components/delivery/Delivery';
import { cart as sampleCart, item as sampleItem } from 'lib/../../tests/sampleData/cart';
import { CheckoutFlow } from './CheckoutFlow';
import mockHistory from 'lib/test/mocks/history';

// TODO: Centralise these
window.newrelic = jest.fn();
window.scrollTo = jest.fn();
window.tippleAnalytics = {
    trigger: jest.fn()
};

jest.useFakeTimers();

// auth, match, refreshCart, orderActions.get, order.item, 

const sampleMatch = {
    params: {
        orderId: '1234abcd'
    }
};

const sampleLocation = {
    ...mockHistory.location,
    pathname: '/cart'
};

const defaultProps = {
    auth: {},
    match: sampleMatch,
    refreshCart: jest.fn(),
    orderActions: {
        get: jest.fn()
    },
    cart: sampleCart,
    cartItems: sampleCart?.items ?? [],
    history: mockHistory,
    location: sampleLocation,
    verifyCart: jest.fn(),
    displaySurchargePopup: jest.fn()
};

const renderComponent = givenProps => {
    const props = { ...defaultProps, ...givenProps };

    return (
        <CheckoutFlow
            auth={props.auth} 
            match={props.match} 
            refreshCart={props.refreshCart} 
            orderActions={props.orderActions}
            cart={props.cart}
            cartItems={props.cartItems}
            history={props.history}
            location={props.location}
            verifyCart={props.verifyCart}
            displaySurchargePopup={props.displaySurchargePopup}
        />
    );
};

it('should render page with given props', () => {
    const wrapper = shallow(renderComponent());
    const pageSelector = wrapper.find(Page);

    expect(pageSelector.exists()).toBe(true);
});

it('should render cart tab for step 1', () => {
    const wrapper = shallow(renderComponent());
    const selector = wrapper.find(Cart);

    expect(selector.exists()).toBe(true);
});

it('should render delivery tab for step 2', () => {
    const wrapper = shallow(renderComponent());
    const instance = wrapper.instance();
    instance.setState({ step: 2 });
    const selector = wrapper.find(Delivery);

    expect(selector.exists()).toBe(true);
});

it('should render checkout tab for step 3', () => {
    const wrapper = shallow(renderComponent());
    const instance = wrapper.instance();
    instance.setState({ step: 3 });
    const selector = wrapper.find(Checkout);

    expect(selector.exists()).toBe(true);
});

it('should fail cart validation if there are cart items', () => {
    const givenProps = {
        ...defaultProps,
        cartItems: []
    };
    const wrapper = shallow(renderComponent(givenProps));
    const instance = wrapper.instance();
    
    const expectedValid = instance.validateCart();

    expect(expectedValid).toEqual(false);
});

it('should pass cart validation if there are cart items', () => {
    const givenProps = {
        ...defaultProps,
        cartItems: [sampleItem]
    };
    const wrapper = shallow(renderComponent(givenProps));
    const instance = wrapper.instance();
    
    const expectedValid = instance.validateCart();

    expect(expectedValid).toEqual(true);
});

it('should display surcharge popup if set in props and there are cart items', () => {
    const spy = jest.fn();
    const givenProps = {
        ...defaultProps,
        displaySurchargePopup: spy,
        cart: {
            ...sampleCart,
            surcharge: 5.00,
            items: [sampleItem]
        },
        cartItems: [sampleItem]
    };

    const wrapper = shallow(renderComponent(givenProps));
    const instance = wrapper.instance();
    const expectedValid = instance.validateCart();

    expect(spy).toHaveBeenCalled();
    expect(expectedValid).toEqual(false);
});

it('should not display surcharge popup if set in props and there are no cart items', () => {
    const spy = jest.fn();
    const givenProps = {
        ...defaultProps,
        displaySurchargePopup: spy
    };

    const wrapper = shallow(renderComponent(givenProps));
    const instance = wrapper.instance();
    const expectedValid = instance.validateCart();

    expect(spy).not.toHaveBeenCalled();
    expect(expectedValid).toEqual(false);
});

it('should not display surcharge popup if skipPopups is true', () => {
    const spy = jest.fn();
    const givenProps = {
        ...defaultProps,
        displaySurchargePopup: spy,
        cart: {
            ...sampleCart,
            surcharge: 5.00,
            items: [sampleItem]
        },
        cartItems: [sampleItem],
        location: {
            pathname: '/cart'
        }
    };

    const wrapper = shallow(renderComponent(givenProps));
    const instance = wrapper.instance();
    const expectedValid = instance.validateCart(true);

    expect(spy).not.toHaveBeenCalled();
    expect(expectedValid).toEqual(true);
});

it('should not move to delivery tab if cart validation fails', () => {

});