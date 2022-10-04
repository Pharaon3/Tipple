import { Selector, t } from 'testcafe';

export default class AddressUnserviceableModal {
    constructor() {
        this.modal = Selector('#addressUnserviceableModal');
    }

    async isOpen() {
        await t
            .expect(this.modal.visible).ok();
    }
}
