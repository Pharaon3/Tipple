import {
    SEARCH_PARAMS_SUCCESS
} from '../constants/SearchParams';

export function decodeSearchParams(props) {
    return function (dispatch) {
        let urlSP = {};

        for (let p of new URLSearchParams(props.location.search)) {
            urlSP[p[0]] = p[1];
        }

        dispatch(searchParamsSuccess(urlSP));
    }
}

export function searchParamsSuccess(data) {
    return {
        type: SEARCH_PARAMS_SUCCESS,
        payload: data
    };
}