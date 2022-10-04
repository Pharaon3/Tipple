export default function reducers(resourceName, args) {

    return {
        [resourceName+'_DELETE_REQUEST']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingDelete: true,
                isDeleted: false
            });
        },

        [resourceName+'_DELETE_FAILURE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingDelete: false,
                isDeleted: false,
                errors: payload.errors
            });
        },

        [resourceName+'_DELETE_SUCCESS']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingDelete: false,
                isDeleted: true
            });
        },

        [resourceName+'_DELETE_COMPLETE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingDelete: false,
                isDeleted: false
            });
        }
    }
}