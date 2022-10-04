export default function fileActionCreators(resourceName, actionTypes, api) {
    let actionCreators = {

        uploadFile: function (id, file, token) {
            return function (dispatch) {
                dispatch(actionCreators.request());

                if (typeof file === "string") {
                    dispatch(actionCreators.success({
                        data: file
                    }));
                    return;
                }

                return api.upload(id, file, token)
                    .then(
                        response => dispatch(response.errors ? actionCreators.failure(response.errors) : actionCreators.success(response)),
                        exception => dispatch(actionCreators.failure(exception))
                    ).then(
                        response => dispatch(actionCreators.complete()),
                        exception => dispatch(actionCreators.complete())
                    );
            }
        },

        request: function () {
            let name = resourceName + '_FILE_REQUEST';

            return {
                type: actionTypes[name]
            }
        },

        success: function (data) {
            let name = resourceName + '_FILE_SUCCESS';

            return {
                data: data.data,
                type: actionTypes[name]
            }
        },

        complete: function () {
            let name = resourceName + '_FILE_COMPLETE';

            return {
                data: {},
                type: actionTypes[name]
            }
        },

        failure: function (errors) {
            let name = resourceName + '_FILE_FAILURE';

            return {
                error: errors,
                type: actionTypes[name]
            }
        }
    };

    return actionCreators;
}