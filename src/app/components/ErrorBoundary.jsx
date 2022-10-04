import React from 'react';
import { useSelector } from 'react-redux';
import Loadable from 'react-loadable';
import DefaultErrorBoundary from 'app/components/error-boundary/templates/DefaultErrorBoundary';

const loadingError = (props) => {
    if (props.error) {
        throw new Error("CHUNK FAILED");
    }
    return null;
}

const templates = {
    default: DefaultErrorBoundary,
    '7Eleven': Loadable({
        loader: () => import(/* webpackChunkName: "7ElevenErrorBoundary" */ 'app/components/error-boundary/templates/7ElevenErrorBoundary'),
        loading: loadingError,
        modules: ['7ElevenErrorBoundary'],
        webpack: () => [require.resolveWeak('app/components/error-boundary/templates/7ElevenErrorBoundary')]
    }),
    'YouFoodz': Loadable({
        loader: () => import(/* webpackChunkName: "YouFoodzErrorBoundary" */ 'app/components/error-boundary/templates/YouFoodzErrorBoundary'),
        loading: loadingError,
        modules: ['YouFoodzErrorBoundary'],
        webpack: () => [require.resolveWeak('app/components/error-boundary/templates/YouFoodzErrorBoundary')]
    })
}

const ErrorBoundary = (props) => {
    const theme = useSelector(store => store.theme);
    const themeName = theme?.name ?? 'default';
    const ErrorBoundaryComponent = templates[themeName] ?? templates['default'];
    return <ErrorBoundaryComponent {...props} />
}

export default ErrorBoundary;