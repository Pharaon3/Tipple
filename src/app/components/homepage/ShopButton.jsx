import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { LANDING_SHOP_BUTTON_TEXT } from 'lib/constants/strings';
import { AnalyticsEvents } from 'lib/analytics';

import styles from './ShopButton.module.scss';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {confirmAddress} from "../../resources/action/Address";

const ShopButton = ({ label = LANDING_SHOP_BUTTON_TEXT, className, children, ...props }) => {
    const history = useHistory();
    const theme = useSelector(store => store.theme);
    const cart = useSelector(store => store.cart?.currentCart ?? {});
    const geocodedAddress = useSelector( store => store.address?.geocodedAddress);
    const storePath = (cart?.storePath ?? (theme?.storePath ?? '/bottleshop').concat('/victoria/melbourne')).concat('/categories');

    const handleClick = () => {
        window.tippleAnalytics.trigger(AnalyticsEvents.address_entry_started, {});

        if(geocodedAddress){
            props.confirmAddress(geocodedAddress, props.auth, props.history);
        }
        history.push(`${storePath}?addressIfNone=y`);
    };

    return (
        <div className={styles.wrap}>
            <button className={classNames('btn btn-primary', styles.button, className)} onClick={handleClick}>
                {children}
                {!children && label}
            </button>
        </div>
    );
};

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    geocodedAddress : state.address.geocodedAddress
})

const mapDispatchToProps = (dispatch) => ({
    confirmAddress: bindActionCreators(confirmAddress, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopButton);