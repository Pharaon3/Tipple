import React from 'react';
import { shallow } from 'enzyme';
import sampleProduct from 'lib/test/sampleData/product';
import { ProductCard } from './ProductCard';
import styles from './AddToCard.module.scss';

// TODO: Centralise these
// window.newrelic = jest.fn();
// window.tippleAnalytics = {
//     trigger: jest.fn()
// };

const defaultProps = {
    hasCart: true,
    product: sampleProduct,
};

const renderComponent = givenProps => {
    const props = { ...defaultProps, ...givenProps };

    return (
        <ProductCard
            product={props.product}
            hasCart={props.hasCart}
        />
    );
};

it('should render component with default props', () => {
    const wrapper = shallow(renderComponent());
    const componentSelector = wrapper.find(`.${styles.card}`);

    expect(componentSelector.exists()).toBe(true);
});