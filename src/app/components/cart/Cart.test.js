import React from 'react';
import { shallow } from 'enzyme';
import { Cart } from './Cart';
import CartItems from './Items';
// import SubTotals from './SubTotals';
// import PromotionCode from './PromotionCode';
import { tieredDeliveryMethods as sampleDeliveryMethods } from 'lib/../../tests/sampleData/deliveryMethods';
import { cart as sampleCart } from 'lib/../../tests/sampleData/cart';

// TODO: Centralise these
window.scrollTo = jest.fn();
window.tippleAnalytics = {
    trigger: jest.fn()
};

const defaultProps = {
    cart: sampleCart,
    displaySurchargePopup: jest.fn(),
    navigateToCheckout: jest.fn(),
    navigateBack: jest.fn(),
    setDeliveryTime: jest.fn(),
    auth: {},
    featureFlags: null,
    deliveryMethods: sampleDeliveryMethods
};

const renderComponent = givenProps => {
    const props = { ...defaultProps, ...givenProps };

    return (
        <Cart
            displaySurchargePopup={props.displaySurchargePopup} 
            cart={props.cart} 
            goToCheckout={props.navigateToCheckout}
            goBack={props.navigateBack}
            setDeliveryTime={props.setDeliveryTime}
            auth={props.auth}
            featureFlags={props.featureFlags}
            deliveryMethods={props.deliveryMethods}
        />
    );
}

it('should render Cart with given props', () => {
    const wrapper = shallow(renderComponent());
    const cartItems = wrapper.find(CartItems);
    // const subTotals = wrapper.find(SubTotals);
    // const promoCode = wrapper.find(PromotionCode);

    expect(cartItems.exists()).toBe(true);
    // expect(subTotals.exists()).toBe(true);
    // expect(promoCode.exists()).toBe(true);
});

// describe('componentDidUpdate', () => {

//     it('should update date to first valid day if tiered delivery enabled and selected date in cart is not a valid tiered delivery day', () => {
//         const cart = {
//             ...sampleCart,
//             deliveryDate: null,
//             deliveryTimeMinutes: 111,
//             deliveryMethodId: sampleDeliveryMethods.items[0].zone.deliveryMethodId
//         };
//         const initialProps = {
//             cart,
//             deliveryMethods: {
//                 isRequesting: true,
//                 hasRequested: false,
//                 items: []
//             }
//         };
//         const wrapper = shallow(renderComponent(initialProps));
//         const instance = wrapper.instance();

//         const updatedProps = {
//             ...defaultProps,
//             ...initialProps,
//             deliveryMethods: {
//                 isRequesting: false,
//                 hasRequested: true,
//                 items: [ ...sampleDeliveryMethods.items ]
//             }
//         };

//         const spySelectFirstValid = jest.spyOn(instance, 'selectFirstValidTieredDeliveryDate');
//         const spyHandleDate = jest.spyOn(instance, 'handleDateSelection');

//         wrapper.setProps(updatedProps);

//         expect(spySelectFirstValid).toHaveBeenCalled();
//         expect(spyHandleDate).toHaveBeenCalledWith(instance.selectedDeliveryMethodId, findFirstValidTieredDeliveryDay(updatedProps.deliveryMethods.items, instance.selectedDeliveryMethodId));
//     });
// });

