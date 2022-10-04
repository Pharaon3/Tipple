import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ssrComponent } from 'lib/ssrHelper';

import registerContentRedux from 'app/resources/api/content';

import styles from './DefaultFooter.module.scss';

const contentRedux = registerContentRedux('CONTENT_LIST', ['LIST']);

class Footer extends Component {

    static async getInitialProps(props) {
        if (props.content.items !== undefined) {
            return;
        }

        return await props.contentActions.list(props.auth, {
            fields: 'title,uri'
        });
    }

    render() {

        let contentLinks = [];

        if (Array.isArray(this.props.content.items)) {
            this.props.content.items.forEach(c => {
                contentLinks.push(<li key={c.uri}><Link to={"/content/" + c.uri}>{c.title}</Link></li>)
            })
        }

        return [<div key="push" className="push"></div>,
        <footer key="footer" className={classNames(styles.footer, 'footer-styled', 'brand-text-100')}>
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-2">
                        <div className="row">
                            <div className="col-xs-12">
                                <img alt="Logo" src="/static/assets/img/logo-white.png" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 font-size-icon mt-24">
                                <a aria-label="Instagram" target="_blank" rel="noopener noreferrer" href="http://instagram.com/tipple_AU"><i className="fa fa-instagram"></i></a>&nbsp;&nbsp;
                                <a aria-label="Facebook" target="_blank" rel="noopener noreferrer" href="http://facebook.com/tippleAU"><i className="fa fa-facebook-square"></i></a>&nbsp;&nbsp;
                                <a aria-label="Twitter" target="_blank" rel="noopener noreferrer" href="http://twitter.com/tippleAU"><i className="fa fa-twitter-square"></i></a>
                            </div>
                        </div>

                        <div className={classNames(styles['row-visa'], 'row-visa', 'row')}>
                            <div className="col-xs-12 col-sm-12">
                                <img alt="Visa" src="/static/assets/img/visa.png" />
                                <img alt="Mastercard" src="/static/assets/img/mastercard.png" />
                                <img alt="Amex" src="/static/assets/img/amx.png" />
                                <img alt="PayPal" src="/static/assets/img/paypal.png" />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4">
                        <ul className="list-unstyled">
                            {contentLinks}
                            <li><a rel="noopener noreferrer" href="https://www.getfeedback.com/r/ZSH7Lpij" target="_blank">Deliver With Us</a></li>
                            <li><Link to="/contact-us">Contact Us</Link></li>
                            <li><a rel="noopener noreferrer" href="https://tipple.com.au/blog/" target="_blank">Blog</a></li>
                            <li><Link to="/beer-delivery/">Beer Delivery</Link></li>
                            <li><Link to="/wine-delivery/">Wine Delivery</Link></li>
                            <li><Link to="/liquor-delivery/">Liquor Delivery</Link></li>
                            <li><Link to="/sydney/">Alcohol Delivery Sydney</Link></li>
                            <li><Link to="/melbourne/">Alcohol Delivery Melbourne</Link></li>
                            <li><a rel="noopener noreferrer" href="https://www.getfeedback.com/r/SiEraZNb" target="_blank">Self Exclusion</a></li>
                        </ul>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <p>
                            Tipple supports the Responsible Service of Alcohol. <strong><a href="/content/licensing">Visit our licensing page</a></strong> to view detailed legislation or liquor licences for your state or territory.
                        </p>
                        <p><strong>Victoria</strong>: Warning - Under the Liquor Control Reform Act 1998 it is an offence: To supply alcohol to a person under the age of 18 years (Penalty exceeds $19,000), For a person under the age of 18 years to purchase or receive liquor (Penalty exceeds $800). <strong>New South Wales</strong>: Under the Liquor Act 2007, It is against the law to sell or supply alcohol to, or to obtain alcohol on behalf of, a person under the age of 18 years. <strong>Queensland</strong>: Under the Liquor Act 1992, it is an offence to supply liquor to a person under the age of 18 years. <strong>Australian Capital Territory</strong>: Under the Liquor Act 2010. A person must not sell or supply liquor to a person under 18 years old on premises where the sale or supply of liquor is authorised or in a public place. Maximum Penalty $5500. <strong>South Australia</strong>: Under Liquor Licensing Act 1997, Liquor must NOT be supplied to persons under 18. <strong>Western Australia</strong>: WARNING. Under the Liquor Control Act 1988, it is an offence: to sell or supply liquor to a person under the age of 18 years on licensed or regulated premises; or for a person under the age of 18 years to purchase, or attempt to purchase, liquor on licensed or regulated premises.</p>
                    </div>                
                </div>
                <div className="row">
                    <div className="col-xs-12 text-right small">
                        &copy; Tipple Group Pty Ltd. All rights reserved.
        </div>
                </div>
            </div>
        </footer>]
    }
}


const mapStateToProps = (state, props) => ({
    auth: state.auth,
    content: state.CONTENT_LIST
});

const mapDispatchToProps = (dispatch) => ({
    contentActions: bindActionCreators(contentRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ssrComponent(Footer));