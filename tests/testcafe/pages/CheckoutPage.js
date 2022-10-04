import { Selector, t } from 'testcafe';

export default class CartPage {
    constructor() {
        this.firstNameInput = Selector('#firstName');
        this.lastNameInput = Selector('#lastName');
        this.emailInput = Selector('#email');
        this.mobileInput = Selector('#mobile');
        this.passwordInput = Selector('#password');
        this.dobInput = Selector('#dob');

        this.paymentOptionCC = Selector('.braintree-option__card');

        this.paymentCCName = Selector('#braintree__card-view-input__cardholder-name');
        this.paymentCCNumber= Selector('#credit-card-number');
        this.paymentCCExpiry = Selector('#expiration');
        this.paymentCCCVV = Selector('#cvv');

        this.changeDeliveryButton = Selector('#checkoutChangeDeliveryBtn');
        this.placeOrderButton = Selector('#placeOrderBtn');
    }

    async enterUserDetails(user) {
        await t
            .typeText(this.firstNameInput, user.firstName)
            .typeText(this.lastNameInput, user.lastName)
            .typeText(this.emailInput, user.email)
            .typeText(this.mobileInput, user.mobile)
            .typeText(this.passwordInput, user.password)
            .typeText(this.dobInput, user.dateOfBirth);
    }

    async enterCreditCardDetails(cc) {
        await t
            .wait(3000)
            .click(this.paymentOptionCC)
            .typeText(this.paymentCCName, cc.name)
            .switchToIframe('#braintree-hosted-field-number')
            .typeText(this.paymentCCNumber, cc.number)
            .switchToMainWindow()
            .switchToIframe('#braintree-hosted-field-expirationDate')
            .typeText(this.paymentCCExpiry, cc.expiry)
            .switchToMainWindow()
            .switchToIframe('#braintree-hosted-field-cvv')
            .typeText(this.paymentCCCVV, cc.cvv)
            .switchToMainWindow();
    }

    async placeOrder() {
        await t
            .click(this.placeOrderButton)
            .wait(10000);
    }

    async changeDelivery() {
        await t
            .click(this.changeDeliveryButton);
    }
};
