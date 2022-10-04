import testConfig from '../testConfig';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import * as util from '../util';

const homePage = new HomePage();
const productsPage = new ProductsPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

const promoCode = 'TEAMTIPPLE';
const validAddress = '300 collins';

fixture `User login and order tests`
    .page `${testConfig.baseUrl}`;

test('should login successfully, apply a promo code and complete an order as a logged in user', async t => {
    await t.expect(homePage.userAccountButton.exists).notOk();

    await homePage.openLogin();
    await homePage.enterLoginDetails(testConfig.loginUser);

    await t.expect(homePage.userAccountButton.exists).ok();

    await homePage.searchForAndSelectAddress(validAddress);
    await homePage.confirmAddress();

    await t.expect(util.getLocation()).contains('/bottleshop');

    await productsPage.viewAllProducts();
    await productsPage.searchForProducts('victoria');
    await productsPage.incrementFirstProductQty(5);
    await productsPage.addFirstProductToCart();

    await productsPage.goToCart();
    await t.expect(util.getLocation()).contains('/cart');

    await cartPage.selectTieredToday();
    await cartPage.selectTieredDeliveryTime();

    // await cartPage.openStandardDeliveryDayOptions();
    // await cartPage.selectStandardDeliveryDayOption(1);
    // await cartPage.openStandardDeliveryTimeOptions();
    // await cartPage.selectStandardDeliveryTimeOption(1);

    await cartPage.clickPromoCode();
    await t.expect(cartPage.promoInput.exists).ok();
    await cartPage.applyPromoCode(promoCode);

    await t.expect(cartPage.discount.textContent).contains(`Promo Code: ${promoCode}`);

    await cartPage.checkout();

    await t.expect(util.getLocation()).contains('/checkout');

    await t.wait(8000);     // Payment form needs time to load
    await checkoutPage.placeOrder();

    await t.expect(util.getLocation()).contains('track/');

    await homePage.logout();
    await t.expect(homePage.userAccountButton.exists).notOk();
});
