export const stripNulls = obj => {
    let ret = {};

    Object.keys(obj).forEach(key => {
        if (obj[key]) {
            ret[key] = obj[key];
        }
    });

    return ret;
};

export default {
    stripNulls
};