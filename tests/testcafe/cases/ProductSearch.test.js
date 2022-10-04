import testConfig from '../testConfig';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';
import * as util from '../util';

fixture `Product Search tests`
    .page `${testConfig.baseUrl}`;

test('should nagivate to product categories when a valid address entered', async t => {
    const homePage = new HomePage();

    const validAddress = '146 Chapel St St Kilda';

    await homePage.searchForAndSelectAddress(validAddress);
    await homePage.confirmAddress();

    await t.expect(util.getLocation()).contains('/bottleshop');
});

test('should prompt for an email address for an address Tipple do not deliver to', async t => {
    const homePage = new HomePage();

    const invalidAddress = '1 Come By Chance Road';

    await homePage.searchForAndSelectAddress(invalidAddress);

    // Expect
    await homePage.isInvalidAddress();
});

test('should modify products in cart from product search screen', async t => {
    const homePage = new HomePage();
    const productsPage = new ProductsPage();
    const cartPage = new CartPage();

    const validAddress = '146 Chapel St St Kilda';

    // Enter a valid address to get to the products page
    await homePage.searchForAndSelectAddress(validAddress);
    await homePage.confirmAddress();

    await t.expect(util.getLocation()).contains('/bottleshop');

    // Search for some Veeeeeee Bee, mate.
    await productsPage.viewAllProducts();
    await productsPage.searchForProducts('victoria');

    await t.expect(productsPage.firstProductResult.exists).ok();
    await t.expect(productsPage.cartItemCount.textContent).eql('0');

    await productsPage.addFirstProductToCart();

    await t.expect(productsPage.cartItemCount.textContent).eql('1');

    // Move to the cart
    await productsPage.goToCart();

    await t.expect(cartPage.cartFirstItemQuantity.textContent).eql('1');
    await cartPage.incrementCartFirstItemQty(2);
    await t.expect(cartPage.cartFirstItemQuantity.textContent).eql('3');
    await t.wait(2000);

    await cartPage.decrementCartFirstItemQty(1);
    await t.expect(cartPage.cartFirstItemQuantity.textContent).eql('2');
    await t.wait(2000);

    await cartPage.incrementCartFirstItemQty(1);
    await t.expect(cartPage.cartFirstItemQuantity.textContent).eql('3');
    await t.wait(2000);

    await cartPage.decrementCartFirstItemQty(2);
    await t.expect(cartPage.cartFirstItemQuantity.textContent).eql('1');

    await t.wait(2000);

    await cartPage.removeCartFirstItem();
    await t.expect(cartPage.cartFirstItem.exists).notOk();
});
