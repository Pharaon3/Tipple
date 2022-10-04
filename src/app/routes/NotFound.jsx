import React from 'react';
import Page from 'app/components/Page';
import NotFound from 'app/components/notfound/templates/DefaultNotFound';
import Loadable from 'react-loadable';
import { useSelector } from 'react-redux';

const loadingError = (props) => {
    if (props.error) {
        throw new Error("CHUNK FAILED");
    }
    return null;
}

const templates = {
    default: NotFound,
    '7Eleven': Loadable({
        loader: () => import(/* webpackChunkName: "7ElevenNotFound" */ 'app/components/notfound/templates/7ElevenNotFound'),
        loading: loadingError,
        modules: ['7ElevenNotFound'],
        webpack: () => [require.resolveWeak('app/components/notfound/templates/7ElevenNotFound')]
    }),
    'YouFoodz': Loadable({
        loader: () => import(/* webpackChunkName: "YouFoodzNotFound" */ 'app/components/notfound/templates/YouFoodzNotFound'),
        loading: loadingError,
        modules: ['YouFoodzNotFound'],
        webpack: () => [require.resolveWeak('app/components/notfound/templates/YouFoodzNotFound')]
    })
};

export default () => {

    const theme = useSelector(store => store.theme);
    const themeName = theme.name ?? 'default';
    const NotFoundComponent = templates[themeName] ?? templates['default'];

    return (
        <Page
            id="not-found"
            description="This is embarrassing."
            noCrawl
        >
            <NotFoundComponent />
        </Page>
    );
};
