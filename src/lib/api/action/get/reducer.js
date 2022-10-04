export default function reducers(resourceName, args) {

    return {
        [resourceName + '_GET_REQUEST']: (state, payload) => {
            let d = {
                isRequestingItem: true,
                hasRequested: false,
                hasError: false
            };

            if (payload.data.clear) {
                d.item = null;
            }

            return Object.assign({}, state, d);
        },

        [resourceName + '_GET_FAILURE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingItem: false,
                item: null,
                errors: payload.errors,
                hasError: [401, 403, 404].includes(payload?.error?.response?.status ?? null),
                hasRequested: true
            });
        },

        [resourceName + '_GET_SUCCESS']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingItem: false,
                item: payload.data,
                hasRequested: true,
                hasError: false
            });
        },

        [resourceName+'_GET_COMPLETE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingItem: false
            });
        }
    }
}