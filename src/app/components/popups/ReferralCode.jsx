import React, { Component } from 'react';
import classNames from 'classnames';
import Modal from 'app/components/Modal';

import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';

import { hideReferralCodePopup } from 'app/resources/action/DisplayReferralCode';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import styles from './ReferralCode.module.scss';

class ReferralCodePopup extends Component {

    state = {
        copied: false
    }

    closeClick = (ev) => {
        ev.preventDefault();

        this.setState({
            copied: false
        })

        this.props.hideReferralCodePopup();
    }

    sendEmail = () => {

        let creditAmount = this.props.currentUser.creditAmount;
        let referralCode = this.props.currentUser.referralCode;

        let subject = "Next Tipple's on me, here's $" + creditAmount + "!";
        let body = "Your first drink is on me! I’m using Tipple to have my favourite beer, wine and spirits delivered fast. Here’s my link to score $" + creditAmount + " off your first order. " +
            "https://tipple.com.au/?promo_code=" + referralCode;

        window.location.href = "mailto:%20?subject=" + subject + "&body=" + body;
    }

    shareFacebook = () => {

        let creditAmount = this.props.currentUser.creditAmount;
        let referralCode = this.props.currentUser.referralCode;

        let href = "https://www.facebook.com/sharer/sharer.php?" +
            "u=https://tipple.com.au/?promo_code=" + referralCode + "&" +
            "name=$" + creditAmount + " off your first Tipple&" +
            "quote=Get $" + creditAmount + " off your favourite beer, wine and spirits by using referral code " + referralCode + " on your first Tipple order!";
        window.open(href, 'fbShareWindow', 'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');

    }

    render() {
        let creditAmount = this.props.currentUser.creditAmount;
        let referralCode = this.props.currentUser.referralCode;

        return this.props.displayReferralCode ? <Modal analyticsMessage="Referral Code" analyticsType="popup" analyticsFrom={window.location.pathname}>
            <div className={styles.overlay}>
                <div onClick={this.closeClick} className="loading-overlay-transparent orange fadein"></div>
                <div className={classNames(styles.referral, 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>

                    <div className="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                        <span className="ui-dialog-title">
                            <img alt="disco" src="/static/assets/img/disco.gif" className="img-responsive" />
                            <a href="#close" onClick={this.closeClick} role="button" className={classNames(styles.close, 'ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all')}>
                                <span className="fa fa-fw fa-close"></span>
                            </a>
                        </span>
                    </div>
                    <div className="ui-dialog-content ui-widget-content">
                        <div className='text-center'>
                            <span className={styles.title}>
                                Give Drinks, Get Drinks!
                            </span>
                        </div>
                        <div className="col-md-12 pt-12 text-center">
                            Share your code with friends and get ${creditAmount} in credit when they order
                        </div>
                        <div className="col-md-12 pt-12 pb-12">
                            <label htmlFor="referral_code" className={styles.label}>{this.state.copied ? <span>Copied</span> : <span>Copy</span>}</label>
                            <CopyToClipboard text={referralCode}
                                onCopy={() => this.setState({ copied: true })}>
                                <input id="referral_code" type="text" readOnly defaultValue={referralCode} className={styles.code} />
                            </CopyToClipboard>
                        </div>
                        <div className="col-12 pb-12">
                            <div className="row">
                                <div className="col-xs-6">
                                    <button className="btn btn-primary btn-lg btn-block mt-15" onClick={this.sendEmail}><i className="fa fa-envelope"></i> Email</button>
                                </div>
                                <div className="col-xs-6">
                                    <button className={classNames(styles.facebook, 'btn btn-primary btn-lg btn-block')} onClick={this.shareFacebook}><i className="fa fa-facebook-official"></i> Facebook</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            <a href="/content/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                                <span className={styles.terms}>Terms &amp; Conditions</span>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </Modal> : null

    }
}


const mapStateToProps = state => ({
    displayReferralCode: state.auth.displayReferralCode,
    currentUser: state.auth.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    hideReferralCodePopup: bindActionCreators(hideReferralCodePopup, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReferralCodePopup);
