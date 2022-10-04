import React from 'react';
import { shallow } from 'enzyme';
import { cart as sampleCart } from 'lib/../../tests/sampleData/cart';
import sampleProduct from 'lib/test/sampleData/product';
import { AddToCart } from './AddToCart';
import Dropdown from 'app/components/Dropdown';
import styles from './AddToCard.module.scss';

// TODO: Centralise these
window.newrelic = jest.fn();
window.tippleAnalytics = {
    trigger: jest.fn()
};

const selectedPackSize = sampleProduct.defaultPack.packSize;

const defaultProps = {
    auth: {},
    currentCart: sampleCart,
    product: sampleProduct,
    addToCart: jest.fn(),
    outOfStock: false,
    packSize: selectedPackSize,
    onUpdatePackSelected: jest.fn()
};

const renderComponent = givenProps => {
    const props = { ...defaultProps, ...givenProps };

    return (
        <AddToCart
            auth={props.auth} 
            currentCart={props.currentCart} 
            product={props.product}
            addToCart={props.addToCart}
            outOfStock={props.outOfStock}
            packSize={props.packSize}
            onUpdatePackSelected={props.onUpdatePackSelected}
        />
    );
};

it('should render component with default props', () => {
    const wrapper = shallow(renderComponent());
    const componentSelector = wrapper.find(`.${styles.add}`);

    expect(componentSelector.exists()).toBe(true);
});

it('should call addToCart prop when button clicked', () => {
    const spyAddToCart = jest.fn();
    const givenProps = {
        addToCart: spyAddToCart
    };
    const wrapper = shallow(renderComponent(givenProps));
    const addButton = wrapper.find('.btn-primary');

    addButton.simulate('click');
    
    expect(spyAddToCart).toHaveBeenCalled();
});

it('should disable button if outOfStock is true', () => {
    const givenProps = {
        outOfStock: true
    };
    const wrapper = shallow(renderComponent(givenProps));
    const addButton = wrapper.find('.btn-primary');

    expect(addButton.props()['disabled']).toBe(true);
});

it('should increment and decrement quantity in state', () => {
    const wrapper = shallow(renderComponent());
    const instance = wrapper.instance();

    expect(instance.state.quantity).toBe(1);

    instance.incrementQuantity();

    expect(instance.state.quantity).toBe(2);

    instance.decrementQuantity();

    expect(instance.state.quantity).toBe(1);
});

it('should only increment quantity to a maximum of 99', () => {
    const expectedMaxQuantity = 99;
    const wrapper = shallow(renderComponent());
    const instance = wrapper.instance();
    instance.setState({ quantity: expectedMaxQuantity });

    expect(instance.state.quantity).toBe(expectedMaxQuantity);

    instance.incrementQuantity();

    expect(instance.state.quantity).toBe(expectedMaxQuantity);
});

it('should only decrement quantity to a minimum of 1', () => {
    const wrapper = shallow(renderComponent());
    const instance = wrapper.instance();

    expect(instance.state.quantity).toBe(1);

    instance.decrementQuantity();

    expect(instance.state.quantity).toBe(1);
});

it('should render pack dropdown if product has multiple pack sizes', () => {
    const wrapper = shallow(renderComponent());
    const dropdown = wrapper.find(Dropdown);

    expect(dropdown.exists()).toBe(true);
});

it('should not render pack dropdown if product has only one pack size', () => {
    const givenProduct = {
        ...sampleProduct,
        pricePacks: sampleProduct.pricePacks.slice(0, 1)
    };
    const givenProps = {
        product: givenProduct
    };
    const wrapper = shallow(renderComponent(givenProps));
    const dropdown = wrapper.find(Dropdown);

    expect(dropdown.exists()).toBe(false);
});

//it('should fire analytics when addtoCart called', () => {});
//it('should fire props.onUpdatePackSelected when selectPack called', () => {});

it('should fire onUpdatePackSelected from props when selectPack called', () => {
    const spy = jest.fn();
    const givenProps = {
        onUpdatePackSelected: spy
    };
    const expectedPackSize = 1;
    const wrapper = shallow(renderComponent(givenProps));
    const instance = wrapper.instance();

    instance.selectPack(expectedPackSize);

    expect(spy).toHaveBeenCalledWith(expectedPackSize);
});