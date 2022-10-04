import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Page from 'app/components/Page';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddressSearch from 'app/components/AddressSearch';
import AddressHistory from 'app/components/AddressHistory';

import { displayLoginPopup } from 'app/resources/action/Login';

import styles from './TippleWarehouse.module.scss';

class Home extends Component {
    render() {
        return <Page id="homepage" className={styles.wrap}>
            {this.props.cart && this.props.cart.items && this.props.cart.items.length > 0 ? <div className="spacer"></div> : ''}

            <div className="home-top section spritz">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <img 
                                alt="Tipple Warehouse Logo" 
                                className="img-responsive img-warehouse-logo center-block" 
                                src="/static/assets/img/home/logo-warehouse.svg"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <h1 className="tagline font-size-45">Let The Drinks Come To You</h1>
                            <h2 className="sub-tagline brand-text-100 font-size-16">Exceptional range at warehouse prices.<br />Shipped to your door in 3-5 days.</h2>
                        </div>
                    </div>
                    <div className="row mt-24">
                        <div className="col-xs-12 text-center">
                            <span>
                                <AddressSearch history={this.props.history} extraWide buttonText={{ withAddress: 'Continue', withoutAddress: 'Go' }} />
                                <AddressHistory history={this.props.history} />
                            </span>
                        </div>
                    </div>
                    {!this.props.currentUser && <div className="row">
                        <div className="col-xs-12 text-center existing-user">
                            <p>Existing user? <a id="homeLoginLink" href="#login" onClick={this.props.displayLoginPopup}>Log in here</a>.</p>
                        </div>
                    </div>}
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <img alt="Warehouse Hero" className="img-responsive img-hero center-block" src="/static/assets/img/home/warehouse-hero.png"
                                srcSet="/static/assets/img/home/warehouse-hero.png,
                                    /static/assets/img/home/warehouse-hero@2x.png 2x" />
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>

            <div className="how-to-tipple section container-fluid white">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 text-center">
                            <h5>You shop. We ship. You sip!</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 step">
                            <div className="row">
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                                <div className="col-md-4 text-center">
                                    <img alt="Select Address" className="img-responsive center-block" src="/static/assets/img/home/select-drinks.png"
                                        srcSet="/static/assets/img/home/select-drinks.png,
                                            /static/assets/img/home/select-drinks@2x.png 2x" />
                                </div>
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
                        <div className="col-md-4 step">
                            <div className="row">
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                                <div className="col-md-4 text-center">
                                    <img alt="Select Drinks" className="img-responsive center-block" src="/static/assets/img/home/select-warehouse.png"
                                        srcSet="/static/assets/img/home/select-warehouse.png,
                                            /static/assets/img/home/select-warehouse@2x.png 2x" />
                                </div>
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    <h2>Warehouse Prices</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    Get your Tipple order cheaper than ever with warehouse pricing across our range.
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 step">
                            <div className="row">
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                                <div className="col-md-4 text-center">
                                    <img alt="Delivered" className="img-responsive center-block" src="/static/assets/img/home/select-door.png"
                                        srcSet="/static/assets/img/home/select-door.png,
                                            /static/assets/img/home/select-door@2x.png 2x" />
                                </div>
                                <div className="col-md-4 hidden-xs hidden-sm"></div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    <h2>Shipped To Your Door</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 text-center">
                                    Sit back, relax and we’ll have it shipped &amp; ready to sip  in as little as 3 business days.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="get-the-app section container-fluid">
                <div className="container">
                    <div className="row vertical-align">
                        <div className="col-md-4 clearfix">
                            <div className="row">
                                <div className="col-xs-12">
                                    <h5>Get Free Shipping</h5>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <p>Spend over $100 on your Tipple Warehouse order to receive free shipping with your order.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 clearfix">
                            <img alt="Happy people with Free Shipping" className="img-responsive pull-right img-abs" src="/static/assets/img/home/happy-people.png"
                                srcSet="/static/assets/img/home/happy-people.png,
                                    /static/assets/img/home/happy-people@2x.png 2x" />
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
                                    <h6>What is Tipple Warehouse?</h6>
                                    <p>
                                        Tipple Warehouse is our all new shipping service, delivering more products to more locations than ever before! Tipple 
                                        Warehouse orders are fulfilled by us directly and shipped to your door within 5 business days via Australia Post, 
                                        allowing users outside of our On Demand zone to get Tippling. You shop, we ship, you sip!
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <h6>How long will my order take to arrive?</h6>
                                    <p>
                                        Your order will be delivered through Australia Post within 5 business days from the day that you place your order. Once 
                                        your order has been packed and picked up by Australia Post, we’ll provide you with a tracking number to track your delivery. 
                                        Alternatively, contact us via LiveChat or email us at support@tipple.com.au and we’d be happy to update you on your order 
                                        status.
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <h6>What if I am not present when the delivery is being dropped off?</h6>
                                    <p>
                                        If you aren’t at home, Australia Post will take the goods to a local post office and leave you a card so you can collect the 
                                        goods within 14 days. Alternatively, you can advise Australia Post to leave the goods in a safe place near your front door.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-md-4">
                                    <h6>How much is shipping and is there a minimum order for delivery?</h6>
                                    <p>
                                        For orders under $100 we charge a flat rate shipping fee of $10. For orders over $100, shipping is free! There is no minimum 
                                        order for delivery, however some larger orders may take additional time to be delivered and in those cases we will be in 
                                        contact to keep you informed.
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <h6>Who do I contact if I have an issue with my order?</h6>
                                    <p>
                                        If there are any issues with your order, contact us on Live chat via the Tipple Warehouse website or email us directly at <a href="mailto:support@tipple.com.au">support@tipple.com.au</a> so we can work out the best way to get things rectified for you.
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <h6>Why can’t I get my order delivered on demand in my area?</h6>
                                    <p>
                                        For the moment, on demand delivery is only available in metropolitan Melbourne and Sydney due to the geographical constraints 
                                        that come with our 30 minute delivery promise. We’re working as hard as we can to bring on demand delivery to more areas across 
                                        Australia!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 text-center">
                            <p className="large">
                                <Link to="/content/faq">More Questions? <i className="material-icons">&#xE8E4;</i></Link>
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