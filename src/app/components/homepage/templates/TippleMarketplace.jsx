import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShopButton from '../ShopButton';
import { displayLoginPopup } from 'app/resources/action/Login';

import landingStyles from '../Landing.module.scss';
import styles from './TippleMarketplace.module.scss';

const staticAssetsPath = process.env.PUBLIC_URL + '/static/assets/theme/tipplemarketplace/';

export class MarketplaceHomepage extends Component {

    backToTop = () => {
        window.scrollTo(0, 0);
    };

    render() {
        return (
            <div className={landingStyles.landing}>
            <div className={classNames(styles.top, landingStyles.top, styles.section)}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h1 className={classNames(landingStyles.tagline, styles.heading)}>Your Tipple Faves<br />Shipped Direct</h1>
                                <h2 className={classNames(landingStyles.subtagline, styles.heading)}>Exceptional range at warehouse prices.<br />Shipped to your door in 3-5 days.</h2>
                            </div>
                        </div>
                        <div className={classNames(landingStyles.shopnow, this.props.currentUser && landingStyles.loggedIn, 'row')}>
                            <div className="col-xs-12 text-center">
                                <ShopButton className={styles.btn} history={this.props.history}/>
                            </div>
                        </div>
                        {!this.props.currentUser && <div className={classNames(landingStyles.login, 'row')}>
                            <div className="col-xs-12 text-center">
                                <p>Already have an account? <a id="homeLoginLink" href="#login" onClick={this.props.displayLoginPopup}>Log in here</a>.</p>
                            </div>
                        </div>}
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6">
                                <img alt="Tipple Marketplace" className={classNames(styles.hero, 'img-responsive center-block')} src={staticAssetsPath + 'img/hero.svg'} />
                            </div>
                            <div className="col-md-3"></div>
                        </div>
                    </div>
                </div>

                <div className={classNames(styles.howto, landingStyles.section)}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h5>You shop. We ship. You sip!</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className={classNames(landingStyles.step, 'col-md-4')}>
                                <div className="row">
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                    <div className="col-md-4 text-center"><img alt="Select Address" className="img-responsive center-block" src={staticAssetsPath + 'img/icon-products.svg'} /></div>
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <h2>Thousands of Products</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        Shop from a huge range of your fave beer, wine and spirit brands all in one place.
                    </div>
                                </div>
                            </div>
                            <div className={classNames(landingStyles.step, 'col-md-4')}>
                                <div className="row">
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                    <div className="col-md-4 text-center"><img alt="Select Drinks" className="img-responsive center-block" src={staticAssetsPath + 'img/icon-prices.svg'} /></div>
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <h2>Bargain Prices</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        Get your Tipple order cheaper than ever with warehouse pricing across our range.
                    </div>
                                </div>
                            </div>
                            <div className={classNames(landingStyles.step, 'col-md-4')}>
                                <div className="row">
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                    <div className="col-md-4 text-center"><img alt="Delivered" className="img-responsive center-block" src={staticAssetsPath + 'img/icon-shipped.svg'} /></div>
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <h2>Shipped Direct</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        Sit back, relax and we’ll have it shipped & ready to sip as early as tomorrow.
                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={classNames(landingStyles.section)}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h5>Get Free Shipping</h5>
                                <p className="mb-24">Spend over $100 to get FREE shipping on your Marketplace order!</p>
                                <ShopButton className={classNames(styles.btn, styles['btn-cta'])} history={this.props.history}/>
                                <img alt="Tipple People" className="img-responsive center-block" src={staticAssetsPath + 'img/happy-people.svg'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }

}

const mapStateToProps = ({ auth }) => ({
    currentUser: auth.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    displayLoginPopup: bindActionCreators(displayLoginPopup, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceHomepage);