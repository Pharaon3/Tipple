import axios from 'axios';

import config from 'app/config';

import { checkHttpStatus, parseJSON, standardHeaders } from 'lib/api/rest';

let get = (token, userIdentifier, deviceIdentifier) => {

    const timestamp = new Date().getTime();
    return axios.get(`${config.baseURI}/cart?${timestamp}`, {
            params: {
                
            },
            headers: standardHeaders({
                token: token,
                userIdentifier: userIdentifier,
                deviceIdentifier: deviceIdentifier
            }),
            }).then(checkHttpStatus).then(parseJSON)
}

export default {
    get: get
} 
