export default function reducers(resourceName, args) {

    return {
        [resourceName + '_LIST_CLEAR']: (state, payload) => {
            return Object.assign({}, state, {
                isFileUploading: false,
                hasFileUploaded: false
            });
        },

        [resourceName + '_FILE_REQUEST']: (state, payload) => {
            return Object.assign({}, state, {
                isFileUploading: true,
                hasFileUploaded: false
            });
        },

        [resourceName + '_FILE_FAILURE']: (state, payload) => {
            return Object.assign({}, state, {
                isFileUploading: false,
                hasFileUploaded: false,
                errors: payload.errors
            });
        },

        [resourceName + '_FILE_SUCCESS']: (state, payload) => {
            return Object.assign({}, state, {
                isFileUploading: false,
                hasFileUploaded: true
            });
        },

        [resourceName + '_FILE_COMPLETE']: (state, payload) => {
            return Object.assign({}, state, {
                isFileUploading: false,
                hasFileUploaded: false
            });
        }
    }
}