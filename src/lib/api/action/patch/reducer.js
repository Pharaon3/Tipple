export default function reducers(resourceName, args) {
    if (resourceName === null) throw new Error('reducersFor: Expected resourceName');

    return {
        [resourceName + '_PATCH_REQUEST']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingPatch: true,
                hasPatched: false
            });
        },

        [resourceName + '_PATCH_FAILURE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingPatch: false,
                item: null,
                hasPatched: false,
                errors: payload.errors
            });
        },

        [resourceName + '_PATCH_SUCCESS']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingPatch: false,
                item: payload.data,
                hasPatched: true
            });
        },

        [resourceName + '_PATCH_COMPLETE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequestingPatch: false,
                hasPatched: false
            });
        }
    }
}