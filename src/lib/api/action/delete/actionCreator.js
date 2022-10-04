export default function deleteActionCreators(resourceName, actionTypes, api) {
    let actionCreators = {

        delete: function (id, auth, params) {
            return function (dispatch) {
                dispatch(actionCreators.request());

                return api.del(id, auth, params)
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
            let name = resourceName + '_DELETE_REQUEST';

            return {
                type: actionTypes[name]
            }
        },

        success: function (data) {
            let name = resourceName + '_DELETE_SUCCESS';

            return {
                data: data.data,
                type: actionTypes[name]
            }
        },

        complete: function () {
            let name = resourceName + '_DELETE_COMPLETE';

            return {
                data: {},
                type: actionTypes[name]
            }
        },

        failure: function (errors) {
            let name = resourceName + '_DELETE_FAILURE';

            return {
                errors: errors,
                type: actionTypes[name]
            }
        }
    };

    return actionCreators;
}