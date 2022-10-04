import config from 'app/config';
import Cookies from 'js-cookie';

export const setAppToken = token => {
    let date = new Date();
    date.setHours(date.getHours() + 87600);
    Cookies.set(config.authenticationCookie, token, {
        path: '/',
        expires: date,
        secure: config && config.insecureCookies === true ? false : true
    });
};

export default {
    setAppToken
};