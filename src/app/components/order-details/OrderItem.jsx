import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _debounce from 'lib/debounce';

import { addToCart } from 'app/resources/action/Cart';
import { getSalePrice, getTotalPrice, getDescriptiveProductPackName } from 'app/resources/cart';

import formatCurrency from 'lib/currency';

class Item extends Component {

    constructor(props) {
        super(props);

        this.state = {
            req: 1,
            quantity: this.props.item.quantity,
            isLoading: false
        }

        this.incrementQuantitySend = _debounce(this.incrementQuantitySendR, 300);
    }

    render() {
        const item = this.props.item;
        return (
            <div>
                <div className="cart-items row added noselect pt-24 pb-24 clearfix">
                    <div className="col-xs-9 col-md-9">
                        <span className="title">
                        {item.productName}
                        </span><br />
                        <span>{getDescriptiveProductPackName(item.packSize)}</span><br />
                        <span>{this.state.quantity} x {formatCurrency('$', getSalePrice(item.salePrice, item.price), 0, 2)}</span>
                        
                    </div>
                    <div className="col-xs-3 col-md-3">
                        <div className="text-right">
                            {this.state.isLoading !== false ? <span><i style={{ fontSize: '24px' }} className="fa fa-spin">&#xf1ce;</i></span> : <span className="price">Item Total: {formatCurrency('$', getTotalPrice(item.salePrice, item.price, item.quantity), 0, 2)}</span>}
                        </div>
                    </div>
                </div>

            </div>
        );

    }
}


const mapStateToProps = (state, props) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    addToCart: bindActionCreators(addToCart, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);