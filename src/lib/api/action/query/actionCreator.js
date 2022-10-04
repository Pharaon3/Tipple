export default function queryActionCreators(resourceName, actionTypes, api) {
    let actionCreators = {

        query: function (auth, params) {
            return function (dispatch) {
                dispatch(actionCreators.request());

                return api.query(auth, params)
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
            let name = resourceName + '_QUERY_REQUEST';

            return {
                type: actionTypes[name]
            }
        },

        success: function (data) {
            let name = resourceName + '_QUERY_SUCCESS';

            return {
                data: data.data,
                payload: data,
                type: actionTypes[name]
            }
        },

        complete: function () {
            let name = resourceName + '_QUERY_COMPLETE';

            return {
                data: {},
                type: actionTypes[name]
            }
        },

        failure: function (errors) {
            let name = resourceName + '_QUERY_FAILURE';

            return {
                errors: errors,
                type: actionTypes[name]
            }
        }
    };

    return actionCreators;
}