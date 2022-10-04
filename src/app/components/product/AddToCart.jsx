import React, { Component } from 'react';
import classNames from 'classnames';

import Dropdown from 'app/components/Dropdown';
import { Link } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { addToCart } from 'app/resources/action/Cart';

import { getDescriptiveProductPackName } from 'app/resources/cart';
import { AnalyticsEvents } from 'lib/analytics';

import styles from './AddToCart.module.scss';

export class AddToCart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            quantity: 1
        }
    }

    selectPack = (size) => {
        this.props.onUpdatePackSelected(size);
    };

    // TODO: Move this to parent components (ie. ProductDetails.jsx) that use this component. This should just be the button, not the functionality.
    addToCart = () => {
        const pp = this.props.product.pricePacks.find(p => p.packSize === this.props.packSize);
        const ppId = pp.productPackId;

        global.tippleAnalytics.trigger(AnalyticsEvents.add_to_cart, { 
            product: this.props.product,
            addToCart: {
                packSize: this.props.packSize,
                quantity: this.state.quantity,
                cart_id: this.props.currentCart.id,
                price: pp.salePrice > 0 ? pp.salePrice : pp.price
            }
        });

        this.props.addToCart(this.props.product.id, ppId, this.state.quantity, this.props.packSize, pp.salePrice > 0 ? pp.salePrice : pp.price, this.props.currentCart.id, this.props.product.name, 0, false, this.props.auth);
    };

    incrementQuantity = () => {
        if (this.state.quantity < 99) {
            this.setState(() => ({
                quantity: this.state.quantity + 1
            }));
        }
    };

    decrementQuantity = () => {
        if (this.state.quantity > 1) {
            this.setState(() => ({
                quantity: this.state.quantity - 1
            }));
        }
    };

    render() {
        const packOptions = this.props.product.pricePacks.map(opt => ({
            value: opt.packSize,
            label: getDescriptiveProductPackName(opt.packSize)
        }));

        return <div className={styles.add}>
            <div className="row">
                <div className="col-xs-6 clearfix">
                    <div className="brand-text-black text-left"><small>Pack Size</small></div>
                    {packOptions.length > 1 && <Dropdown maxOffset={3} className="pack-size tipple-select" onClick={this.selectPack} options={packOptions} value={this.props.packSize} />}
                    {packOptions.length === 1 && <div className="single-pack-size">{packOptions[0].label}</div>}
                </div>
                <div className="col-xs-6 clearfix">
                    <div className="brand-text-black text-left"><small>Quantity</small></div>
                    <div className="input-group">
                        <span className="input-group-btn">
                            <button type="button" className={"btn btn-default btn-number btn-pack left px-0"} disabled={(this.state.quantity <= 1 ? "disabled" : "")} onClick={this.decrementQuantity}>
                                <i className="material-icons">&#xE15B;</i>
                            </button>
                        </span>
                        <span className="form-control input-number input-pack noselect">{this.state.quantity}</span>
                        <span className="input-group-btn">
                            <button type="button" className={"btn btn-default btn-number btn-pack right px-0"} disabled={(this.state.quantity >= 99 ? " disabled": "")} onClick={this.incrementQuantity}>
                                <i className="material-icons">&#xE145;</i>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12 pt-8">
                    {this.props.currentCart ? <button onClick={this.addToCart} className={classNames('btn btn-primary btn-block add', this.props.outOfStock && 'out-of-stock')} disabled={this.props.outOfStock ?? false}>{this.props.outOfStock ? 'Out of Stock' : 'Add to Cart'}</button> : <Link to={"/product/" + this.props.product.slug}><button className="btn btn-primary btn-block">View</button></Link>}
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    currentCart: state.cart.currentCart
});

const mapDispatchToProps = (dispatch) => ({
    addToCart: bindActionCreators(addToCart, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddToCart);