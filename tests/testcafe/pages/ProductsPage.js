import { Selector, t } from 'testcafe';
import * as util from '../util';

export default class ProductsPage {
    constructor() {
        this.productCategoryTiles = Selector('#categories section:first-of-type a');
        this.beerCategoryTile = this.productCategoryTiles.find(':first-of-type');
        this.productSearchInput = Selector('#productSearch');
        this.firstProductResult = Selector('.products-list a:first-of-type');
        this.firstProductQuantityUpButton = this.firstProductResult.find('button.btn-pack.right');
        this.firstProductAddButton = this.firstProductResult.find('button.add');

        this.goToCartButton = Selector('#gotoCart');
        this.cartItemCount = Selector('#cartItemCount');
    }

    async viewBeer() {
        await t
            .click(this.beerCategoryTile);
    }

    async viewAllProducts() {
        this.viewBeer();
    }

    async searchForProducts(searchText) {
        await t
            .typeText(this.productSearchInput, searchText);
    }

    async incrementFirstProductQty(times = 1) {
        for (let i = 0; i < times; i++) {
            await t
                .click(this.firstProductQuantityUpButton);
        }
    }

    async addFirstProductToCart() {
        await t
            .click(this.firstProductAddButton);
    }

    async goToFirstProduct() {
        await t
            .click(this.firstProductResult);
    }

    async goToCart() {
        await t
            .click(this.goToCartButton);
    }
};
