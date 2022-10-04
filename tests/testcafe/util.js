import { ClientFunction } from 'testcafe';

export const getLocation = ClientFunction(() => document.location.href.toString());

export const userWithUniqueEmail = user => {
    const accountUser = { ...user };

    accountUser.email = accountUser.email.replace('@', String('+').concat(+new Date).concat('@'));

    return accountUser;
}

export default {
    getLocation,
    userWithUniqueEmail
};
