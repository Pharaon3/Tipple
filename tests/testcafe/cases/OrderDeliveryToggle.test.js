import testConfig from '../testConfig';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';
import * as util from '../util';

const homePage = new HomePage();
const productsPage = new ProductsPage();
const cartPage = new CartPage();

const tieredDeliveryAddress = '670 Chapel St St Kilda';
const standardDeliveryAddress = '180 Collins St';

fixture `Tiered delivery toggle tests`
    .page `${testConfig.baseUrl}`
    .beforeEach(async t => {
        // Need to navigate to the page again to ensure cookies are picked up.
        // https://github.com/DevExpress/testcafe/issues/2894
        await t.navigateTo(testConfig.baseUrl);

        // Enter a valid address to get to the products page
        await homePage.searchForAndSelectAddress(tieredDeliveryAddress);
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

        await t.expect(cartPage.tieredDeliveryOptions.exists).ok();
        await t.expect(cartPage.standardDeliveryDaySelect.exists).notOk();
        await t.expect(cartPage.standardDeliveryTimeSelect.exists).notOk();
    });

// test('should render correct delivery option when toggling between zones', async t => {
//     await cartPage.changeAddress();
//     await cartPage.searchForAndSelectAddress(standardDeliveryAddress);
//     await cartPage.confirmAddress();

//     await t.expect(cartPage.standardDeliveryDaySelect.visible).ok();
//     await t.expect(cartPage.standardDeliveryTimeSelect.visible).ok();
//     await t.expect(cartPage.tieredDeliveryOptions.exists).notOk(); 

//     await cartPage.changeAddress();
//     await cartPage.searchForAndSelectAddress(tieredDeliveryAddress);
//     await cartPage.confirmAddress();

//     await t.expect(cartPage.standardDeliveryDaySelect.exists).notOk();
//     await t.expect(cartPage.standardDeliveryTimeSelect.exists).notOk();
//     await t.expect(cartPage.tieredDeliveryOptions.visible).ok(); 

// });
