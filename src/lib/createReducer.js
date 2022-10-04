export function createReducer(initialState, reducerMap) {
    return function () {

        let state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
        let action = arguments[1];

        const reducer = reducerMap[action.type];

        return reducer ? reducer(state, action) : state;
    };
}