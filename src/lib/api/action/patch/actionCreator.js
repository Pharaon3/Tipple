export default function patchActionCreators(resourceName, actionTypes, api) {
    let actionCreators = {

        patch: function (id, data, auth, queryParams) {
            return function (dispatch) {
                dispatch(actionCreators.request());

                return api.patch(id, data, auth, queryParams)
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
            let name = resourceName + '_PATCH_REQUEST';

            return {
                type: actionTypes[name]
            }
        },

        success: function (data) {
            let name = resourceName + '_PATCH_SUCCESS';

            return {
                data: data,
                type: actionTypes[name]
            }
        },

        complete: function () {
            let name = resourceName + '_PATCH_COMPLETE';

            return {
                data: {},
                type: actionTypes[name]
            }
        },

        failure: function (errors) {
            let name = resourceName + '_PATCH_FAILURE';

            return {
                errors: errors,
                type: actionTypes[name]
            }
        }
    };

    return actionCreators;
}