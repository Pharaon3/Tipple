import React, { Component } from "react";
import Page from "app/components/Page";
import { connect } from "react-redux";
import { ssrComponent } from "lib/ssrHelper";
import { bindActionCreators } from "redux";
import ShopButton from 'app/components/homepage/ShopButton';
import classNames from 'classnames';

import { displayLoginPopup } from "app/resources/action/Login";

import styles from './DeliveryPage.module.scss';

class WineDelivery extends Component {
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
            <Page id="wineDelivery" className={styles.wrap} title="Wine Delivery - Tipple Alcohol Delivery" description="Wine delivery made easy. Browse 500+ products and get it delivered cold and fast with Tipple alcohol delivery.">
                <div className="container-fluid jumbotron jumbotron-fluid hero-image hero-image-wine">
                    <div className="container container-wide banner-text">
                        <h1 className="Liquor-Delivery">Wine Delivery</h1>
                        <h2 className="We-only-stock-the-be">All your favourite wines delivered.</h2>
                        <ShopButton label="Browse Our Wine Range" className={classNames(styles.shopBtn, 'btn btn-primary hero-button')} />
                    </div>
                </div>

                <div className="Responsive-banner-text container-fluid white">
                    <div className="container container-wide">
                        <div className="row">
                            <h1 className="Liquor-Delivery">Wine Delivery</h1>
                            <h2 className="We-only-stock-the-be">All your favourite wines delivered.</h2>
                            <ShopButton label="Browse Our Wine Range" className={classNames(styles.shopBtn, 'btn btn-primary hero-button')} />
                        </div>
                    </div>
                </div>

                <div className="About-our-beer-range section container-fluid white">
                    <div className="container container-wide padding-left-xs">
                        <div className="row vertical-align">
                            <h2 className="About-our-beer-range-title">About Our Wine Delivery Range</h2>
                        </div>
                        <div className="About-our-beer-range-columns row">
                            <div className="col-xs-12 clearfix">
                                Whether you’re looking for a full-bodied red wine, a light &amp; airy white wine or a bubbly glass of sparkling wine, you’re guaranteed to find something to love from the huge range of wines available on Tipple. Explore endless combinations of styles, varietals, regions and vintages to find the perfect drop for your night!
                          </div>
                        </div>
                    </div>
                </div>

                <div className="Items-container section container-fluid white no-padding-top">
                    <div className="container container-wide padding-left-xs">
                        <div className="row vertical-align">
                            <h3 className="Items-title clearfix">Red Wine Delivery</h3>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">Intense, light, full bodied, dry, sweet… Is there anything Red Wine can’t do? Get your fave.</p>
                            </div>
                        </div>
                        <div className="Craft Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Red Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/6ft6PinotNoir.png" />
                                <p className="item-title">6ft6 Pinot Noir</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Red Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/FatBastardMalbec.png" />
                                <p className="item-title">Fat Bastard Malbec</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Red Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/TintaraShiraz.png" />
                                <p className="item-title">Hardys Tintara</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Red Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/StonierPinotNoir.png" />
                                <p className="item-title">Stonier Pinot Noir</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Red Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/PepperjackShiraz.png" />
                                <p className="item-title">Pepperjack Shiraz</p>
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
                            <h3 className="Items-title clearfix">White Wine Delivery</h3>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">
                                    Whether you’re sweet or dry, we’ve got just the right drop for your tastebuds.
                            </p>
                            </div>
                        </div>

                        <div className="Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="White Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/HandpickedPinotGrigio.png" />
                                <p className="item-title">Handpicked Pinot Grigio</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="White Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/InnocentBystandardPinotGris.png" />
                                <p className="item-title">Innocent Bystander Pinot Gris</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="White Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/ColdstreamHillChardonnay.png" />
                                <p className="item-title">Coldstream Hills Chardonay</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="White Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/LeChatNoirSauvBlanc.png" />
                                <p className="item-title">Le Chat Sauv Blanc</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="White Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/PetalumaWhiteLabelSauvignonBlanc.png" />
                                <p className="item-title">Petaluma Sauv Blanc</p>
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
                            <div className="Items-title clearfix">Sparkling Wine Delivery</div>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">
                                    Celebrating? We’ve got just the right bottle to pop. Also - mimosas! What… they’re delicious...
                            </p>
                            </div>
                        </div>
                        <div className="Craft Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Sparkling Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/MummBrut.png" />
                                <p className="item-title">Mumm Cordon Rouge</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Sparkling Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/Veuve.png" />
                                <p className="item-title">Veuve Clicquot</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Sparkling Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/DeBortoliProsecco.png" />
                                <p className="item-title">De Bortoli Prosecco</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Sparkling Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/BillecartSalmon.png" />
                                <p className="item-title">Billecart Salmon</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Sparkling Wine Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/JanszPremiumCuvee.png" />
                                <p className="item-title">Jansz</p>
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
                            <div className="Items-title clearfix">Rose Delivery</div>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">
                                    Not too red, not too white - but always just right. Pick a Rosé for those hot summer nights.
                            </p>
                            </div>
                        </div>
                        <div className="Craft Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Rose Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/AixRoseMagnum.png" />
                                <p className="item-title">AIX Rose</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Rose Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/LeChatNoirRose.png" />
                                <p className="item-title">Le Chat Rose</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Rose Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/ManOWarPinqueRose.png" />
                                <p className="item-title">Man O' War Pinque Rose</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Rose Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/LaBohemeActTwo.png" />
                                <p className="item-title">La Boheme Act Two Rose</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Rose Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/wine/YalumbaYSeriesSangioveseRose.png" />
                                <p className="item-title">Yalumba Y Series Sangiovese Rose</p>
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
)(ssrComponent(WineDelivery));
