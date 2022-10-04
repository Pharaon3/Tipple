import { Selector, t } from 'testcafe';
import AddressUnserviceableModal from '../modals/AddressUnserviceableModal';
import LoginModal from '../modals/LoginModal';

export default class HomePage {
    constructor() {
        this.addressSearchInput = Selector('.landing-address-search .search-address');
        this.firstAddressResult = Selector('.landing-address-search .autocomplete-dropdown-container .suggestion-item:first-of-type');
        this.confirmAddressButton = Selector('#confirmAddressContinueBtn');

        this.loginLink = Selector('#homeLoginLink');
        this.loginModal = new LoginModal();

        this.userAccountButton = Selector('.user-login');
        this.userLogoutButton = Selector('.user-logout');

        this.mostRecentAddress = Selector('.recent-addresses > div:first-of-type');

        this.addressUnserviceableModal = new AddressUnserviceableModal();
    }

    async searchForAndSelectAddress(address) {
        await t
            .typeText(this.addressSearchInput, address)
            .click(this.firstAddressResult);
    }

    async confirmAddress() {
        await t
            .click(this.confirmAddressButton);
    }

    async isInvalidAddress() {
        await this.addressUnserviceableModal.isOpen();
    }

    async openLogin() {
        await t
            .click(this.loginLink);
    }

    async logout() {
        await t
            .click(this.userAccountButton)
            .click(this.userLogoutButton);
    }

    async enterLoginDetails(login) {
        await t
            .typeText(this.loginModal.emailInput, login.email)
            .typeText(this.loginModal.passwordInput, login.password)
            .click(this.loginModal.loginSubmitButton);
    }

    async selectMostRecentOrderAddress() {
        await t
            .click(this.mostRecentAddress);
    }
};
