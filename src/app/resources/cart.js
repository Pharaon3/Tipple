export function getDescriptiveProductPackName(packSize) {

    if (packSize === 1) {
        return 'Single';
    } else if (packSize > 1) {
        return packSize + ' Pack';
    }

    return null;
}

export function getSalePrice(salePrice, price) {
    if (salePrice === 0) {
        return price;
    } else {
        return salePrice;
    }
}

export function getTotalPrice(salePrice, price, quantity) {
    if (salePrice === 0) {
        return price * quantity;
    } else {
        return salePrice * quantity;
    }
}