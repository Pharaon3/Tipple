import axios from 'axios';

import config from 'app/config';

import { standardHeaders } from 'lib/api/rest';

import {
    ID_VERIFICATION_REQUEST,
    ID_VERIFICATION_SUCCESS,
    ID_VERIFICATION_FAILURE

} from '../constants/IdVerification';

export function idVerificationRequest() {
    return {
        type: ID_VERIFICATION_REQUEST
    }
}

export function idVerificationSuccess(statecode) {
    return {
        type: ID_VERIFICATION_SUCCESS,
        payload: {
            statecode: statecode
        }
    }
}

export function idVerificationFailure(statecode) {
    return {
        type: ID_VERIFICATION_FAILURE,
        payload: {
            statecode: statecode
        }
    }
}

export function idVerification(data, auth) {
    return function (dispatch) {
        dispatch(idVerificationRequest());

        return axios.post(`${config.baseURI}/user/id-verification/manual`, {
            firstName: data.firstName,
            lastName: data.lastName,
            dob: data.dob,
            idType: data.idType,
            idNumber: data.idNumber,
            idState: data.idState,
            idCountry: data.idCountry
        }, {
            headers: standardHeaders(auth)
        }).then((x) => {
            if (x.status === 200 && !x.data.doIdCheck) {
                dispatch(idVerificationSuccess(2));
            }
            else{
                dispatch(idVerificationFailure(3));
            }
        }).catch(errors => {
            dispatch(idVerificationFailure(3));
        });

    }
}