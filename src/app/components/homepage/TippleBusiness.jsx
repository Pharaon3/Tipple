import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Page from 'app/components/Page';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddressSearch from 'app/components/AddressSearch';
import AddressHistory from 'app/components/AddressHistory';

import { displayLoginPopup } from 'app/resources/action/Login';

import styles from './TippleBusiness.module.scss';

class Home extends Component {
    render() {
        return <Page id="homepage" className={styles.wrap}>
            {this.props.cart && this.props.cart.items && this.props.cart.items.length > 0 ? <div className="spacer"></div> : ''}

            <div className="home-top section spritz">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <img 
                                alt="Tipple Business Logo" 
                                className="img-responsive img-business-logo center-block" 
                                src="/static/assets/img/home/logo-business.svg"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <h1 className="tagline brand-text-100 font-size-45">Tipple For The Office</h1>
                            <h2 className="sub-tagline brand-text-100 font-size-16">Wine, beer, spirits and more delivered to your office cold in 30 minutes.</h2>
                        </div>
                    </div>
                    <div className="row mt-24">
                        <div className="col-xs-12 text-center">
                            <span>
                                <AddressSearch history={this.props.history} />
                                <AddressHistory history={this.props.history} />
                            </span>
                        </div>
                    </div>
                    {!this.props.currentUser && <div className="row">
                        <div className="col-xs-12 text-center">
                            <p>Existing user? <a id="homeLoginLink" href="#login" onClick={this.props.displayLoginPopup}>Log in here</a>.</p>
                        </div>
                    </div>}
                    <div className="row mt-48">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <img alt="Business Party" className="img-responsive center-block" src="/static/assets/img/home/business-hero.svg" />
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>

            <div className="how-to-tipple section container-fluid white">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <h5>How Tipple Business Works</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 step">
                            <div className="row">
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                                <div className="col-md-4 text-center"><img alt="Discounted Pricing" className="img-responsive center-block" src="/static/assets/img/home/select-discounted.svg" /></div>
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    <h2>Discounted pricing</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    View prices and products available for delivery to your area. Available in over 210 suburbs across Melbourne and Sydney. 
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 step">
                            <div className="row">
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                                <div className="col-md-4 text-center"><img alt="Arrives Cold" className="img-responsive center-block" src="/static/assets/img/home/select-arrives-cold.svg" /></div>
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    <h2>Arrives ready to drink cold</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    All of your favourite beer, wine and spirits brands in one place. Order your favourites or discover something new.
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 step">
                            <div className="row">
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                                <div className="col-md-4 text-center"><img alt="Range of products" className="img-responsive center-block" src="/static/assets/img/home/select-drinks.svg" /></div>
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    <h2>Range of products crafted for the office</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    Sit back and relax while our Tipple riders deliver your order in 30 minutes. Fast and cold, just the way it should be.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="free-delivery section container-fluid">
                <div className="container">
                    <div className="row vertical-align">
                        <div className="col-md-6 col-sm-8 clearfix">
                            <div className="row">
                                <div className="col-xs-12">
                                    <h5>Order a day ahead for free delivery</h5>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
                                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-4 clearfix">
                            <img alt="Free Delivery" className="img-responsive img-right" src="/static/assets/img/home/free-delivery.svg" />
                        </div>

                    </div>
                </div>
            </div>
            <div className="faq section container-fluid white">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <h5>FAQ</h5>
                        </div>
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6>Where Do You Deliver?</h6>
                                    <p>Tipple is available for delivery to over 120 suburbs across Melbourne and Sydney. Enter your delivery address at the top of the page to see if our alcohol delivery service is available in your area.</p>
                                </div>
                                <div className="col-md-4">
                                    <h6>What Are Your Operation Hours?</h6>
                                    <p>Tipple is available for delivery in most areas from midday until 11pm. Check your location's exact delivery times by entering your address above. Our store is open 24/7 to schedule orders for delivery ahead of time within these hours.</p>
                                </div>
                                <div className="col-md-4">
                                    <h6>How Much Does Delivery Cost?</h6>
                                    <p>All delivieres on Tipple are charged at a flat rate of $7.95 per order, regardless of your location. In order to keep our delivery fee as low as possible our minimum order is $30.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6>Do I Need ID?</h6>
                                    <p>To ensure we're delivering your alcohol responsibly we require photo identification upon delivery. We'll cross reference this with your order details for verification.</p>
                                </div>
                                <div className="col-md-4">
                                    <h6>Why Isn't Tipple in My Area?</h6>
                                    <p>Tipple is only available in areas where we can ensure delivery in 30 minutes. We're working hard to expand to more areas soon!</p>
                                </div>
                                <div className="col-md-4">
                                    <h6>Do You Deliver to Offices?</h6>
                                    <p>Of course we do! Friday night drinks will never be the same with Tipple. Schedule your drinks to arrive cold when you need it or on demand. Get in touch if you'd like to set up a regular office order.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 text-center">
                            <p className="large">
                                <Link to="/content/faq">More Questions? Get in Touch <i className="material-icons">&#xE8E4;</i></Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    }

}

const mapStateToProps = (state, props) => ({
    currentUser: state.auth.currentUser,
    currentCart: state.cart.currentCart
});

const mapDispatchToProps = (dispatch) => ({
    displayLoginPopup: bindActionCreators(displayLoginPopup, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);