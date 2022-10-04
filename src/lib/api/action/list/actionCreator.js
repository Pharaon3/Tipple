export default function listActionCreators(resourceName, actionTypes, api, options) {
    let actionCreators = {

        list: function (auth, params, mergeKey, options = {}) {
            return function (dispatch) {
                
                dispatch(actionCreators.request(params?.q));

                return api.list(auth, params)
                    .then(
                        response => {
                            dispatch((response.errors?.length > 0 || response.error) ? actionCreators.failure(response.errors) : actionCreators.success(response, mergeKey, params?.q, options?.successCallback ?? null))
                        },
                        exception => dispatch(actionCreators.failure(exception))
                    ).then(
                        response => dispatch(actionCreators.complete()),
                        exception => dispatch(actionCreators.complete())
                    );
            }
        },

        clear: function () {
            let name = resourceName + '_LIST_CLEAR';

            return {
                type: actionTypes[name]
            }
        },

        request: function (query = null) {
            let name = resourceName + '_LIST_REQUEST';

            const action = {
                type: actionTypes[name]
            };

            // Check if we have a query param
            if (query) {
                action.query = query;
            }
            return action;
        },

        success: function (data, mergeKey, query = null, callback) {
            let name = resourceName + '_LIST_SUCCESS';
            let action = {};

            if (callback) {
                callback(data);
            }

            if (options.hasMeta) {
                action = {
                    mergeKey: mergeKey,
                    meta: {
                        count: data.count,
                        limit: data.limit,
                        sort: data.sort,
                        offset: data.offset,
                        alphaPagination: data.alphaPagination
                    },
                    data: data.data,
                    type: actionTypes[name]
                }
            } else {
                action = {
                    mergeKey: mergeKey,
                    data: data.data,
                    type: actionTypes[name]
                }
            }

            // Check if we have a query param
            if (query) {
                action.query = query;
            }
            return action;
        },

        complete: function () {
            let name = resourceName + '_LIST_COMPLETE';

            return {
                data: {},
                type: actionTypes[name]
            }
        },

        failure: function (errors) {
            let name = resourceName + '_LIST_FAILURE';

            return {
                error: errors,
                type: actionTypes[name]
            }
        }
    };

    return actionCreators;
}