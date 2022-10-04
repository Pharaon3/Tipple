export default function reducers(resourceName, args) {

    return {
        [resourceName + '_UPDATE_REQUEST']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingUpdate: true,
                hasUpdated: false
            });
        },

        [resourceName + '_UPDATE_FAILURE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingUpdate: false,
                item: null,
                hasUpdated: false,
                errors: payload.errors
            });
        },

        [resourceName + '_UPDATE_SUCCESS']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingUpdate: false,
                item: payload.data,
                hasUpdated: true
            });
        },

        [resourceName + '_UPDATE_COMPLETE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingUpdate: false,
                hasUpdated: false
            });
        }
    }
}