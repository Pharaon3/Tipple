import { createReducer } from '../createReducer';

import createReducers from './action/create/reducer';
import deleteReducers from './action/delete/reducer';
import getReducers from './action/get/reducer';
import listReducers from './action/list/reducer';
import queryReducers from './action/query/reducer';
import patchReducers from './action/patch/reducer';
import updateReducers from './action/update/reducer';
import fileReducers from './action/file/reducer';

export default function reducersFor(resourceName, types, options) {

    options = options || {};

    let reducers = {
        [resourceName + '_CLEAR']: () => {
            return {};
        },
        [resourceName + '_CREATE_CLEAR_ERRORS']: (state, payload) => {
            return Object.assign({}, state, {
                errors: undefined
            });
        }
    };

    types.forEach(type => {
        switch (type) {
            case 'LIST':
                Object.assign(reducers, listReducers(resourceName, options));
                break;
            case 'GET':
                Object.assign(reducers, getReducers(resourceName, options));
                break;
            case 'QUERY':
                Object.assign(reducers, queryReducers(resourceName, options));
                break;
            case 'PATCH':
                Object.assign(reducers, patchReducers(resourceName, options));
                break;
            case 'CREATE':
                Object.assign(reducers, createReducers(resourceName, options));
                break;
            case 'UPDATE':
                Object.assign(reducers, updateReducers(resourceName, options));
                break;
            case 'DELETE':
                Object.assign(reducers, deleteReducers(resourceName, options));
                break;
            case 'FILE':
                Object.assign(reducers, fileReducers(resourceName, options));
                break;
            default:
                break;
        }
    });

    if (options.additionalReducers) {
        reducers = {
            ...reducers,
            ...options.additionalReducers
        };
    }

    return createReducer({}, reducers);
}