import { Selector, t } from 'testcafe';

export default class LoginModal {
    constructor() {
        this.modal = Selector('#loginModal');

        this.emailInput = Selector('#username');
        this.passwordInput = Selector('#password');

        this.loginSubmitButton = Selector('#loginSubmitBtn');
    }

    async isOpen() {
        await t
            .expect(this.modal.visible).ok();
    }
}
