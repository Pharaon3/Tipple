export const collectionLinkUrl = (item, to) => {
    switch(item.type) {
        case 'PRODUCT': {
            return `/product/${item.slug}`;
        }
        case 'COLLECTION': {
            return `${to}?collection=${item.relatedCollectionId}&title=${encodeURIComponent(item.heading?.title ?? item.name)}`;
        }
        case 'BUNDLE_BUILDER': {
            // todo: better approach on removing /categories from path
            const path = to.replace('/categories', '/');
            return `${path}collection/${item.slug}/bundle`;
        }
        default: {
            return null;
        }
    }
};