import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { ssrComponent } from 'lib/ssrHelper';

import ShopButton from './ShopButton';

import { displayLoginPopup } from 'app/resources/action/Login';

import registerHomeRedux from 'app/resources/api/home';

import styles from './Tipple.module.scss';

const homeRedux = registerHomeRedux('HOME_WEB', ['GET']);

const faqs = [
    { q: 'Where Do You Deliver?', a: 'Tipple is available for delivery to over 120 suburbs across Melbourne and Sydney. Enter your delivery address at the top of the page to see if our alcohol delivery service is available in your area.' },
    { q: 'What Are Your Operation Hours?', a: `Tipple is available for delivery in most areas from midday until 11pm. Check your location's exact delivery times by entering your address above. Our store is open 24/7 to schedule orders for delivery ahead of time within these hours.` },
    { q: 'How Much Does Delivery Cost?', a: 'All delivieres on Tipple are charged at a flat rate of $7.95 per order, regardless of your location. In order to keep our delivery fee as low as possible our minimum order is $30.' },
    { q: 'Do I Need ID?', a: `To ensure we're delivering your alcohol responsibly we require photo identification upon delivery. We'll cross reference this with your order details for verification.` },
    { q: `Why Isn't Tipple in My Area?`, a: `If we're not in your area just yet, leave your details to demand your suburb next. We're working hard to expand to more areas as soon as possible!` },
    { q: 'Do You Deliver to Offices?', a: `Of course we do! Friday night drinks will never be the same with Tipple. Schedule your drinks to arrive cold when you need it or on demand. Get in touch if you'd like to set up a regular office order.` }
];

// const CATEGORY_MAX = 3;
// const CATEGORY_SUBCAT_MAX = 5;

export class Home extends Component {

    state = {
        faqIndex: 0,
        catIndex: 0
    };

    static async getInitialProps(props) {
        const storeId = props.cart ? (props.cart.storeId ? props.cart.storeId : props.defaultStoreId) : props.defaultStoreId;

        if (storeId) {
            await props.homeActions.get('web', props.auth, {
                storeId: storeId
            });
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.catIndex) {
            return null;
        }

        const { home } = props;

        const categories = home && home.item && home.item.categories ? home.item.categories : [];
        const parentCategories =  categories
            .filter(cat => !cat.parentId) 
            .sort((a, b) => {
                if (a.sort < b.sort) {
                    return -1;
                }

                if (a.sort > b.sort) {
                    return 1;
                }

                return 0;
            });

        if (parentCategories.length > 0) {
            return {
                catIndex: parentCategories[0].id
            };
        }
    }

    showFaq = index => {
        this.setState(() => ({
            faqIndex: index
        }));
    };

    showCat = index => {
        this.setState(() => ({
            catIndex: index
        }));
    };

