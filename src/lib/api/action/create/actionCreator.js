export default function createActionCreators(resourceName, actionTypes, api) {
    let actionCreators = {

        create: function (data, auth, queryParams) {
            return function (dispatch) {
                dispatch(actionCreators.request());

                return api.create(data, auth, queryParams)
                    .then(
                        response => dispatch(response.errors ? actionCreators.failure(response.errors, response.data) : actionCreators.success(response)),
                        exception => dispatch(actionCreators.failure(exception))
                    ).then(
                        response => dispatch(actionCreators.complete()),
                        exception => dispatch(actionCreators.complete())
                    );
            }
        },

        request: function () {
            let name = resourceName + '_CREATE_REQUEST';

            return {
                type: actionTypes[name]
            }
        },

        success: function (data) {
            let name = resourceName + '_CREATE_SUCCESS';

            return {
                data: data,
                type: actionTypes[name]
            }
        },

        complete: function () {
            let name = resourceName + '_CREATE_COMPLETE';

            return {
                data: {},
                type: actionTypes[name]
            }
        },

        failure: function (errors, additional) {
            let name = resourceName + '_CREATE_FAILURE';

            return {
                errors: errors,
                additional: additional,
                type: actionTypes[name]
            }
        }
    };

    return actionCreators;
}