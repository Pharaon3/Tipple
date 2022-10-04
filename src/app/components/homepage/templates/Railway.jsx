import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShopButton from '../ShopButton';
import { displayLoginPopup } from 'app/resources/action/Login';

import landingStyles from '../Landing.module.scss';
import styles from './Railway.module.scss';

const staticAssetsPath = process.env.PUBLIC_URL + '/static/assets/theme/railway/';

export class RailwayHomepage extends Component {

    backToTop = () => {
        window.scrollTo(0, 0);
    };

    render() {
        return (
            <div className={landingStyles.landing}>
                <div className={classNames(styles.top, landingStyles.top, landingStyles.section)}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h1 className={landingStyles.tagline}>The Railway Hotel</h1>
                                <h2 className={landingStyles.subtagline}>Windsor's famous 24/7 Bottle Shop</h2>
                            </div>
                        </div>
                        <div className={classNames(landingStyles.shopnow, this.props.currentUser && landingStyles.loggedIn, 'row')}>
                            <div className="col-xs-12 text-center">
                                <ShopButton label="Go" className={styles['btn-black']} history={this.props.history}/>
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
                                <img alt="Dancing Drivers" className="img-responsive center-block" src={staticAssetsPath + 'img/railway.png'} />
                            </div>
                            <div className="col-md-3"></div>
                        </div>
                    </div>
                </div>

                <div className={classNames(landingStyles.howto, landingStyles.section)}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h5>How It Works</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className={classNames(landingStyles.step, 'col-md-4')}>
                                <div className="row">
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                    <div className="col-md-4 text-center"><img alt="Select Address" className="img-responsive center-block" src={staticAssetsPath + 'img/icon-address.svg'} /></div>
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <h2>Enter Your Delivery Address</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        We’ll check if you’re inside our delivery zone
                    </div>
                                </div>
                            </div>
                            <div className={classNames(landingStyles.step, 'col-md-4')}>
                                <div className="row">
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                    <div className="col-md-4 text-center"><img alt="Select Drinks" className="img-responsive center-block" src={staticAssetsPath + 'img/icon-products.svg'} /></div>
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <h2>Browse Our Huge Range</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        Available 24/7 for delivery when you need it most
                                    </div>
                                </div>
                            </div>
                            <div className={classNames(landingStyles.step, 'col-md-4')}>
                                <div className="row">
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                    <div className="col-md-4 text-center"><img alt="Delivered" className="img-responsive center-block" src={staticAssetsPath + 'img/icon-delivered.svg'} /></div>
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <h2>Get it Delivered</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        Delivered cold and fast directly to your door
                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={classNames(landingStyles.section, landingStyles['bg-primary'])}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h5>Ready to Shop?</h5>
                                <p className="mb-24">Enter your address to start shopping now!</p>
                                <ShopButton label="Browse Now" className={styles['btn-black']} history={this.props.history}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }

}

const mapStateToProps = ({ auth }) => ({
    currentUser: auth?.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    displayLoginPopup: bindActionCreators(displayLoginPopup, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RailwayHomepage);