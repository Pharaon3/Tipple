
const findDeliveryMethod = (deliveryMethods = [], deliveryMethodId = null) => deliveryMethods.find(dm => dm.id === deliveryMethodId);

const hasTimesForDeliveryDay = (deliveryDay = {}) => deliveryDay && deliveryDay.hours && deliveryDay.hours.length > 0;

const isValidTimeForDeliveryDay = (deliveryDay = {}, time) => {
    if (deliveryDay && deliveryDay.hours) {
        const deliveryTime = deliveryDay.hours.find(hour => time === hour.minutes);
        return deliveryTime ? true : false;
    }

    return false;
};

/**
 * ASAP is for today only, and is the first option with -1 as its minutes value.
 */
export const hasAsap = (date, dayOptions = []) => {
    return dayOptions && 
        dayOptions.length > 0 &&
        dayOptions[0].hours && 
        dayOptions[0].hours.length > 0 && 
        dayOptions[0].hours[0].minutes === -1 &&
        date === dayOptions[0].date;
};

/**
 * Confirm a tiered delivery date is valid based on the methods given.
 */
export const isTieredDeliveryDateValid = (deliveryMethods, deliveryMethodId, date, time) => {
    if (!deliveryMethods) {
        return false;
    }

    const deliveryMethod = findDeliveryMethod(deliveryMethods, deliveryMethodId);
    const type = deliveryMethod ? deliveryMethod.deliveryType : null;

    if (type === 'SHIPPING' || type === 'ASAP') {
        return true;
    }

    if (type === 'FUTURE' && date) {
        const deliveryDay = deliveryMethod.days.find(day => day.date === date);

        if (time && hasTimesForDeliveryDay(deliveryDay) && isValidTimeForDeliveryDay(deliveryDay, time)) {
            return true;
        } else {
            return false;
        }
    }

    return false;
};

/**
 * Confirm a selected delivery date has valid hours in the given set of delivery methods.
 * Returns true if:
 * - deliveryMethod.type is FUTURE, a date is given, that date appears in the list of days 
 *   and the day it matches has delivery hours available for selection
 */
export const isTieredDeliveryDateSelectionValid = (deliveryMethods, deliveryMethodId, date) => {
    if (!deliveryMethods) {
        return false;
    }

    const deliveryMethod = findDeliveryMethod(deliveryMethods, deliveryMethodId);
    const type = deliveryMethod ? deliveryMethod.deliveryType : null;

    if (type === 'FUTURE' && date) {
        const deliveryDay = deliveryMethod.days.find(day => day.date === date);

        if (deliveryDay && hasTimesForDeliveryDay(deliveryDay)) {
            return true;
        } else {
            return false;
        }
    }

    return false;
};

export const findFirstValidTieredDeliveryDay = (deliveryMethods, deliveryMethodId) => {
    if (!deliveryMethods) {
        return null;
    }

    const deliveryMethod = findDeliveryMethod(deliveryMethods, deliveryMethodId);

    if (deliveryMethod) {
        const firstValidDay = deliveryMethod.days.find(day => day.hours && day.hours.length > 0);
        return firstValidDay ? firstValidDay.date : null;
    }

    return null;
};

export default {
    hasAsap,
    isTieredDeliveryDateValid
};