import rest from 'lib/api/rest';
import actionCreatorsFor from 'lib/api/actionCreatorsFor';
import reducersFor from 'lib/api/reducersFor';
import reducerRegistry from 'lib/reducerRegistry';
import { createSelector } from 'reselect';

import config from 'app/config';

// Selectors
const getAllHomeCategories = state => state.HOME?.item?.categories ?? [];

export const getHomeCategories = createSelector(
    [getAllHomeCategories],
    (homeCategories) => {
        return homeCategories.filter(cat => cat.status === 'ACTIVE' && cat.visibleAtHome);
    }
);


// Redux

const onReceive = (data) => {
    // data.data.categories.forEach(

    // );

    return data.data;
};

const onSend = (data) => {    
    return data;
};

const path = (id, params, token) => {
    return `${config.baseURI}/home`;
};

export default function registerRedux(storePath, types) {

    const reducers = reducersFor(storePath, types);
    
    reducerRegistry.register(storePath, reducers);

    return {
        actionCreators: actionCreatorsFor(storePath, types, rest(path, onReceive, onSend), {
            hasMeta: true,
        }),        
        reducers: reducers
    }

}
