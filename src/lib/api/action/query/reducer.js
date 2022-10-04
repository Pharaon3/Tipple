export default function reducers(resourceName, options) {

    return {
        [resourceName + '_QUERY_REQUEST']: (state, payload) => {
            return Object.assign({}, state, {
                hasRequested: false,
                isRequesting: true,
                data: {},
                payload: {}
            });
        },

        [resourceName + '_QUERY_FAILURE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequesting: false,
                data: {},
                errors: payload.errors,
                payload: {}
            });
        },

        [resourceName + '_QUERY_SUCCESS']: (state, payload) => {
            return Object.assign({}, state, {
                isRequesting: false,
                hasRequested: true,
                data: payload.data,
                meta: payload.meta,
                payload: payload.payload
            });
        },

        [resourceName + '_QUERY_COMPLETE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequesting: false
            });
        }
    }
}