import React, { Component } from 'react';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { applyPromotionCode, removePromotionCode, clearPromotionCodeError } from 'app/resources/action/Cart';
import { AnalyticsEvents } from 'lib/analytics';

import Spinner from 'app/components/Spinner';

import styles from './PromotionCode.module.scss';

class PromotionCode extends Component {

    constructor() {
        super();

        this.state = {
            showCodeForm: false,
            code: ''
        };
    }

    toggleShowCodeForm = () => {
        this.setState({
            showCodeForm: !this.state.showCodeForm
        });
    }

    applyCode = (ev) => {
        ev.preventDefault();

        const data = {
            cart: this.props.cart,
            promo: {'code': this.state.code},
        }
        window.tippleAnalytics.trigger(AnalyticsEvents.promo_code_added, data);
        this.props.applyPromotionCode(this.state.code, this.props.cart.id, this.props.auth);
    }

    onInput = (ev) => {
        this.setState({
            code: ev.target.value
        });
    }

    componentWillUnmount() {
        this.props.clearPromotionCodeError();
    }

    removePromoCode = () => {
        this.setState({
            showCodeForm: false
        });
        this.props.clearPromotionCodeError();
        this.props.removePromotionCode(this.state.code,this.props.auth);
    }

    render() {
        const hasExistingPromotionCode = this.props.cart.discounts.length > 0;
        const hasError = this.props.promoCodeError && this.props.promoCodeError.length > 0;

        return <div className={styles.promotion}>
            {this.state.isLoading && <Spinner />}
            {this.props.cart.items.length === 0 && this.props.cart.discounts && this.props.cart.discounts.length > 0 && <div className={styles.code}>Promotion Code: {this.props.cart.discounts[0].promoCode.code}</div>}
            {!hasExistingPromotionCode && !this.state.showCodeForm && <div onClick={this.toggleShowCodeForm} className={styles['have-promo']}>Have a Promo Code?</div>}
            {hasExistingPromotionCode && <div onClick={this.removePromoCode} className={classNames(styles['have-promo'], styles.remove)}>Remove Promo Code</div>}
            {!hasExistingPromotionCode && this.state.showCodeForm && <div className={"dcol-xs-12 " + (hasError ? 'has-error' : '')}>
                <form className={classNames(styles.form, hasError && 'has-error')} onSubmit={this.applyCode}>
                    <div className={styles.input}>
                        <input name="promoCode" onChange={this.onInput} value={this.state.code} type="text" className="form-control" placeholder="Enter Promo Code" />
                    </div>
                    <div className={styles.button}>
                        <button disabled={!this.state.code} onClick={this.applyCode} type="submit" className="btn btn-primary btn-block">Apply</button>
                    </div>
                    {hasError && <label className="control-label">{this.props.promoCodeError[0].displayMessage}</label>}
                </form>
            </div>
            }
        </div>
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    promoCodeError: state.cart.promoCodeError
});

const mapDispatchToProps = (dispatch) => ({
    applyPromotionCode: bindActionCreators(applyPromotionCode, dispatch),
    removePromotionCode: bindActionCreators(removePromotionCode, dispatch),
    clearPromotionCodeError: bindActionCreators(clearPromotionCodeError, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionCode);