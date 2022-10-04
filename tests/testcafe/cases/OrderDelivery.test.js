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

const validAddress = '180 Collins St';

fixture `Standard delivery checkout tests`
    .page `${testConfig.baseUrl}`
    .beforeEach(async t => {
        // Enter a valid address to get to the products page
        await homePage.searchForAndSelectAddress(validAddress);
        await homePage.confirmAddress();
    
        await t.expect(util.getLocation()).contains('/bottleshop');
    
        // Get us some Veeeeeee Bee, mate.
        await productsPage.viewAllProducts();
        await productsPage.searchForProducts('victoria');
    
        await t.expect(productsPage.firstProductResult.exists).ok();
        await t.expect(productsPage.cartItemCount.textContent).eql('0');
    
        // Add multiples to avoid the minimum order limitation
        await productsPage.incrementFirstProductQty(5);
        await productsPage.addFirstProductToCart();
    
        await t.expect(productsPage.cartItemCount.textContent).eql('6');
    
        await productsPage.goToCart();
        await t.expect(util.getLocation()).contains('/cart');
    });

// test('should complete order using standard delivery', async t => {
//     await t.expect(cartPage.standardDeliveryDaySelect.visible).ok();
//     await t.expect(cartPage.standardDeliveryTimeSelect.visible).ok();
//     await t.expect(cartPage.tieredDeliveryOptions.exists).notOk(); 

//     await cartPage.openStandardDeliveryDayOptions();
//     await t.expect(cartPage.standardDeliveryDayOptions.count).gte(1);
//     await cartPage.selectStandardDeliveryDayOption(1);

//     await cartPage.openStandardDeliveryTimeOptions();
//     await t.expect(cartPage.standardDeliveryTimeOptions.count).gte(1);
//     await cartPage.selectStandardDeliveryTimeOption(1);

//     await cartPage.checkout();

//     await t.expect(util.getLocation()).contains('/checkout');

//     await checkoutPage.enterUserDetails(util.userWithUniqueEmail(testConfig.testUser));
//     await checkoutPage.enterCreditCardDetails(testConfig.testUser.cc);

//     await checkoutPage.placeOrder();

//     await t.expect(util.getLocation()).contains('order/');
//     await t.expect(util.getLocation()).contains('/tracking');
// });
