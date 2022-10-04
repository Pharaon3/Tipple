import { getProductPricing } from './product';

it('should return an empty object if not given a product object', () => {
    const pricing = getProductPricing();

    expect(pricing).toEqual({});
});

it('should return price when given a product without a defaultPack', () => {
    const givenProduct = {
        defaultPack: null,
        price: 1.23,
        salePrice: null
    };
    const pricing = getProductPricing(givenProduct);

    expect(pricing.price).toEqual(givenProduct.price);
    expect(pricing.salePrice).toEqual(null);
    expect(pricing.onSale).toBe(false);
});

it('should return price when given a product on sale without a defaultPack', () => {
    const givenProduct = {
        defaultPack: null,
        price: 11.23,
        salePrice: 8.99
    };
    const pricing = getProductPricing(givenProduct);

    expect(pricing.price).toEqual(givenProduct.price);
    expect(pricing.salePrice).toEqual(givenProduct.salePrice);
    expect(pricing.onSale).toBe(true);
});

it('should return pricing data when given a product with a defaultPack', () => {
    const givenProduct = {
        defaultPack: {
            price: 11.9900,
            salePrice: 0
        },
        price: 9.99,
        salePrice: 7.99
    };
    const pricing = getProductPricing(givenProduct);

    expect(pricing.price).toEqual(givenProduct.defaultPack.price);
    expect(pricing.salePrice).toEqual(0);
    expect(pricing.onSale).toBe(false);
});

it('should return pricing data when given a product on sale with a defaultPack', () => {
    const givenProduct = {
        defaultPack: {
            price: 11.99,
            salePrice: 9.50
        },
        price: 9.99,
        salePrice: 7.99
    };
    const pricing = getProductPricing(givenProduct);

    expect(pricing.price).toEqual(givenProduct.defaultPack.price);
    expect(pricing.salePrice).toEqual(givenProduct.defaultPack.salePrice);
    expect(pricing.onSale).toBe(true);
});