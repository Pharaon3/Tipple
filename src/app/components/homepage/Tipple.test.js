import React from 'react';
import { shallow } from 'enzyme';
import Page from 'app/components/Page';
import { Home } from './Tipple';

const sampleFeatureFlags = {
    Tiered_Delivery: 'off',
    Tipple_Business: 'off'
};

const defaultProps = {
    currentCart: {
        storePath: ''
    },
    currentUser: {},
    history: {},
    featureFlags: sampleFeatureFlags,
    displayLoginPopup: jest.fn()
};

const renderComponent = givenProps => {
    const props = { ...defaultProps, ...givenProps };

    return (
        <Home
            currentCart={props.currentCart} 
            currentUser={props.currentUser} 
            history={props.history} 
            featureFlags={props.featureFlags}
            displayLoginPopup={props.displayLoginPopup}
        />
    );
}

it('should render with given props', () => {
    const wrapper = shallow(renderComponent());
    const pageSelector = wrapper.find('.hero');

    expect(pageSelector.exists()).toBe(true);
});
