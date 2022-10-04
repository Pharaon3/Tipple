import { SplitFactory } from '@splitsoftware/splitio';
import config from '../app/config';

let client = null;
let clientId = null;
const defaultClientKey = 'web-guest';

const createClient = (clientKey = defaultClientKey) => {
    const factory = SplitFactory({
        core: {
            authorizationKey: config.splitIoAuthorizationKey,
            key: clientKey,
            trafficType: config.splitIoTrafficType
        },
        scheduler: {
            impressionsRefreshRate: 10
        }
    });

    return factory.client();
};

export const getClient = (userId = defaultClientKey, onReady, onUpdate, onTimeout) => {

    // If we don't need a new client, just fire the update function
    if (clientId === userId) {
        onUpdate(client);

        return client;
    }

    if (client !== null) {
        client.destroy();
        client = null;
    }

    clientId = userId;
    client = createClient(userId);

    client.on(client.Event.SDK_READY, () => onReady(client));
    client.on(client.Event.SDK_UPDATE, () => onUpdate(client));
    client.on(client.Event.SDK_READY_TIMED_OUT, () => onTimeout());
    
    return client;
};

export default {
    getClient
};
