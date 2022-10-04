
export function decodeSearchParams(search) {
    let urlSP = {};

    for (let p of new URLSearchParams(search)) {
        urlSP[p[0]] = p[1];
    }

    return urlSP;
};

export const getUrlParam = (queryString, paramName, defaultValue = null) => {
    let sp = decodeSearchParams(queryString);
    let param = sp && sp[paramName] ? sp[paramName] : null;

    if (param && String(param) !== '') {
        return param;
    } else {
        return defaultValue;
    }
};

export default {
    decodeSearchParams,
    getUrlParam
};