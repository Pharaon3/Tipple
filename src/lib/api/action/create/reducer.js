export default function reducers(resourceName, args) {

    return {
        [resourceName+'_CREATE_REQUEST']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingCreate: true,
                hasCreated: false,
                errors: undefined
            });
        },

        [resourceName+'_CREATE_FAILURE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingCreate: false,
                item: null,
                hasCreated: false,
                additional: payload.additional,
                errors: payload.errors
            });
        },

        [resourceName+'_CREATE_SUCCESS']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingCreate: false,
                item: payload.data,
                hasCreated: true
            });
        },

        [resourceName+'_CREATE_COMPLETE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingCreate: false,
                hasCreated: false
            });
        }
    }
}