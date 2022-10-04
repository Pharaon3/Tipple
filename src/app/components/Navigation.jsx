import React, { Component } from 'react';
import classNames from 'classnames';

import PrimaryMenu from './navigation/PrimaryMenu';
import GlobalSearch from './navigation/GlobalSearch';
import AddressSelector from './navigation/AddressSelector';
import LinkCart from './navigation/LinkCart';
import { wasServerRendered } from 'store';
import { PUBLIC_ICON_FOLDER } from 'lib/constants/app';

import { connect } from 'react-redux';

import styles from './Navigation.module.scss';

class Navigation extends Component {

    state = {
        searchVisible: false
    };

    nav = (ev) => {
        ev.preventDefault();
        let shouldRedirectToHome = !this.props.cart.currentCart || ((this.props.history.location.pathname.endsWith("categories") && (this.props.history?.location?.search === '' || this.props.history?.location?.search === '?addressIfNone=y')) || this.props.history.location.pathname === "/");
        this.props.history.push(shouldRedirectToHome ? "/" : this.props.cart.currentCart.storePath + "/categories")
    }

    handleSearchVisibility = isVisible => {
        this.setState(() => ({
            searchVisible: isVisible
        }));
    };

    render() {
        const { splitFeaturesRead, theme, showMobileAddressSelector } = this.props;
        const { searchVisible } = this.state;
        const hasCartItems = this.props.cart?.currentCart?.items?.length > 0 ?? false;

        if (!splitFeaturesRead && !wasServerRendered()) {
            return null;
        }

        const assetPath = theme?.name ? `/static/assets/theme/${theme?.name.toLowerCase()}/img/` : PUBLIC_ICON_FOLDER;

        const logo = theme?.headerLogoURL ? 
            <img alt="Logo" 
                src={(theme.headerLogoURL.charAt(0) === '/' ? process.env.PUBLIC_URL : '') 
                    + theme.headerLogoURL} 
                className={classNames(styles['custom-logo'])} />
            :
            <img alt="Logo" src="/static/assets/img/tipple_orange_logo.svg" className={classNames(styles.logo, 'img-responsive')} />   
            ;

        return <nav className={classNames(styles.nav)}>
            <div className={classNames(styles['container-fluid'], styles.navigation, !searchVisible && !showMobileAddressSelector && styles.shadow, showMobileAddressSelector && styles.desktopShadow)}>
                <div className={styles.container}>
                    <div className={styles.bar}>
                        <a href="/" onClick={this.nav}>
                            {logo}
                        </a>
                        <span className={styles.divider}></span>
                        <PrimaryMenu history={this.props.history} user={this.props.currentUser} cart={this.props.cart.currentCart} />
                        <AddressSelector showMobile={showMobileAddressSelector} />
                        <div className={styles.right}>
                            <GlobalSearch assetPath={assetPath} wrapperClassName={classNames(styles['container-fluid'], styles.navigation)} onSearchToggled={this.handleSearchVisibility} />
                            {hasCartItems && <LinkCart className={styles.linkCart} assetPath={assetPath} cartItemCount={this.props.cart?.cartItemCount ?? 0} />}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    }
}

const mapStateToProps = (state, props) => ({
    theme: state.theme,
    currentUser: state.auth.currentUser,
    cart: state.cart,
    splitFeaturesRead: state.features ? state.features.featuresRead : null
});

export default connect(mapStateToProps, () => ({}))(Navigation);