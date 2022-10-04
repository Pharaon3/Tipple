import React, { Component } from "react";
import Page from "app/components/Page";
import { connect } from "react-redux";
import { ssrComponent } from "lib/ssrHelper";
import { bindActionCreators } from "redux";
import ShopButton from 'app/components/homepage/ShopButton';
import classNames from 'classnames';

import { displayLoginPopup } from "app/resources/action/Login";

import styles from './DeliveryPage.module.scss';

class BeerDelivery extends Component {
    constructor() {
        super();

        this.state = {};
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    static async getInitialProps(props) { }

    render() {
        return (
            <Page id="beerDelivery" className={styles.wrap} title="Beer Delivery - Tipple Alcohol Delivery" description="Beer delivery made easy. Browse 500+ products and get it delivered cold and fast with Tipple alcohol delivery.">
                <div className="container-fluid jumbotron jumbotron-fluid hero-image hero-image-beer">
                    <div className="container container-wide banner-text">
                        <h1 className="Liquor-Delivery">Beer Delivery</h1>
                        <h2 className="We-only-stock-the-be">All your favourite beers delivered.</h2>
                        <ShopButton label="Browse Our Beer Range" className={classNames(styles.shopBtn, 'btn btn-primary hero-button')} />
                    </div>
                </div>

                <div className="Responsive-banner-text container-fluid white">
                    <div className="container container-wide">
                        <div className="row">
                            <h1 className="Liquor-Delivery">Beer Delivery</h1>
                            <h2 className="We-only-stock-the-be">All your favourite beers delivered.</h2>
                            <ShopButton label="Browse Our Beer Range" className={classNames(styles.shopBtn, 'btn btn-primary hero-button')} />
                        </div>
                    </div>
                </div>

                <div className="About-our-beer-range section container-fluid white">
                    <div className="container container-wide padding-left-xs">
                        <div className="row vertical-align">
                            <h2 className="About-our-beer-range-title">About Our Beer Delivery Range</h2>
                        </div>
                        <div className="About-our-beer-range-columns row">
                            <div className="col-xs-12 clearfix">
                                With our huge range of craft, imported and local beers spanning every beer style and country of origin imaginable, you’re bound to find the perfect brew for you on Tipple. Whether you’re searching for a hoppy craft beer favourite, an imported specialty beer you love or just hanging for a tried-and-true local brew - we’ve got it all, delivered ice cold in a flash!
                          </div>
                        </div>
                    </div>
                </div>

                <div className="Items-container section container-fluid white no-padding-top">
                    <div className="container container-wide padding-left-xs">
                        <div className="row vertical-align">
                            <h3 className="Items-title clearfix">Craft Beer Delivery</h3>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">Whether you like it fruity, hoppy, malty or funky - we’ve got the perfect cure for what ales you.</p>
                            </div>
                        </div>
                        <div className="Craft Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Craft Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/BalterXPACans.png" />
                                <p className="item-title">Balter XPA</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Craft Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/StoneWoodPacific.png" />
                                <p className="item-title">Stone &amp; Wood Pacific Ale</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Craft Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/KaijuKrushCan.png" />
                                <p className="item-title">Kaiju Krush</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Craft Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/MoonDogOldMate.png" />
                                <p className="item-title">Moon Dog Old Mate</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Craft Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/YoungHenrysNewtownerCans.png" />
                                <p className="item-title">Young Henrys Newtowner</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <ShopButton className={styles.viewMoreBtn}>
                                    <span className="view-more-text">
                                        <p>View</p>
                                        <p>More</p>
                                        <img className="chevron-right" src="/static/assets/img/chevron-right-solid.png" alt="" />
                                    </span>
                                </ShopButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Items-container section container-fluid white no-padding-top">
                    <div className="container container-wide padding-left-xs">
                        <div className="row vertical-align">
                            <h3 className="Items-title clearfix">Imported Beer Delivery</h3>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">
                                    Grab a beer from where you’d rather be. It’s cheaper than an airfare.
                            </p>
                            </div>
                        </div>

                        <div className="Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Imported Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/Stella_400x500.png" />
                                <p className="item-title">Stella Artois</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Imported Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/Corona.png" />
                                <p className="item-title">Corona</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Imported Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/Heineken.png" />
                                <p className="item-title">Heineken</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Imported Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/Asahi.png" />
                                <p className="item-title">Asahi</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Imported Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/Guinness.png" />
                                <p className="item-title">Guinness</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <ShopButton className={styles.viewMoreBtn}>
                                    <span className="view-more-text">
                                        <p>View</p>
                                        <p>More</p>
                                        <img className="chevron-right" src="/static/assets/img/chevron-right-solid.png" alt="" />
                                    </span>
                                </ShopButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Items-container section container-fluid white no-padding-top">
                    <div className="container container-wide padding-left-xs">
                        <div className="row vertical-align">
                            <div className="Items-title clearfix">Local Beer Delivery</div>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">
                                    Because there’s nothing better than your fave local brew after a hot summer day.
                            </p>
                            </div>
                        </div>
                        <div className="Craft Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Local Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/CarltonDraught.png" />
                                <p className="item-title">Carlton Draught</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Local Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/VB.png" />
                                <p className="item-title">Victoria Bitter</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Local Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/PureBlonde.png" />
                                <p className="item-title">Pure Blonde</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Local Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/MelbourneBitter.png" />
                                <p className="item-title">Melbourne Bitter</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Local Beer Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/beer/HahnSuperDry.png" />
                                <p className="item-title">Hahn Super Dry</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <ShopButton className={styles.viewMoreBtn}>
                                    <span className="view-more-text">
                                        <p>View</p>
                                        <p>More</p>
                                        <img className="chevron-right" src="/static/assets/img/chevron-right-solid.png" alt="" />
                                    </span>
                                </ShopButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="get-the-app section container-fluid">
                    <div className="container">
                        <div className="row vertical-align">
                            <div className="col-md-6 clearfix">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h5>A Bottle Shop in Your Pocket</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <p>Order your favourites with a tap and track your delivery as it arrives with the all new Tipple app. </p>
                                        <p>Download now for alcohol delivery on the go. Available on iOS and Android.</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 app-dlds">
                                        <a href="https://itunes.apple.com/au/app/tipple/id1064886466" target="_blank" rel="noopener noreferrer">
                                            <img alt="Apple Store" src="/static/assets/img/apple-store.png" /></a>
                                        <a href="https://play.google.com/store/apps/details?id=com.tipple" target="_blank" rel="noopener noreferrer">
                                            <img alt="Google Play" src="/static/assets/img/google-play.png" /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 clearfix">
                                <img alt="iPhone Hand" className="img-responsive pull-right img-abs lazyimage" src="/static/assets/img/home/tipple-i-phone-hand.png" />
                            </div>

                        </div>
                    </div>
                </div>
            </Page>
        );
    }
}

const mapStateToProps = (state, props) => ({
    currentUser: state.auth.currentUser,
    currentCart: state.cart.currentCart
});

const mapDispatchToProps = dispatch => ({
    displayLoginPopup: bindActionCreators(displayLoginPopup, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ssrComponent(BeerDelivery));
