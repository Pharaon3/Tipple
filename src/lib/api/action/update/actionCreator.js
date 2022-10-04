export default function updateActionCreators(resourceName, actionTypes, api) {
    let actionCreators = {

        update: function (id, data, auth, queryParams) {
            return function (dispatch) {
                dispatch(actionCreators.request());

                return api.update(id, data, auth, queryParams)
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
            let name = resourceName + '_UPDATE_REQUEST';

            return {
                type: actionTypes[name]
            }
        },

        success: function (data) {
            let name = resourceName + '_UPDATE_SUCCESS';
            return {
                data: data,
                type: actionTypes[name]
            }
        },

        complete: function () {
            let name = resourceName + '_UPDATE_COMPLETE';

            return {
                data: {},
                type: actionTypes[name]
            }
        },

        failure: function (errors) {
            let name = resourceName + '_UPDATE_FAILURE';
            return {
                errors: errors,
                type: actionTypes[name]
            }
        }
    };

    return actionCreators;
}