    render() {
        const { home: hero } = this.props;
        const { faqIndex } = this.state;

        return (
        <>
            <section className={classNames(styles.section, styles.hero)}>
                <div className={styles.wave}></div>
                <div className={classNames(styles.wrap, 'container')}>
                    <div className={styles.container}>
                        <div className={classNames(styles.col, styles.left)}>
                            <div className={styles.title}>
                                {hero && hero.lines && hero.lines.map((line, i) => 
                                    line ? <strong key={i} className={classNames(styles.line, line.highlight && styles.spritz, line.indent && styles.indent)}>{line.text}&nbsp;</strong> : null
                                )}
                            </div>
                            <div className={styles.addresses}>
                                <ShopButton className={styles.btn} history={this.props.history} />
                            </div>
                        </div>
                        <div className={classNames(styles.col, styles.product)}>
                            <img className={classNames(styles.bottle)} src={hero  && hero.imageUrl ? hero.imageUrl : '/static/assets/img/content/bottle-beer.png'} alt="Tipple" />
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={classNames(styles.wrap, 'container')}>
                    <h1>Alcohol. Delivered. Fast.</h1>

                    <div className={styles.container}>
                        <div className={styles.col}>
                            <img className={styles.icon} src="/static/assets/img/icons/icon-address.svg" alt="Address" />
                            <h3>Enter Your Delivery Address</h3>
                        </div>
                        <div className={styles.col}>
                            <img className={styles.icon} src="/static/assets/img/icons/icon-products.svg" alt="Products" />
                            <h3>Order From 500+ Products</h3>
                        </div>
                        <div className={styles.col}>
                            <img className={styles.icon} src="/static/assets/img/icons/icon-relax.svg" alt="Relax" />
                            <h3>Relax, Drinks On The Way!</h3>
                        </div>
                    </div>
                </div>
            </section>

            <section className={classNames(styles.section, styles.bottleshop)}>
                <div className={classNames(styles.wrap, 'container')}>
                    <div className={classNames(styles.container, styles['v-center'], styles['reverse-mobile'])}>
                        <div className={styles.col}>
                            <h2>A bottle shop in your pocket</h2>
                            <p>Order your favourites with a tap and track your delivery as it arrives with the all new Tipple app.</p>
                            <p>Download now for alcohol delivery on the go.</p>
                            <div className={styles.apps}>
                                <a href="https://itunes.apple.com/au/app/tipple/id1064886466" target="_blank" rel="noopener noreferrer">
                                    <img alt="Apple Store" src="/static/assets/img/apple-store.png" />
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.tipple" target="_blank" rel="noopener noreferrer">
                                    <img alt="Google Play" src="/static/assets/img/google-play.png" />
                                </a>
                            </div>
                        </div>
                        <div className={styles.col}>
                            <img className={classNames(styles.party, 'img-responsive')} src="/static/assets/img/content/house-party.svg" alt="Tipple Party" />
                        </div>
                    </div>
                </div>
            </section>

            <section className={classNames(styles.section, styles.team)}>
                <div className={classNames(styles.wrap, 'container')}>
                    <h2>Join Team Tipple</h2>

                    <div className={styles.container}>
                        <div className={styles.col}>
                            <img className={styles.icon} src="/static/assets/img/icons/icon-driver.svg" alt="Driver" />
                            <h3>Become A Tipple Driver</h3>
                            <a href="https://www.getfeedback.com/r/ZSH7Lpij" title="Apply Now" target="_blank" rel="noopener noreferrer">
                                <button className={classNames(styles.button, 'btn', 'btn-primary')}>Apply Now</button>
                            </a>
                        </div>
                        <div className={styles.col}>
                            <img className={styles.icon} src="/static/assets/img/icons/icon-bottleshop.svg" alt="Bottle Shop" />
                            <h3>Become A Partner Bottle Shop</h3>
                            <a href="https://mailchi.mp/tipple.com.au/stores" title="Let's Talk" target="_blank" rel="noopener noreferrer">
                                <button className={classNames(styles.button, 'btn', 'btn-primary')}>Let's Talk</button>
                            </a>
                        </div>
                        <div className={styles.col}>
                            <img className={styles.icon} src="/static/assets/img/icons/icon-brand.svg" alt="Driver" />
                            <h3>Activate Your Brand</h3>
                            <a href="https://p.tipple.com.au/supplier" title="Learn More" target="_blank" rel="noopener noreferrer">
                                <button className={classNames(styles.button, 'btn', 'btn-primary')}>Learn More</button>
                            </a>
                        </div>
                        <div className={styles.col}>
                            <img className={styles.icon} src="/static/assets/img/icons/icon-careers.svg" alt="Careers" />
                            <h3>Careers With Tipple</h3>
                            <a href="mailto:admin@tipple.com.au?subject=Careers at Tipple" title="Browse" target="_blank" rel="noopener noreferrer">
                                <button className={classNames(styles.button, 'btn', 'btn-primary')}>Browse</button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className={classNames(styles.section, styles.faq)}>
                <div className={classNames(styles.wrap, 'container')}>
                    <div className={classNames(styles.container)}>
                        <div className={styles.col}>
                            <img className="img-responsive" src="/static/assets/img/content/dancers.svg" alt="Tipple Dancers" />
                        </div>
                        <div className={styles.col}>
                            <h2>Have a Question?</h2>
                            <div className={styles.questions}>
                                {faqs.map((faq, index) => 
                                    <div 
                                        key={index}
                                        className={classNames(styles.question, faqIndex === index ? styles['is-expanded'] : null)}
                                        onClick={() => this.showFaq(index)}
                                    >
                                        <h6>{faq.q}</h6>
                                        <p>{faq.a}</p>
                                        {faqIndex === index ? <i className="material-icons">&#xE15B;</i> : <i className={classNames(styles.plus, 'material-icons')}>&#xE145;</i>}
                                    </div>
                                )}
                            </div>
                            <div className={styles.more}>
                                <Link to="/content/faq">More Questions? Get in Touch <i className={classNames(styles.fa, 'fa', 'fa-chevron-right')}></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={classNames(styles.section, styles.delivery)}>
                <div className={classNames(styles.wrap, 'container')}>
                    <h2>Delivery Areas</h2>
                    <p>Interested in where we deliver? Select a city, hopefully we’re near you!</p>

                    <div className={styles.container}>
                        <div className={styles.col}>
                            <img className={styles.city} src="/static/assets/img/content/location-melbourne.svg" alt="Melbourne" />
                            <Link className={styles.location} to="/melbourne">Melbourne Locations</Link>
                        </div>
                        <div className={styles.col}>
                            <img className={styles.city} src="/static/assets/img/content/location-sydney.svg" alt="Sydney" />
                            <Link className={styles.location} to="/sydney">Sydney Locations</Link>
                        </div>
                        <div className={styles.col}>
                            <img className={styles.city} src="/static/assets/img/content/location-perth.svg" alt="Perth" />
                            <span className={classNames(styles.location, styles.inactive)}>Perth Coming Soon</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={classNames(styles.section, styles.cta)}>
                <div className={styles['wave-bottom']}></div>
                <div className={classNames(styles.wrap, 'container')}>
                    <div className={styles.container}>
                        <div className={styles.col}>
                            <h2>Still Thirsty?</h2>
                            <p><span role="img" aria-label="Move to top">☝️</span></p>
                            <p><strong>We got you!</strong></p>
                            <p>Enter your address above to shop the range near you!</p>
                        </div>
                    </div>
                </div>
            </section>
        </>);
    }

}

const mapStateToProps = ({ auth, cart, HOME_WEB, theme }) => ({
    auth,
    currentUser: auth.currentUser,
    currentCart: cart.currentCart,
    home: HOME_WEB?.item?.length > 0 ? HOME_WEB?.item[0] : { lines: [ { text: '' }, { text: '' }, { text: '' }]},
    defaultStoreId: theme.defaultStoreId
});

const mapDispatchToProps = (dispatch) => ({
    displayLoginPopup: bindActionCreators(displayLoginPopup, dispatch),
    homeActions: bindActionCreators(homeRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ssrComponent(Home));