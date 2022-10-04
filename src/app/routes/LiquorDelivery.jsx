import React, { Component } from "react";
import Page from "app/components/Page";
import { connect } from "react-redux";
import { ssrComponent } from "lib/ssrHelper";
import { bindActionCreators } from "redux";
import ShopButton from 'app/components/homepage/ShopButton';
import classNames from 'classnames';

import { displayLoginPopup } from "app/resources/action/Login";

import styles from './DeliveryPage.module.scss';

class LiquorDelivery extends Component {
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
            <Page id="liquorDelivery" className={styles.wrap} title="Liquor Delivery - Tipple Alcohol Delivery" description="Liquor delivery made easy. Browse 500+ products and get it delivered cold and fast with Tipple alcohol delivery.">
                <div className="container-fluid jumbotron jumbotron-fluid hero-image hero-image-liquor">
                    <div className="container container-wide banner-text">
                        <h1 className="Liquor-Delivery">Liquor Delivery</h1>
                        <h2 className="We-only-stock-the-be">All your favourite spirits delivered.</h2>
                        <ShopButton label="Browse Our Liquor Range" className={classNames(styles.shopBtn, 'btn btn-primary hero-button')} />
                    </div>
                </div>

                <div className="Responsive-banner-text container-fluid white">
                    <div className="container container-wide">
                        <div className="row">
                            <h1 className="Liquor-Delivery">Liquor Delivery</h1>
                            <h2 className="We-only-stock-the-be">All your favourite spirits delivered.</h2>
                            <ShopButton label="Browse Our Liquor Range" className={classNames(styles.shopBtn, 'btn btn-primary hero-button')} />
                        </div>
                    </div>
                </div>

                <div className="About-our-beer-range section container-fluid white">
                    <div className="container container-wide padding-left-xs">
                        <div className="row vertical-align">
                            <h2 className="About-our-beer-range-title">Our Liquor Delivery Range</h2>
                        </div>
                        <div className="About-our-beer-range-columns row">
                            <div className="col-xs-12 clearfix">
                                Need liquor delivered in a flash? With hundreds of local and imported liquor brands, we’ve got all the liquor you need for any cocktail on the menu. Mix things up with our range of mixers, grab a liquor cocktail bundle or take the easy route and enjoy your liquor straight up over ice. Whatever your drink of choice, we’ve got a huge liquor range guaranteed to help you hit the spot.
                          </div>
                        </div>
                    </div>
                </div>

                <div className="Items-container section container-fluid white no-padding-top">
                    <div className="container container-wide padding-left-xs">
                        <div className="row vertical-align">
                            <h3 className="Items-title clearfix">Vodka Delivery</h3>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">From smooth &amp; refined all the way to uni student blues, we’ve got a Vodka perfect for you.</p>
                            </div>
                        </div>

                        <div className="Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Vodka Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Absolut700ml.png" />
                                <p className="item-title">Absolut</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Vodka Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Arktika.png" />
                                <p className="item-title">Arktika</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Vodka Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/ArchieRoseVodka.png" />
                                <p className="item-title">Archie Rose Vodka</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Vodka Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Belvedere.png" />
                                <p className="item-title">Belvedere</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Vodka Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Smirnoff.png" />
                                <p className="item-title">Smirnoff Red Label</p>
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
                            <h3 className="Items-title clearfix">Whisky Delivery</h3>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">
                                    Enough whisky to impress even Don Draper. Get all your faves (and find a few more).
                          </p>
                            </div>
                        </div>
                        <div className="Craft Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Whisky Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/JohnnieBlack.png" />
                                <p className="item-title">Johnnie Walker Black</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Whisky Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Jameson.png" />
                                <p className="item-title">Jameson</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Whisky Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/MonkeyShoulder.png" />
                                <p className="item-title">Monkey Shoulder</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Whisky Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/ChivasRegal.png" />
                                <p className="item-title">Chivas Regal</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Whisky Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Laphroaig.png" />
                                <p className="item-title">Laphroaig 10 Year Old Scotch</p>
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
                            <div className="Items-title clearfix">Gin Delivery</div>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">
                                    Dry? Shaken? Stirred? We’ve got just the Gin (and tonic) for every taste.
                          </p>
                            </div>
                        </div>
                        <div className="Craft Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Gin Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Bombay.png" />
                                <p className="item-title">Bombay Sapphire</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Gin Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/FourPillarsRareDry.png" />
                                <p className="item-title">Four Pillars Rare</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Gin Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Hendricks.png" />
                                <p className="item-title">Hendrick's</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Gin Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Beefeater.png" />
                                <p className="item-title">Beefeater</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Gin Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/WestWindsCutlass.png" />
                                <p className="item-title">West Winds</p>
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
                            <div className="Items-title clearfix">Other Liquor Delivered</div>
                        </div>
                        <div className="row vertical-align">
                            <div className="col-md-6 no-padding-left">
                                <p className="Items-description">
                                    Looking for something a little more specific? Browse the full liquor range on Tipple.
                </p>
                            </div>
                        </div>
                        <div className="Craft Items-columns row no-column-side-padding">
                            <div className="item col-md-2 clearfix">
                                <img alt="Other Liquor Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/Kahlua.png" />
                                <p className="item-title">Kahlua</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Other Liquor Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/ElJimador.png" />
                                <p className="item-title">Jimador</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Other Liquor Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/BacardiWhite.png" />
                                <p className="item-title">Bacardi</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Other Liquor Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/SailorJerry.png" />
                                <p className="item-title">Sailor Jerry</p>
                            </div>
                            <div className="item col-md-2 clearfix">
                                <img alt="Other Liquor Delivery" className="item-image img-responsive center-block lazyimage" src="https://content.tipple.com.au/tipple/products/400x500/spirits/AlizeBleu.png" />
                                <p className="item-title">Alize Bleu</p>
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
)(ssrComponent(LiquorDelivery));
