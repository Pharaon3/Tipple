export default function getActionCreators(resourceName, actionTypes, api, options) {
    let actionCreators = {

        getSingle: function (auth, params, clear = false) {
            return function (dispatch) {
                dispatch(actionCreators.request(clear));

                return api.query(auth, params)
                    .then(
                        response => dispatch(response.errors ? actionCreators.failure(response.errors) : actionCreators.success(response.data[0])),
                        exception => dispatch(actionCreators.failure(exception))
                    ).then(
                        response => dispatch(actionCreators.complete()),
                        exception => dispatch(actionCreators.complete())
                    );
            }
        },

        get: function (id, auth, params, clear = false) {
            return function (dispatch) {
                dispatch(actionCreators.request(clear));

                return api.get(id, auth, params)
                    .then(
                        response => dispatch(response.errors ? actionCreators.failure(response.errors) : actionCreators.success(response)),
                        exception => dispatch(actionCreators.failure(exception))
                    ).then(
                        response => dispatch(actionCreators.complete()),
                        exception => dispatch(actionCreators.complete())
                    );
            }
        },

        request: function (clear) {
            let name = resourceName + '_GET_REQUEST';

            return {
                type: actionTypes[name],
                data: clear
            }
        },

        success: function (data) {
            let name = resourceName + '_GET_SUCCESS';

            return {
                data: options.hasIndividualDataWrapper ? data.data : data,
                type: actionTypes[name]
            }
        },

        complete: function () {
            let name = resourceName + '_GET_COMPLETE';

            return {
                data: {},
                type: actionTypes[name]
            }
        },

        failure: function (error, data) {
            let name = resourceName + '_GET_FAILURE';

            return {
                data: data,
                error: error,
                type: actionTypes[name]
            }
        }
    };

    return actionCreators;
}