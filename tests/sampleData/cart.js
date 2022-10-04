export const cart = {
    address: {
        formattedAddress: '300 Collins St, Melbourne, Victoria, 3000',
        cartId: 324236,
        addressLine1: '300 Collins St',
        city: 'Melbourne',
        state: 'Victoria',
        country: 'AU',
        postcode: '3000',
        lat: -37.81597000,
        lng: 144.96422500,
        createdDate: '2019-05-06T01:00:59Z',
        updatedDate: '2019-05-06T04:58:27Z',
        storeId: 10,
        zoneId: 33
    },
    discounts: [],
    items: [],
    charges: [
        {
            cartId: 324236,
            id: 1,
            chargeType: 'DELIVERY',
            name: 'Delivery Fee',
            description: '',
            amountType: 'VALUE',
            amount: 7.9500,
            globalCharge: true,
            status: 'ACTIVE',
            createdDate: '2017-07-03T05:15:59Z',
            updatedDate: '2018-04-02T14:10:54Z'
        }
    ],
    lineItems: [
        {
            type: 'SUBTOTAL',
            name: 'Sub Total',
            value: 0.0000
        },
        {
            type: 'CHARGE',
            name: 'Minimum Order Surcharge',
            description: 'Minimum Order Value ¤30.00',
            value: 30.0000
        },
        {
            type: 'DELIVERY',
            name: 'Delivery Fee',
            description: '',
            value: 7.9500
        }
    ],
    storePath: '/bottleshop/victoria/melbourne',
    id: 324236,
    storeId: 10,
    subTotal: 0.0000,
    total: 37.9500,
    chargeTotal: 7.9500,
    surcharge: 0.0000,
    serviceFee: 0.0000,
    minSpend: 30.0000,
    abandoned: false,
    containsTobacco: false,
    createdDate: '2019-05-06T01:00:59Z',
    updatedDate: '2019-05-06T04:58:36Z',
    promoCodeId: 0,
    creditUsed: 0.0000,
    promoCode: '',
    deviceIdentifier: '7db78dec-d796-4409-b33b-ff24228d8665',
    userIdentifier: 'fcdce39a-ddb0-42b7-9617-bc224eb78502',
    deliveryDate: '2019-05-06T00:00:00Z',
    deliveryTimeMinutes: -1
};

export const item = {
    "id": 78763,
    "productId": 4916,
    "productName": "Silence of the Lamb Shiraz",
    "productPackId": 819701,
    "packSize": 1,
    "quantity": 1,
    "price": 25.9900,
    "salePrice": 0.0,
    "slug": "silence-of-the-lamb-shiraz",
    "reason": null,
    "primaryImage": {
        "productId": 4916,
        "src": "SilLambShz.png",
        "title": "",
        "alt": ""
    },
    "primaryImageSrc": "https://content.tipple.xyz/tipple/products/SilLambShz.png",
    "collectionSlug": null,
    "groupRef": null,
    "bundleReferencePath": null,
    "bundleItems": []
};

export default {
    cart,
    item
};