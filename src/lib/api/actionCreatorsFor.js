import actionTypesFor from './actionTypesFor';
import createActionCreators from './action/create/actionCreator';
import deleteActionCreators from './action/delete/actionCreator';
import getActionCreators from './action/get/actionCreator';
import listActionCreators from './action/list/actionCreator';
import queryActionCreators from './action/query/actionCreator';
import patchActionCreators from './action/patch/actionCreator';
import updateActionCreators from './action/update/actionCreator';
import fileActionCreators from './action/file/actionCreator';

export default function actionCreatorsFor(resourceName, types, api, options) {
    if (resourceName === null) throw new Error('actionCreatorsFor: Expected resourceName');

    if (!Array.isArray(types)) {
        throw new Error(`actionCreatorsFor (${resourceName}): Expected types (${types})`);
    }

    options = options || {};

    let actionTypes = actionTypesFor(resourceName, types);

    let actionCreators = {
        "name": resourceName
    };

    actionCreators["clear"] = function () {
        return function (dispatch) {
            dispatch({
                type: resourceName + "_CLEAR"
            })
        }
    }
    
    actionCreators["clearErrors"] = function () {
        return function (dispatch) {
            dispatch({
                type: resourceName + '_CREATE_CLEAR_ERRORS'
            })
        }
    }

    types.forEach(type => {
        switch (type) {
            case 'LIST':
                Object.assign(actionCreators, listActionCreators(resourceName, actionTypes, api, options));
                break;
            case 'GET':
                Object.assign(actionCreators, getActionCreators(resourceName, actionTypes, api, options));
                break;
            case 'QUERY':
                Object.assign(actionCreators, queryActionCreators(resourceName, actionTypes, api, options));
                break;
            case 'CREATE':
                Object.assign(actionCreators, createActionCreators(resourceName, actionTypes, api, options));
                break;
            case 'PATCH':
                Object.assign(actionCreators, patchActionCreators(resourceName, actionTypes, api, options));
                break;
            case 'UPDATE':
                Object.assign(actionCreators, updateActionCreators(resourceName, actionTypes, api, options));
                break;
            case 'DELETE':
                Object.assign(actionCreators, deleteActionCreators(resourceName, actionTypes, api, options));
                break;
            case 'FILE':
                Object.assign(actionCreators, fileActionCreators(resourceName, actionTypes, api, options));
                break;
            default:
                break;
        }
    });

    return actionCreators;
}