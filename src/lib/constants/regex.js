export const australianMobileMaskRegex = /^(\+|6)+/i;
export const australianMobileRegex = /^(\+6)*[0-9]{10,12}$/i;
export const emailRegex = /.+@.+\..+/i;
export const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;

// Generate a mobile number input mask based on whether the user is entering one in international format or not.
export const mobileNumberMask = rawValue => {
    if (rawValue.search(australianMobileMaskRegex) !== -1) {
        return ['+', /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/];
    } else {
        return ['0', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/];
    }
};

export default {
    australianMobileMaskRegex,
    australianMobileRegex,
    emailRegex,
    mobileNumberMask
};