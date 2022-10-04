import _uniqBy from 'lib/uniqBy';

export default function reducers(resourceName, options) {

    return {
        [resourceName + '_LIST_CLEAR']: (state, payload) => {
            return Object.assign({}, state, {
                isRequesting: false,
                hasRequested: false,
                isCleared: true,
                items: [],
                meta: {}
            });
        },

        [resourceName + '_LIST_REQUEST']: (state, payload) => {
            return Object.assign({}, state, {
                isRequesting: true,
                hasRequested: false,
                lastQuery: payload?.query
            });
        },

        [resourceName + '_LIST_FAILURE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequesting: false,
                items: [],
                meta: {},
                errors: payload.errors,
                hasRequested: true
            });
        },

        [resourceName + '_LIST_SUCCESS']: (state, payload) => {
            let items = [];

            if (payload.mergeKey === true) {
                items = state.items === undefined ? payload.data : state.items.concat(payload.data);
            } else if (payload.mergeKey !== undefined) {
                items = state.items === undefined ? payload.data : state.items.concat(payload.data);
                items = _uniqBy(items, payload.mergeKey);
            } else {
                items = payload.data;
            }

            return Object.assign({}, state, {
                isRequesting: false,
                items: state.lastQuery === payload?.query ? items : state.items,
                lastQuery: null,
                meta: payload.meta,
                hasRequested: true
            });
        },

        [resourceName + '_LIST_COMPLETE']: (state, payload) => {
            return Object.assign({}, state, {
                isRequesting: false
            });
        }
    }
}