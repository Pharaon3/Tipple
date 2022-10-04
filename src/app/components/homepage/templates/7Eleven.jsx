import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShopButton from '../ShopButton';
import { displayLoginPopup } from 'app/resources/action/Login';

import landingStyles from '../Landing.module.scss';
import styles from './SevenEleven.module.scss'; // cause ./7Eleven.module.scss WILL NOT WORK

const staticAssetsPath = process.env.PUBLIC_URL + '/static/assets/theme/7eleven/';

export class SevenElevenHomepage extends Component {

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
                                <h1 className={landingStyles.tagline}>7-Eleven <br />Now Delivering</h1>
                                <h2 className={landingStyles.subtagline}>Everyday essentials delivered straight to your door.</h2>
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
                                <img alt="Dancing Drivers" className="img-responsive center-block" src={staticAssetsPath + 'img/310320_7ElevenTipple_HeaderImage_600x300-01.png'} />
                            </div>
                            <div className="col-md-3"></div>
                        </div>
                    </div>
                </div>

                <div className={classNames(landingStyles.howto, landingStyles.section)}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h5>Quick &amp; Easy, Delivered to You</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className={classNames(landingStyles.step, 'col-md-4')}>
                                <div className="row">
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                    <div className="col-md-4 text-center"><img alt="Select Address" className="img-responsive center-block" src={staticAssetsPath + 'img/Tipplex7Eleven_Web_Icons_100x100_Essentials.png'} /></div>
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <h2>Essentials</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        No need to go out when you run out. We have your everyday needs covered.
                                </div>
                                </div>
                            </div>
                            <div className={classNames(landingStyles.step, 'col-md-4')}>
                                <div className="row">
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                    <div className="col-md-4 text-center"><img alt="Select Drinks" className="img-responsive center-block" src={staticAssetsPath + 'img/Tipplex7Eleven_Web_Icons_100x100_chocolate.png'} /></div>
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <h2>Snacks</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        Now the chocolate can run to you. We have all your snack needs sorted.
                                </div>
                                </div>
                            </div>
                            <div className={classNames(landingStyles.step, 'col-md-4')}>
                                <div className="row">
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                    <div className="col-md-4 text-center"><img alt="Delivered" className="img-responsive center-block" src={staticAssetsPath + 'img/Tipplex7Eleven_Web_Icons_100x100_Contactless.png'} /></div>
                                    <div className="col-md-4 hidden-xs hidden-sm"></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        <h2>We Bring The Store To You</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-center">
                                        Place your order and we’ll bring it to your door, letting you know when it’s about to arrive.
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
                                <h5>Running Low?</h5>
                                <p className="mb-24">No need to go out when you run out.</p>
                                <ShopButton label="Browse Now" className={classNames(landingStyles.storeButton, 'btn btn-primary')} history={this.props.history} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SevenElevenHomepage);