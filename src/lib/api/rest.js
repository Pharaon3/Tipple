import isFunction from 'lib/isFunction';
import axios from 'axios';
import config from 'app/config';
import { getItem } from 'lib/util/localStorage';

// A nice helper to tell us if we're on the server
export const isServer = !(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);


export const checkHttpStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {

        if (response.data.errors) {
            return response;
        }

        let error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export const parseJSON = (response) => {
    return response.data;
}

export const standardHeaders = (auth) => {
    const siteId = getItem('tipple_site_id') || config.siteId;

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Tipple-Site-Id': siteId,
        'X-Device-Identifier': auth === null || auth.deviceIdentifier === undefined ? 'UNKNOWN' : auth.deviceIdentifier,
        'Tipple-Device-Type': 'Web',
        'Tipple-Device-App-Version': process?.env?.REACT_APP_VERSION ?? null
    };

    // headers['X-Tipple-Time'] = '9:45';

    // Enable X-Tipple-Time header if we're in dev mode
    if (process.env.NODE_ENV === 'development' && !isServer) {
        let tippleTime = null;

        if (window && window.tippleTime) {
            tippleTime = window.tippleTime;
        } else if (config.tippleTime) {
            tippleTime = config.tippleTime;
        }

        if (tippleTime) {
            // Expects UTC 24 hour Time
            headers['X-Tipple-Time'] = tippleTime;
        }
    }

    if (auth !== null) {
        if (auth.token !== undefined && auth.token !== null) {
            headers['Authorization'] = 'Bearer ' + auth.token;
        } else if (auth.userIdentifier !== undefined && auth.userIdentifier !== null) {
            headers['X-User-Identifier'] = auth.userIdentifier;
        }    
    }


    return headers;
};

const crudQuery = (parsePath, onReceive) => {
    return (auth, params) => {
        return axios.get(`${parsePath(null, params, auth)}`, {
            params: params,
            headers: standardHeaders(auth),
            validateStatus: function (status) { return status >= 200 && status < 500; }
        }).then(checkHttpStatus).then(parseJSON).then(onReceive)
    };
};

const crudList = (parsePath, onReceive) => {
    return (auth, params) => {
        return axios.get(`${parsePath(null, params, auth)}`, {
            params: params,
            headers: standardHeaders(auth),
            validateStatus: function (status) { return status >= 200 && status < 500; }
        }).then(checkHttpStatus).then(parseJSON).then(resp => {

            let itemsOR = [];

            resp.data.forEach(x => {
                itemsOR.push(onReceive(x));
            });

            resp.data = itemsOR;

            return resp;
        })
    };
};

const crudGet = (parsePath, onReceive) => {
    return (id, auth, params) => {
        return axios.get(`${parsePath(id, params, auth)}/${id}`, {
            params: params,
            headers: standardHeaders(auth),
            validateStatus: function (status) { return status >= 200 && status < 500; }
        }).then(checkHttpStatus).then(parseJSON).then(onReceive)
    };
};

const crudDel = (parsePath) => {
    return (id, auth, params) => {
        return axios.delete(`${parsePath(id, params, auth)}/${id}`, {
            headers: standardHeaders(auth),
            validateStatus: function (status) { return status >= 200 && status < 500; }
        });
    };
};

const crudPatch = (parsePath, onSend, onReceive) => {
    return (id, data, auth, params) => {
        return axios.patch(`${parsePath(id, params, auth)}/${id}`, onSend(data), {
            headers: standardHeaders(auth),
            validateStatus: function (status) { return status >= 200 && status < 500; }
        }).then(checkHttpStatus).then(parseJSON).then(onReceive);
    };
};

const crudCreate = (parsePath, onSend, onReceive) => {
    return (data, auth, params) => {
        return axios.post(`${parsePath(null, Object.assign({}, params, data), auth)}`, onSend(data), {
            headers: standardHeaders(auth),
            validateStatus: function (status) { return status >= 200 && status < 500; }
        }).then(checkHttpStatus).then(parseJSON).then(onReceive);
    };
};

const crudUpdate = (parsePath, onSend, onReceive) => {
    return (id, data, auth, params) => {
        if (id === null) {
            return axios.put(`${parsePath(id, Object.assign({}, params, data), auth)}`, onSend(data), {
                headers: standardHeaders(auth),
                validateStatus: function (status) { return status >= 200 && status < 500; }
            }).then(checkHttpStatus).then(parseJSON).then(onReceive);
        }
        return axios.put(`${parsePath(id, Object.assign({}, params, data), auth)}/${id}`, onSend(data), {
            headers: standardHeaders(auth),
            validateStatus: function (status) { return status >= 200 && status < 500; }
        }).then(checkHttpStatus).then(parseJSON).then(onReceive);
    };
};

const crudUpload = (parsePath, onReceive) => {
    return (id, file, auth, params) => {
        const fd = new FormData();
        fd.append('id', id);
        fd.append('file', file);

        return axios.post(`${parsePath(null, params, auth)}/${id}/file`, fd, {
            headers: {
                'Authorization': 'Bearer ' + auth.token
            },
            validateStatus: function (status) { return status >= 200 && status < 500; }
        }).then(checkHttpStatus);
    };
};

export default function rest(path, onReceive, onSend) {

    const parsePath = (id, params, auth) => {
        let newPath = path;

        if (isFunction(newPath)) {
            newPath = newPath(id, params, auth && auth.token);
        }

        // newPath = config.apiBase + "/" + newPath;

        params !== undefined && Object.keys(params).forEach((v, k) => {
            newPath = newPath.replace('{' + k + '}', v);
        });

        return newPath;
    };


    return {
        get: crudGet(parsePath, onReceive),
        query: crudQuery(parsePath, onReceive),
        list: crudList(parsePath, onReceive),
        patch: crudPatch(parsePath, onSend, onReceive),
        create: crudCreate(parsePath, onSend, onReceive),
        update: crudUpdate(parsePath, onSend, onReceive),
        upload: crudUpload(parsePath, onSend, onReceive),
        del: crudDel(parsePath, onSend, onReceive)
    }
}