describe('handleDateSelection', () => {
    // it('should handle date selection with a given deliveryMethodId and set errors to false', async () => {
    //     const deliveryMethodId = 1;
    //     const date = sampleDeliveryMethods.items[0].days[0].date;
    //     const time = sampleDeliveryMethods.items[0].days[0].hours[0].minutes;
    //     const spy = jest.fn();
    //     const givenProps = { setDeliveryTime: spy };

    //     const wrapper = shallow(renderComponent(givenProps));
    //     const instance = wrapper.instance();

    //     const spyDateValid = jest.spyOn(instance, 'isDateValid');

    //     instance.handleDateSelection(deliveryMethodId, date, time);

    //     expect(instance.selectedDeliveryMethodId).toBe(deliveryMethodId);
    //     expect(instance.selectedDate).toBe(date);
    //     expect(instance.selectedTime).toBe(time);

    //     expect(spy).toHaveBeenCalledWith(deliveryMethodId, date, time, defaultProps.auth);
    //     expect(spyDateValid).toHaveBeenCalled();
    //     expect(instance.state.hasErrors).toBe(false);
    // });

    // it('should handle date selection with a date and time', () => {
    //     const date = sampleDeliveryMethods.items[0].days[0].date;
    //     const time = sampleDeliveryMethods.items[0].days[0].hours[0].minutes;
    //     const spy = jest.fn();
    //     const givenProps = { setDeliveryTime: spy };

    //     const wrapper = shallow(renderComponent(givenProps));
    //     const instance = wrapper.instance();

    //     const spyDateValid = jest.spyOn(instance, 'isDateValid');

    //     instance.handleDateOnlySelection(date, time);

    //     expect(instance.selectedDate).toBe(date);
    //     expect(instance.selectedTime).toBe(time);

    //     expect(spy).toHaveBeenCalledWith(null, date, time, defaultProps.auth);
    //     expect(spyDateValid).toHaveBeenCalled();
    //     expect(instance.state.hasErrors).toBe(false);
    // });

    // it('should handle date selection with only a date that has an ASAP time', () => {
    //     const date = sampleStoreTime.days[0].date;
    //     const spy = jest.fn();
    //     const givenProps = { setDeliveryTime: spy };

    //     const wrapper = shallow(renderComponent(givenProps));
    //     const instance = wrapper.instance();

    //     const spyDateValid = jest.spyOn(instance, 'isDateValid');

    //     instance.handleDateOnlySelection(date);

    //     expect(instance.selectedDate).toBe(date);
    //     expect(instance.selectedTime).toBe(ASAP_DELIVERY_TIME);

    //     expect(spy).toHaveBeenCalledWith(null, date, ASAP_DELIVERY_TIME, defaultProps.auth);
    //     expect(spyDateValid).toHaveBeenCalled();
    //     expect(instance.state.hasErrors).toBe(false);
    // });

    // it('should handle date selection with only a date that does not have an ASAP time', () => {
    //     const date = sampleDeliveryMethods.items[0].days[0].date;
    //     const spy = jest.fn();
    //     const givenProps = { setDeliveryTime: spy };

    //     const wrapper = shallow(renderComponent(givenProps));
    //     const instance = wrapper.instance();

    //     const spyDateValid = jest.spyOn(instance, 'isDateValid');

    //     instance.handleDateOnlySelection(date);

    //     expect(instance.selectedDate).toBe(date);
    //     expect(instance.selectedTime).toBe(null);

    //     expect(spy).not.toHaveBeenCalled();
    //     expect(spyDateValid).toHaveBeenCalled();
    //     expect(instance.state.hasErrors).toBe(false);
    // });
});

