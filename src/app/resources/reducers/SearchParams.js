import { createReducer } from 'lib/createReducer';
import {
    SEARCH_PARAMS_SUCCESS
} from '../constants/SearchParams';

const initialState = {

};

export default createReducer(initialState, {
    [SEARCH_PARAMS_SUCCESS]: (state, data) => {
        return Object.assign({}, state, data.payload);
    }
});