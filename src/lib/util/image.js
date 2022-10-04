import config from 'app/config';

export const imageUrl = (url = '', prefix = '') => String(url).indexOf('http') === 0 ? String(url) : config.imageBase.concat(`/${prefix}${String(url)}`);

export default {
    imageUrl
};