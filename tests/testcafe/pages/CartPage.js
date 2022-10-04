import { Selector, t } from 'testcafe';
import AddressUnserviceableModal from '../modals/AddressUnserviceableModal';

export default class CartPage {
    constructor() {
        this.standardDeliveryDaySelect = Selector('.day-select');
        this.standardDeliveryDayOptions = this.standardDeliveryDaySelect.find('.ui-dropdown-items .ui-dropdown-item');

        this.standardDeliveryTimeSelect = Selector('.time-select');
        this.standardDeliveryTimeOptions = this.standardDeliveryTimeSelect.find('.ui-dropdown-items .ui-dropdown-item');

        this.tieredDeliveryOptions = Selector('.tiered-delivery-selection');
        this.tieredDelivery30Mins = Selector('.tiered-delivery__card:nth-of-type(2)');
        this.tieredDelivery90Mins = Selector('.tiered-delivery__card:nth-of-type(1)');
        // this.tieredDeliveryAhead = Selector('.tiered-delivery__card:nth-of-type(3)');

        this.tieredDeliveryToday = Selector('.tiered-delivery__card:nth-of-type(1)');
        this.tieredDeliveryAhead = Selector('.tiered-delivery__card:nth-of-type(2)');

        this.tieredDeliveryDatePicker = Selector('#tieredDatePicker');
        this.tieredDeliveryDateOptions = this.tieredDeliveryDatePicker.find('.tiered-delivery__date-card');

        this.tieredDeliveryTimePicker = Selector('#tieredTimePicker .ui-dropdown');
        this.tieredDeliveryTimeOptions = this.tieredDeliveryTimePicker.find('.ui-dropdown-items .ui-dropdown-item');
        this.tieredFirstTimeOption = this.tieredDeliveryOptions.find('.ui-dropdown-items .ui-dropdown-item:first-of-type');

        this.changeAddressButton = Selector('.change-button');
        this.addressSearchInput = Selector('.search-address');
        this.firstAddressResult = Selector('div.address-search .autocomplete-dropdown-container .suggestion-item:first-of-type');
        this.confirmAddressButton = Selector('#confirmAddressContinueBtn');

        this.promoLink = Selector('.have-a-promo');
        this.promoInput = Selector('.promo-input input');
        this.promoApplyButton = Selector('.promo-button button');

        this.discount = Selector('.subtotals .discount');

        this.checkoutButton = Selector('#checkoutBtn');

        this.errorMessageDeliveryOption = Selector('.error--delivery-option');
        this.errorMessageDeliveryTime = Selector('.error--delivery-time');

        this.addressUnserviceableModal = new AddressUnserviceableModal();

        this.cartFirstItem = Selector('#cartItemHolder > div > div:nth-of-type(1)');
        this.cartFirstItemQuantityDownButton = this.cartFirstItem.find('.input-group .input-group-btn:nth-of-type(1)');
        this.cartFirstItemQuantityUpButton = this.cartFirstItem.find('.input-group .input-group-btn:nth-last-of-type(1)');
        this.cartFirstItemQuantity = this.cartFirstItem.find('.input-group .input-number');
        this.cartFirstItemRemoveButton = this.cartFirstItem.find('.btn-primary');
    }

    async openStandardDeliveryDayOptions() {
        await t
            .click(this.standardDeliveryDaySelect);
    }

    async selectStandardDeliveryDayOption(optionIndex) {
        await t
            .click(this.standardDeliveryDayOptions.nth(optionIndex));
    }

    async openStandardDeliveryTimeOptions() {
        await t
            .click(this.standardDeliveryTimeSelect);
    }

    async selectStandardDeliveryTimeOption(optionIndex) {
        await t
            .click(this.standardDeliveryTimeOptions.nth(optionIndex));
    }

    async checkout() {
        await t
            .click(this.checkoutButton);
    }

    async selectTieredToday() {
        await t
            .click(this.tieredDeliveryToday);
    }

    async selectTieredAhead() {
        await t
            .click(this.tieredDeliveryAhead);
    }

    async selectTiered90Mins() {
        await t
            .click(this.tieredDelivery90Mins);
    }

    async selectTiered30Mins() {
        await t
            .click(this.tieredDelivery30Mins);
    }

    async selectTieredAhead() {
        await t
            .click(this.tieredDeliveryAhead);
    }

    async selectTieredDeliveryDay(dayIndex = 1) {
        await t
            .click(this.tieredDeliveryDatePicker)
            .click(this.tieredDeliveryDateOptions.nth(dayIndex));
    }

    async selectTieredDeliveryTime(timeIndex = 1) {
        await t
            .click(this.tieredDeliveryTimePicker)
            .click(this.tieredDeliveryTimeOptions.nth(timeIndex));
    }

    async changeAddress() {
        await t
            .click(this.changeAddressButton);
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

    async clickPromoCode() {
        await t
            .click(this.promoLink);
    }

    async applyPromoCode(code) {
        await t
            .typeText(this.promoInput, code)
            .click(this.promoApplyButton);
    }

    async decrementCartFirstItemQty(times = 1) {
        for (let i = 0; i < times; i++) {
            await t
                .click(this.cartFirstItemQuantityDownButton);
        }
    }

    async incrementCartFirstItemQty(times = 1) {
        for (let i = 0; i < times; i++) {
            await t
                .click(this.cartFirstItemQuantityUpButton);
        }
    }

    async removeCartFirstItem() {
        await t
            .click(this.cartFirstItemRemoveButton);
    }
};
