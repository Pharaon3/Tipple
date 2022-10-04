
const dateTemplate = 'YEAR-MONTH-DAYTHOUR:MIN:00Z';

const leadingZero = number => {
    return number >= 10 ? number : '0'.concat(number);
};

// TODO: Allow this to add days, or many hours that are divided by hours in a day.
const orderDate = (addHours = 0, addMinutes = 0) => {
    const today = new Date();

    let returnDate = String(dateTemplate);
    let newMinutes = today.getMinutes() + addMinutes;
    const newMonth = today.getMonth() + 1;

    if (newMinutes >= 60) {
        addHours += 1;
        newMinutes -= 60;
    }

    returnDate = returnDate.replace('YEAR', today.getFullYear());
    returnDate = returnDate.replace('MONTH', leadingZero(newMonth));
    returnDate = returnDate.replace('DAY', leadingZero(today.getDate()));
    returnDate = returnDate.replace('HOUR', leadingZero(today.getHours() + addHours));
    returnDate = returnDate.replace('MIN', leadingZero(addMinutes));

    return returnDate;
};

export const orderTracking = {
    isRequestingItem: false,
    hasRequested: true,
    item: {
        "start": orderDate(),
        "due": orderDate(0, 30),
        "status": "PENDING",
        "type": "FUTURE",
        "deliveryType": "FUTURE",
        "estimatedDeliverySeconds": 3643,
        "addressId": 122590,
        "address": {
            "id": 122590,
            "userId": 51,
            "addressLine1": "300 Collins St",
            "city": "Melbourne",
            "state": "Victoria",
            "country": "AU",
            "postcode": "3000",
            "lat": -37.81597000,
            "lng": 144.96422500,
            "gift": false,
            "lastUsed": 1,
            "createdDate": "2019-05-10T01:02:38Z",
            "updatedDate": "2019-05-10T01:02:41Z",
            "formattedAddress": "300 Collins St, Melbourne, Victoria, 3000"
        },
        "isTippleTracking": true
    }
};

export const generateSampleOrderIn = (hours, minutes) => {
    let generatedOrder = { ...orderTracking };
    generatedOrder.item.start = orderDate(hours, minutes);
    if (minutes + 30 > 60) {
        generatedOrder.item.due = orderDate(hours + 1, 60 - minutes);
    } else {
        generatedOrder.item.due = orderDate(hours, minutes);
    }

    generatedOrder.item.estimatedDeliverySeconds = Math.ceil((new Date(generatedOrder.item.due) - new Date(orderDate())) / 1000);

    return generatedOrder;
};

export default {
    orderTracking,
    generateSampleOrderIn
};