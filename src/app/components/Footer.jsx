import React from 'react';
import { useSelector } from 'react-redux';
import Loadable from 'react-loadable';
import DefaultFooter from 'app/components/footer/templates/DefaultFooter';

const loadingError = (props) => {
    if (props.error) {
        throw new Error("CHUNK FAILED");
    }
    return null;
}

const templates = {
    default: DefaultFooter,
    '7Eleven': Loadable({
        loader: () => import(/* webpackChunkName: "7ElevenFooter" */ 'app/components/footer/templates/7Eleven'),
        loading: loadingError,
        modules: ['7ElevenFooter'],
        webpack: () => [require.resolveWeak('app/components/footer/templates/7Eleven')] // Prevents white flash
    }),
    'Railway': Loadable({
        loader: () => import(/* webpackChunkName: "RailwayFooter" */ 'app/components/footer/templates/Railway'),
        loading: loadingError,
        modules: ['RailwayFooter'],
        webpack: () => [require.resolveWeak('app/components/footer/templates/Railway')] // Prevents white flash
    }),
    'YouFoodz': Loadable({
        loader: () => import(/* webpackChunkName: "YouFoodzFooter" */ 'app/components/footer/templates/YouFoodz'),
        loading: loadingError,
        modules: ['YouFoodzFooter'],
        webpack: () => [require.resolveWeak('app/components/footer/templates/YouFoodz')] // Prevents white flash
    }),
    'Wotapopup': Loadable({
        loader: () => import(/* webpackChunkName: "WotapopupFooter" */ 'app/components/footer/templates/Wotapopup'),
        loading: loadingError,
        modules: ['WotapopupFooter'],
        webpack: () => [require.resolveWeak('app/components/footer/templates/Wotapopup')] // Prevents white flash
    })
}

const Footer = (props) => {
    const theme = useSelector(store => store.theme);
    const componentName = theme?.footerComponent ?? 'default';
    const FooterComponent = templates[componentName] ?? templates['default'];
    return <FooterComponent {...props} />;
}

export default Footer;