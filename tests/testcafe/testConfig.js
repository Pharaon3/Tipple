import appConfig from '../../src/app/config';

export const testUser = {
    firstName: 'Alfonso',
    lastName: 'Test',
    email: '51@tipple.xyz',
    mobile: '0411 222 333',
    password: '12345theSamecombinationonmyluggage',
    dateOfBirth: '11/11/1980',
    cc: {
        name: 'Mr. Alfonso Test',
        number: '4111 1111 1111 1111',
        expiry: '09/22', 
        cvv: '123'
    }
};

export const loginUser = {
    email: '51@tipple.xyz',
    password: 'qwertyuiop'
};

export default {
    baseUrl: appConfig.siteRoot,
    testUser,
    loginUser
};
