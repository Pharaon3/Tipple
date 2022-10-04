import { createReducer } from 'lib/createReducer';
import {
    SET_LAST_PRODUCT_CATEGORY_SLUG, 
    SET_SORT_OPTION, SET_SEARCH_TEXT,
    SET_LAST_COLLECTION_ID
} from '../constants/Product';

const initialState = {
    lastProductCategorySlug: null,
    sortOption: 'favourite',
    searchText: '',
    lastCollectionId: null
};

export default createReducer(initialState, {

    [SET_LAST_PRODUCT_CATEGORY_SLUG]: (state, data) => {
        return Object.assign({}, state, {
            lastProductCategorySlug: data.payload.slug
        })
    },

    [SET_SORT_OPTION]: (state, data) => {
        return Object.assign({}, state, {
            sortOption: data.payload.sortOption
        })
    },

    [SET_SEARCH_TEXT]: (state, data) => {
        return Object.assign({}, state, {
            searchText: data.payload.searchText
        })
    },

    [SET_LAST_COLLECTION_ID]: (state, data) => ({
        ...state,
        lastCollectionId: data.payload.collectionId
    })
});