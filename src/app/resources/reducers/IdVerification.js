import { createReducer } from 'lib/createReducer';
import {
    ID_VERIFICATION_SUCCESS,
    ID_VERIFICATION_FAILURE
} from '../constants/IdVerification';

const initialState = {
    idverificationflag: 1
};

export default createReducer(initialState, {

    [ID_VERIFICATION_SUCCESS]: (state, data) => {
        return Object.assign({}, state, {
            idverificationflag: data.payload.statecode
        });
    },

    [ID_VERIFICATION_FAILURE]: (state, data) => {
        return Object.assign({}, state, {
            idverificationflag: data.payload.statecode
        });
    }
    
});