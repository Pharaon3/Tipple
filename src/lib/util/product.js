export const productUrlFromSlug = slug => `https://tipple.com.au/product/${slug}`;

export const getProductPricing = (product) => {
    if (!product) {
        return {};
    }
    
    let price = 0;
    let salePrice = 0;
    let onSale = false;

    // FIXME: This probably shouldn't be here, if this is a UI component it should be passed these details?
    if (product?.defaultPack) {
        salePrice = product?.defaultPack?.salePrice;
        price = product?.defaultPack?.price;
    
        onSale = salePrice !== 0;
    } else {
        salePrice = product?.salePrice;
        price = product?.price;

        onSale = salePrice > 0;
    }

    return {
        price,
        salePrice,
        onSale
    };
};

export default {
    productUrlFromSlug,
    getProductPricing
};