import { Selector, t } from 'testcafe';
import * as util from '../util';

export default class ProductsPage {
    constructor() {
        this.productQuantityUpButton = Selector('button.btn-pack.right');
        this.productAddButton = Selector('button.add');

        this.goToCartButton = Selector('#gotoCart');
        this.cartItemCount = Selector('#cartItemCount');
    }

    async incrementProductQty(times = 1) {
        for (let i = 0; i < times; i++) {
            await t
                .click(this.productQuantityUpButton);
        }
    }

    async addProductToCart() {
        await t
            .click(this.productAddButton);
    }

    async goToCart() {
        await t
            .click(this.goToCartButton);
    }
};
