import themeConfig from 'app/themeConfig';
import { getDomainConfig } from 'lib/util/theme';

const LANDBOT_PLATFORM = 'Web';
const LANDBOT_APP = 'Customer';

export const getLandbotUrl = (path, theme) => {
    if (/\/order\/(.+)\/tracking/gi.test(path) || /\/track\/(.+)/gi.test(path)) {
        return theme?.landbotOrderV3 ?? theme?.landbotSupportV3;
    }

    return theme?.landbotSupportV3;
};

export const isOrderTrackingUrl = (landbotUrl, theme) => landbotUrl === theme?.landbotOrderV3 && theme?.landbotOrderV3 !== theme?.landbotSupportV3;

export const getLandbotCustomData = (theme, isOrderTracking = false, currentUser = {}, order = {}) => {
    const domainConfig = getDomainConfig(themeConfig);
    const hostname = (window?.location?.hostname ?? '');

    const baseData = {
        ID: currentUser?.id ?? null,
        Name: (currentUser?.firstname ?? '').concat(currentUser?.lastname ? ` ${currentUser.lastname}` : '') ?? null,
        Email: currentUser?.email ?? null,
        Phone: currentUser?.mobile ?? null,
        site_id: domainConfig?.siteId ?? 1,
        platform: LANDBOT_PLATFORM,
        app: LANDBOT_APP,
        env: (hostname.indexOf('.xyz') !== -1 || hostname.indexOf('localhost') !== -1) ? 'staging' : 'production',
        version: process?.env?.REACT_APP_VERSION ?? null,
        site_name: theme?.siteName ?? 'Tipple',
        store_id: currentUser?.storeId ?? null
    };

    if (isOrderTracking) {
        return {
            ...baseData,
            order_number: order?.orderNumber,
            order_status: order?.status
        };
    }

    return baseData;
};

export default {
    getLandbotUrl,
    isOrderTrackingUrl,
    getLandbotCustomData
};