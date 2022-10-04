import rest from 'lib/api/rest';
import actionCreatorsFor from 'lib/api/actionCreatorsFor';
import reducersFor from 'lib/api/reducersFor';
import reducerRegistry from 'lib/reducerRegistry';

import config from 'app/config';

const onReceive = (data) => {
    return data;
};

const onSend = (data) => {    
    return data;
};

const path = (id, params, token) => {
    return `${config.baseURI}/content`;
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
