import React, { Component } from 'react';
import classNames from 'classnames';
import Modal from 'app/components/Modal';

import { connect } from 'react-redux';

import styles from './RemovedItems.module.scss';

class RemovedItemsPopup extends Component {

    state = {
        display: false
    }

    closeClick = (ev) => {
        this.setState({
            display: false
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.cart.currentCart && prevProps.cart.currentCart && this.props.cart.currentCart.removedItems && this.props.cart.currentCart.removedItems.length > 0 && (!prevProps.cart.currentCart.removedItems || prevProps.cart.currentCart.removedItems.length === 0)) {
            this.setState({
                display: true
            });
        }
    }

    render() {
        return this.state.display ? <Modal analyticsMessage="Products Not Available" analyticsType="popup" analyticsFrom={window.location.pathname}>
            <div className={styles.overlay}>

                <div onClick={this.closeClick} className="loading-overlay-transparent orange fadein"></div>
                <div className={classNames(styles.content, 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>

                    <div className="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                        <span className="ui-dialog-title">
                            <h1>Products Not Available</h1>
                            <a href="#close" onClick={this.closeClick} role="button" className="ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all">
                                <span className="fa fa-fw fa-close"></span>
                            </a>
                        </span>
                    </div>
                    <div className="ui-dialog-content ui-widget-content">
                        <p>Some items in your cart are not available in your new address and have been removed from your cart.</p>

                        {this.props.cart.currentCart.removedItems && this.props.cart.currentCart.removedItems.map(item => {
                            return <div className="mb-10">• {item.quantity}x {item.productName}{item.packSize ? ` - ${item.packSize === 1 ? 'Single' : item.packSize + ' Pack'}` : ''}</div>
                        })}

                        <button className="btn btn-primary btn-lg btn-block mt-15" type="submit" onClick={this.closeClick}>Ok</button>
                    </div>
                </div>
            </div>
        </Modal> : null
    }
}


const mapStateToProps = state => ({
    cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RemovedItemsPopup);