describe('tiered delivery', () => {
    // it('should update internal selected delivery values if delivery method is changed', () => {
    //     const givenProps = {
    //         cart: {
    //             ...sampleCart,
    //             deliveryDate: null,
    //             deliveryTimeMinutes: null
    //         }
    //     };
    //     const wrapper = shallow(renderComponent(givenProps));
    //     const instance = wrapper.instance();

    //     const spy = jest.spyOn(instance, 'setSelectedDelivery');

    //     expect(instance.selectedDeliveryMethodId).toBe(undefined);  // Doesn't exist in cart object, so will be set to undefined
    //     expect(instance.selectedDate).toBe(null);
    //     expect(instance.selectedTime).toBe(null);

    //     const updatedProps = {
    //         ...defaultProps,
    //         cart: {
    //             ...sampleCart,
    //             deliveryDate: null,
    //             deliveryTimeMinutes: null,
    //             deliveryMethodId: 1
    //         }
    //     };

    //     wrapper.setProps(updatedProps);

    //     expect(spy).toHaveBeenCalledTimes(1);
    //     expect(instance.selectedDeliveryMethodId).toBe(1);
    //     expect(instance.selectedDate).toBe(null);
    //     expect(instance.selectedTime).toBe(null);
    // });

    // Removed for now, ASAP no longer a thing.
    // it('should select most expensive ASAP delivery method if available and none is selected', () => {
    //     const spy = jest.fn();
    //     const givenProps = {
    //         deliveryMethods: {
    //             ...sampleDeliveryMethods,
    //             isRequesting: true,
    //             hasRequested: false
    //         },
    //         featureFlags: {
    //             Tiered_Delivery: 'on'
    //         }
    //     };

    //     const expectedDeliveryMethod = sampleDeliveryMethods.items[1];

    //     const wrapper = shallow(renderComponent(givenProps));
        
    //     expect(spy).not.toHaveBeenCalled();

    //     const updatedProps = {
    //         ...defaultProps,
    //         setDeliveryTime: spy,
    //         featureFlags: {
    //             Tiered_Delivery: 'on'
    //         }
    //     };

    //     wrapper.setProps(updatedProps);

    //     expect(spy).toHaveBeenCalledWith(expectedDeliveryMethod.id, null, null, defaultProps.auth);
    // });

    // it('should select most expensive SHIPPING delivery method instead of ASAP if available and none is selected', () => {
    //     const spy = jest.fn();
    //     const givenProps = {
    //         cart: {
    //             ...sampleCart,
    //             deliveryDate: null,
    //             deliveryTimeMinutes: null
    //         },
    //         deliveryMethods: {
    //             ...sampleWarehouseDeliveryMethods,
    //             isRequesting: true,
    //             hasRequested: false
    //         },
    //         featureFlags: {
    //             Tiered_Delivery: 'on'
    //         }
    //     };

    //     const expectedDeliveryMethod = sampleWarehouseDeliveryMethods.items[0];

    //     const wrapper = shallow(renderComponent(givenProps));
        
    //     expect(spy).not.toHaveBeenCalled();

    //     const updatedProps = {
    //         ...defaultProps,
    //         ...givenProps,
    //         setDeliveryTime: spy,
    //         deliveryMethods: {
    //             ...sampleWarehouseDeliveryMethods,
    //             isRequesting: false,
    //             hasRequested: true
    //         }
    //     };

    //     wrapper.setProps(updatedProps);

    //     expect(spy).toHaveBeenCalledWith(expectedDeliveryMethod.id, null, null, defaultProps.auth);
    // });

    // it('should fetch deliveryMethods from API if the user zone changes', () => {
    //     const spy = jest.fn();
    //     const givenProps = {
    //         addressZoneId: 1,
    //         deliveryMethodActions: {
    //             list: spy
    //         }
    //     };

    //     const wrapper = shallow(renderComponent(givenProps));

    //     expect(spy).not.toHaveBeenCalled();

    //     const updatedProps = {
    //         ...givenProps,
    //         addressZoneId: 2
    //     };

    //     wrapper.setProps(updatedProps);

    //     expect(spy).toHaveBeenLastCalledWith(defaultProps.auth, { zoneId: updatedProps.addressZoneId });
    // });
});

