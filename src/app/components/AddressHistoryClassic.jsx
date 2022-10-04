import React, { Component } from 'react';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import registerRecentAddressRedux from 'app/resources/api/recentAddresses';
import { setCartAddress } from 'app/resources/action/Cart';

import styles from './AddressHistoryClassic.module.scss';

const recentAddressesRedux = registerRecentAddressRedux('RECENT_ADDRESSES_LIST', ['LIST']);

class AddressHistory extends Component {

    componentDidMount() {
        if (this.props.auth.token !== null) {
            this.props.recentAddressActions.list(this.props.auth, {
                limit: 2
            });
        }
    }
    
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.auth.token === null && this.props.auth.token !== null) {
            await this.props.recentAddressActions.list(this.props.auth, {
                limit: 2
            });                
        }
    }

    handleSelect = addressId => {
        this.props.setCartAddress({
            id: addressId
        }, this.props.auth, this.props.history);
    };

    handleSubmit = () => {

    }

    render() {

        let i = 0;
        let recentAddresses = [];
        this.props.recentAddresses && this.props.recentAddresses.items && this.props.recentAddresses.items.forEach(rAddress => {
            recentAddresses.push(<div onClick={this.handleSelect.bind(null, rAddress.id)} key={i++}>
                <i className="fa fa-map-marker"></i>
                <span>{rAddress.addressLine1}, {rAddress.city}, {rAddress.state}, {rAddress.postcode}</span>
                <i className="fa fa-chevron-right pull-right"></i>
            </div>);
        });

        return recentAddresses.length > 0 && <div className={classNames(styles.history, 'col-md-offset-3 col-xs-12 col-md-6 recent-addresses')}>
            <span>Recent Ordered Addresses</span>
            {recentAddresses}
        </div>
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    recentAddresses: state.RECENT_ADDRESSES_LIST
});

const mapDispatchToProps = (dispatch) => ({
    setCartAddress: bindActionCreators(setCartAddress, dispatch),
    recentAddressActions: bindActionCreators(recentAddressesRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressHistory);