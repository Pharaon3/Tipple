import { getHostname } from 'app/utils/getHostname';

export const getDomainConfig = themeConfig => {
    const hostname = getHostname().replace(/\.xyz$/, '.com.au').toLowerCase();
    const key = Object.keys(themeConfig.domains).find(key => key.toLowerCase() === hostname);
    return themeConfig.domains[key] ?? {};
};

export default {
    getDomainConfig
};