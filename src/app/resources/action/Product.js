import {
    SET_LAST_PRODUCT_CATEGORY_SLUG, 
    SET_SORT_OPTION, SET_SEARCH_TEXT,
    SET_LAST_COLLECTION_ID
} from '../constants/Product';

export function setLastProductCategorySlug(slug) {
    return function (dispatch) {
        dispatch({
            type: SET_LAST_PRODUCT_CATEGORY_SLUG,
            payload: {
                slug: slug
            }
        });
    }   
 }
 
 export function setSortOption(sortOption) {
    return function (dispatch) {
        dispatch({
            type: SET_SORT_OPTION,
            payload: {
                sortOption: sortOption
            }
        });
    }   
 }
 
 export function setSearchText(searchText) {
    return function (dispatch) {
        dispatch({
            type: SET_SEARCH_TEXT,
            payload: {
                searchText: searchText
            }
        });
    }   
 }

 export const setLastCollectionId = collectionId => {
     return function (dispatch) {
         dispatch({
             type: SET_LAST_COLLECTION_ID,
             payload: {
                 collectionId: parseInt(collectionId, 10)
             }
         });
     };
 };