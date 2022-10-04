import config from 'app/config';
import { SITE_ID_BUSINESS, SITE_ID_WAREHOUSE } from 'lib/constants/app';
import { getItem } from './localStorage';

const siteId = getItem('tipple_site_id') || config.siteId;
export const isTippleBusiness = siteId === SITE_ID_BUSINESS;
export const isTippleWarehouse = siteId === SITE_ID_WAREHOUSE;

export default {
    isTippleBusiness,
    isTippleWarehouse
};