import { AnalyticsEvents } from 'lib/analytics';

export const INTERACTIONS = {
    SCROLL: 'SCROLL',
    OPEN: 'OPEN',
    SEE_ALL: 'SEE_ALL',
    VIEW_MORE: 'VIEW_MORE',
    ITEM_ADDED: 'ITEM_ADDED',
    ITEM_REMOVED: 'ITEM_REMOVED'
};

export const triggerAnalytics = (collection, interaction, from = null, item = null, position = null, count = null) => {
    if (collection && typeof window !== 'undefined') {
        let clickProps = {};

        if (interaction === INTERACTIONS.OPEN) {
            clickProps = {
                item_id: item?.relatedCollectionId,
                item_name: item?.name,
                item_position: position,
                item_type: item?.type,
                promotion_ref: item?.bundleReferencePath 
            };
        }

        global.tippleAnalytics.trigger(AnalyticsEvents.collection_interaction, 
            {
                interaction,
                id: collection?.id,
                name: collection?.name,
                type: collection?.displayType,
                from,
                count,
                ...clickProps
            }
        );
    }
};

export default {
    triggerAnalytics
};