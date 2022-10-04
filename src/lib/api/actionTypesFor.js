function addGroup(resource, actionTypes, type) {
    const upperResource = resource.toUpperCase();
    const upperType = type.toUpperCase();

    const clearErrors = upperResource + '_' + upperType + '_CLEAR_ERRORS';
    const clear = upperResource + '_' + upperType + '_CLEAR';
    const request = upperResource + '_' + upperType + '_REQUEST';
    const failure = upperResource + '_' + upperType + '_FAILURE';
    const success = upperResource + '_' + upperType + '_SUCCESS';
    const complete = upperResource + '_' + upperType + '_COMPLETE';

    actionTypes[clear] = clear;
    actionTypes[clearErrors] = clearErrors;
    actionTypes[request] = request;
    actionTypes[failure] = failure;
    actionTypes[success] = success;
    actionTypes[complete] = complete;
}

export default function actionTypesFor(resource, types) {
    if (resource === null || resource === '') throw new Error('Expected resource');

    let actionTypes = {};

    types.forEach(type => {
        addGroup(resource, actionTypes, type);
    });

    return actionTypes;
}