describe('checkout', () => {
    // it('should fail to checkout if tiered delivery is enabled and no method has been selected', () => {
    //     const spy = jest.fn();
    //     const givenProps = {
    //         featureFlags: {
    //             Tiered_Delivery: 'on'
    //         },
    //         navigateToCheckout: spy
    //     };
    //     const wrapper = shallow(renderComponent(givenProps));
    //     const instance = wrapper.instance();

    //     instance.checkout();

    //     expect(instance.errors.deliveryOption).toBe(true);
    //     expect(instance.errors.deliveryTime).not.toBe(true);
    //     expect(instance.state.hasErrors).toBe(true);
    //     expect(spy).not.toHaveBeenCalled();
    // });

    // it('should fail to checkout if tiered delivery is enabled and delivery method is selected but date is not valid', () => {
    //     const spy = jest.fn();
    //     const givenProps = {
    //         featureFlags: {
    //             Tiered_Delivery: 'on'
    //         },
    //         navigateToCheckout: spy,
    //         cart: { ...sampleCart, deliveryMethodId: 1 }
    //     };
    //     const wrapper = shallow(renderComponent(givenProps));
    //     const instance = wrapper.instance();

    //     instance.checkout();

    //     expect(instance.errors.deliveryOption).not.toBe(true);
    //     expect(instance.errors.deliveryTime).toBe(true);
    //     expect(instance.state.hasErrors).toBe(true);
    //     expect(spy).not.toHaveBeenCalled();
    // });

    // it('should fail to checkout and display surcharge popup if minimum spend not met', () => {
    //     const spyCheckout = jest.fn();
    //     const spySurcharge = jest.fn();
    //     const givenProps = {
    //         navigateToCheckout: spyCheckout,
    //         displaySurchargePopup: spySurcharge,
    //         cart: {
    //             ...sampleCart,
    //             deliveryDate: sampleDeliveryMethods.items[0].days[0].date,
    //             deliveryTimeMinutes: 960,
    //             deliveryMethodId: sampleDeliveryMethods.items[0].zone.deliveryMethodId
    //         }
    //     };
    //     const wrapper = shallow(renderComponent(givenProps));
    //     const instance = wrapper.instance();

    //     instance.checkout();

    //     // expect(instance.errors.deliveryOption).not.toBe(true);
    //     expect(instance.errors.deliveryTime).not.toBe(true);
    //     expect(instance.state.hasErrors).toBe(false);

    //     expect(spySurcharge).toHaveBeenCalled();
    //     expect(spyCheckout).not.toHaveBeenCalled();
    // });

    // it('should checkout if date selection valid and minimum spend met', () => {
    //     const spyCheckout = jest.fn();
    //     const spySurcharge = jest.fn();
    //     const givenProps = {
    //         navigateToCheckout: spyCheckout,
    //         displaySurchargePopup: spySurcharge,
    //         cart: {
    //             ...sampleCart,
    //             subTotal: 50.000,
    //             deliveryDate: sampleDeliveryMethods.items[0].days[0].date,
    //             deliveryTimeMinutes: 960,
    //             deliveryMethodId: sampleDeliveryMethods.items[0].zone.deliveryMethodId
    //         }
    //     };
        
    //     const wrapper = shallow(renderComponent(givenProps));
    //     const instance = wrapper.instance();

    //     instance.checkout();

    //     expect(instance.errors.deliveryOption).not.toBe(true);
    //     expect(instance.errors.deliveryTime).not.toBe(true);
    //     expect(instance.state.hasErrors).toBe(false);

    //     expect(spySurcharge).not.toHaveBeenCalled();
    //     expect(spyCheckout).toHaveBeenCalled();
    // });
});

// describe('checkout user flow', () => {
//     it('should revert to next available day and the first time if user previously has Today and ASAP and they are no longer available (eg. store closed)', () => {
//         const cart = {
//             ...sampleCart,
//             deliveryDate: sampleStoreTime.days[0].date,
//             deliveryTimeMinutes: -1
//         };
        
//         const afterHoursStoreTime = {
//             intervalMinutes: 30,
//             days: sampleStoreTime.days.filter(day => day.label !== 'Today')
//         };
//         const spyCheckout = jest.fn();
//         const initialProps = {
//             cart,
//             storeTime: {
//                 isRequestingItem: true,
//                 hasRequested: false,
//                 item: afterHoursStoreTime
//             },
//             goToCheckout: spyCheckout
//         };
//         const wrapper = shallow(renderComponent(initialProps));
//         const instance = wrapper.instance();

//         const updatedProps = {
//             ...defaultProps,
//             ...initialProps,
//             storeTime: {
//                 isRequestingItem: false,
//                 hasRequested: true,
//                 item: afterHoursStoreTime
//             }
//         };

//         const spyDateInOptions = jest.spyOn(instance, 'isDateInOptions');
//         const spyHandleDate = jest.spyOn(instance, 'handleDateOnlySelection');

//         wrapper.setProps(updatedProps);

//         expect(spyDateInOptions).toHaveBeenCalledWith(cart.deliveryDate, cart.deliveryTimeMinutes);
//         expect(spyHandleDate).toHaveBeenCalledWith(afterHoursStoreTime.days[0].date, null);

//         const dateValid = instance.isDateValid();
//         expect(dateValid).toBe(false);

//         instance.checkout();

//         expect(instance.errors.deliveryTime).toBe(true);
//         expect(instance.state.hasErrors).toBe(true);

//         expect(spyCheckout).not.toHaveBeenCalled();
//     });
// });

describe('boolean check functions', () => {
    // TODO
});

