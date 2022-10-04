import testConfig from '../testConfig';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import * as util from '../util';

const homePage = new HomePage();
const productsPage = new ProductsPage();
const productPage = new ProductPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

const testAddresses = [
    '300 collins st melb',
    '200 pitt st sydney'
];

testAddresses.forEach(address => {
    fixture `Tiered delivery checkout tests for address '${address}'`
        .page `${testConfig.baseUrl}`
        .beforeEach(async t => {
            // Need to navigate to the page again to ensure cookies are picked up.
            // https://github.com/DevExpress/testcafe/issues/2894
            await t.navigateTo(testConfig.baseUrl);

            // Enter a valid address to get to the products page
            await homePage.searchForAndSelectAddress(address);
            await homePage.confirmAddress();
        
            await t.expect(util.getLocation()).contains('/bottleshop');
        
            // Get us some Veeeeeee Bee, mate.
            await productsPage.viewBeer();
            await productsPage.searchForProducts('victoria');
        
            await t.expect(productsPage.firstProductResult.exists).ok();
            // await t.expect(productsPage.cartItemCount.textContent).eql('0');
        
            // Add multiples to avoid the minimum order limitation
            // await productsPage.incrementFirstProductQty(5);
            // await productsPage.addFirstProductToCart();
            await productsPage.goToFirstProduct();
            await t.expect(util.getLocation()).contains('/product');

            await productPage.incrementProductQty(5);
            await productPage.addProductToCart();
        
            await t.expect(productsPage.cartItemCount.textContent).eql('6');
        
            await productsPage.goToCart();
            await t.expect(util.getLocation()).contains('/cart');

            await t.expect(cartPage.tieredDeliveryOptions.exists).ok();
            await t.expect(cartPage.standardDeliveryDaySelect.exists).notOk();
            await t.expect(cartPage.standardDeliveryTimeSelect.exists).notOk();
        })
        .afterEach(async t => {
            await checkoutPage.enterUserDetails(util.userWithUniqueEmail(testConfig.testUser));
            await checkoutPage.enterCreditCardDetails(testConfig.testUser.cc);
        
            await checkoutPage.placeOrder();
        
            await t.expect(util.getLocation()).contains('track/');
        })

        // Order for today - only time is selected, day is today (obviously)
        test('should complete order using order for today', async t => {
            await cartPage.selectTieredToday();
            await t.expect(cartPage.errorMessageDeliveryOption.exists).notOk();
        
            await t.expect(cartPage.tieredDeliveryDatePicker.exists).notOk();
            await t.expect(cartPage.tieredDeliveryTimePicker.exists).ok();
        
            await cartPage.checkout();
            await t.expect(cartPage.errorMessageDeliveryTime.exists).ok();
        
            await cartPage.selectTieredDeliveryTime();
            await t.expect(cartPage.errorMessageDeliveryTime.exists).notOk();
        
            await cartPage.checkout();
        
            await t.expect(util.getLocation()).contains('/checkout');
        });
        
        // test('should complete order using order ahead', async t => {
        //     await cartPage.selectTieredAhead();
        //     await t.expect(cartPage.errorMessageDeliveryOption.exists).notOk();
        
        //     await t.expect(cartPage.tieredDeliveryDatePicker.exists).notOk();
        //     await t.expect(cartPage.tieredDeliveryTimePicker.exists).notOk();
        
        //     await cartPage.checkout();
        
        //     await t.expect(util.getLocation()).contains('/checkout');
        // });
        
        test('should complete order using order ahead', async t => {
            await cartPage.selectTieredAhead();
        
            await t.expect(cartPage.tieredDeliveryDatePicker.exists).ok();
            await t.expect(cartPage.tieredDeliveryTimePicker.exists).ok();
        
            await cartPage.selectTieredDeliveryDay(3);
        
            await cartPage.checkout();
            await t.expect(cartPage.errorMessageDeliveryTime.exists).ok();
        
            await cartPage.selectTieredDeliveryTime();
            await t.expect(cartPage.errorMessageDeliveryTime.exists).notOk();
        
            await cartPage.checkout();
        
            await t.expect(util.getLocation()).contains('/checkout');
        });
        
        test('should validate tiered delivery options correctly when moving between cart and checkout pages', async t => {
            // Select the options correctly to start
            await cartPage.selectTieredAhead();
            await cartPage.selectTieredDeliveryDay(3);
            await cartPage.selectTieredDeliveryTime(1);
        
            await cartPage.checkout();
            await t.expect(util.getLocation()).contains('/checkout');
            await checkoutPage.changeDelivery();
        
            // After coming back from the checkout page and reselecting an option, should fail validation
            await cartPage.selectTieredAhead();
            await cartPage.checkout();
        
            await t.expect(cartPage.errorMessageDeliveryTime.exists).ok();
        
            await cartPage.selectTieredDeliveryDay(3);
            await cartPage.selectTieredDeliveryTime(0);
            await t.expect(cartPage.errorMessageDeliveryTime.exists).notOk();
        
            await cartPage.checkout();
            await t.expect(util.getLocation()).contains('/checkout');
        });
    }
);
