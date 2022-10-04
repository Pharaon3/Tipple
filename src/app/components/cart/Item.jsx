import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import _debounce from 'lib/debounce';

import {
  addToCart,
  removeFromCart,
  removeBundleFromCart,
} from 'app/resources/action/Cart';
import {
  getSalePrice,
  getTotalPrice,
  getDescriptiveProductPackName,
} from 'app/resources/cart';

import formatCurrency from 'lib/currency';

import styles from './Item.module.scss';

class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      req: 1,
      quantity: this.props.item.quantity,
      isLoading: false,
    };

    this.incrementQuantitySend = _debounce(this.incrementQuantitySendR, 300);
  }

  incrementQuantitySendR = async () => {
    const qt = this.state.quantity;
    const req = this.state.req;
    if (qt > 0 && qt < 99) {
      await this.props.addToCart(
        this.props.item.productId,
        this.props.item.productPackId,
        qt,
        this.props.item.packSize,
        this.props.item.salePrice > 0
          ? this.props.item.salePrice
          : this.props.item.price,
        this.props.item.cartId,
        this.props.item.productName,
        this.props.item.quantity,
        true,
        this.props.auth
      );
    }

    if (this.state.req === req) {
      this.setState({
        isLoading: false,
      });
    }
  };

  removeFromCart = () => {
    const analyticsVariants = this.props.item?.bundleItems?.map((item) => {
      return {
        group_name: item?.variantGroupName,
        product_name: item?.productName,
        product_id: item?.productId,
        pack_size: item?.packSize,
        quantity: item?.quantity,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
      };
    });
    const isBundle = typeof this.props.item.groupRef === 'string';

    if (isBundle) {
      this.props.removeBundleFromCart(
        this.props.item.groupRef,
        this.props.auth
      );
    } else {
      this.props.removeFromCart(
        this.props.item.id,
        this.props.item.productId,
        this.props.item.productPackId,
        this.props.item.packSize,
        this.props.item.salePrice > 0
          ? this.props.item.salePrice
          : this.props.item.price,
        this.props.item.cartId,
        this.props.item.productName,
        this.props.item.quantity,
        this.props.auth,
        analyticsVariants
      );
    }
  };

  incrementQuantity = () => {
    this.setState(
      {
        req: this.state.req + 1,
        quantity: this.state.quantity + 1,
        isLoading: true,
      },
      this.incrementQuantitySend
    );
  };

  decrementQuantity = () => {
    this.setState(
      {
        req: this.state.req + 1,
        quantity: this.state.quantity - 1,
        isLoading: true,
      },
      this.incrementQuantitySend
    );
  };

  render() {
    const item = this.props.item;
    const storePath = this.props.storePath;
    // there's no type from the cartItems, so will rely on groupRef to distinguish a bundle from a product
    const isBundle = typeof item.groupRef === 'string';
    const isVariantItem = item?.variantGroupName ? true : false;

    return (
      <div className={classNames(styles.item, 'noselect')}>
        <div className={styles.image}>
          <img
            src={item?.primaryImageSrc}
            className="img-responsive"
            alt={item.name}
            onError={(e) => {
              if (
                e.target.src !==
                '/static/assets/img/products/default-product.png'
              ) {
                e.target.src =
                  '/static/assets/img/products/default-product.png';
              }
            }}
          />
        </div>
        {isBundle ? (
          <div className={styles.bundle}>
            <span className={styles.title}>
              <Link
                to={`${storePath}/collection/${item.collectionSlug}/bundle`}
              >
                {item.productName}
              </Link>
            </span>
            <ul>
              {(item?.bundleItems ?? []).map((bundleItem) => (
                <li key={bundleItem.productId}>
                  {bundleItem.quantity}x {bundleItem.productName}{' '}
                  {bundleItem.packSize > 1 && bundleItem.packSize + 'pk'}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={styles.product}>
            <span className={styles.title}>
              <Link
                to={`/product/${item.slug}${
                  item?.packSize ? `?packSize=${item.packSize}` : ''
                }`}
              >
                {item.productName}
              </Link>
            </span>
            <br />
            <span className={styles.grey}>
              {getDescriptiveProductPackName(item.packSize)}
            </span>
            <br />
            {isVariantItem && (
              <ul>
                {(item?.bundleItems ?? []).map((bundleItem) => (
                  <li key={bundleItem.productId} className={styles.grey}>
                    {bundleItem.quantity}x {bundleItem.productName}{' '}
                    {bundleItem.packSize > 1 && bundleItem.packSize + 'pk'}
                  </li>
                ))}
              </ul>
            )}
            {!isVariantItem && (
              <span className={styles.grey}>
                {this.state.quantity} x{' '}
                {formatCurrency(
                  '$',
                  getSalePrice(item.salePrice, item.price),
                  0,
                  2
                )}
              </span>
            )}
            {!isVariantItem && (
              <div className="input-group mt-12" style={{ maxWidth: '113px' }}>
                <span className="input-group-btn">
                  <button
                    type="button"
                    className={'btn btn-default btn-number btn-pack left px-0'}
                    disabled={
                      this.state.quantity <= 1 || item?.groupRef
                        ? 'disabled'
                        : ''
                    }
                    onClick={this.decrementQuantity}
                  >
                    <i className="material-icons">&#xE15B;</i>
                  </button>
                </span>
                <span className="form-control input-number input-pack noselect">
                  {this.state.quantity}
                </span>
                <span className="input-group-btn">
                  <button
                    type="button"
                    className={'btn btn-default btn-number btn-pack right px-0'}
                    disabled={
                      this.state.quantity >= 99 || item?.groupRef
                        ? ' disabled'
                        : ''
                    }
                    onClick={this.incrementQuantity}
                  >
                    <i className="material-icons">&#xE145;</i>
                  </button>
                </span>
              </div>
            )}
          </div>
        )}
        <div className={styles.remove}>
          <div className="text-right">
            <button
              className="btn btn-primary btn-cancel mb-24"
              onClick={this.removeFromCart}
            >
              <i className="material-icons">&#xE92B;</i>
              <span className="hidden-sm hidden-xs">Remove</span>
            </button>
            <br />
            {this.state.isLoading !== false ? (
              <span>
                <i style={{ fontSize: '24px' }} className="fa fa-spin">
                  &#xf1ce;
                </i>
              </span>
            ) : (
              <span className={styles.price}>
                <p className={styles.grey}>
                  Item Total:{' '}
                  {formatCurrency(
                    '$',
                    getTotalPrice(item.salePrice, item.price, item.quantity),
                    0,
                    2
                  )}
                </p>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  auth: state.auth,
  storePath: state.cart?.currentCart?.storePath,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: bindActionCreators(addToCart, dispatch),
  removeFromCart: bindActionCreators(removeFromCart, dispatch),
  removeBundleFromCart: bindActionCreators(removeBundleFromCart, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);
