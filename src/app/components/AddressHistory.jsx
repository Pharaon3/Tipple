import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import registerRecentAddressRedux from 'app/resources/api/recentAddresses';
import { setCartAddress } from 'app/resources/action/Cart';

import styles from './AddressHistory.module.scss';

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
            recentAddresses.push(<div className={styles.address} onClick={this.handleSelect.bind(null, rAddress.id)} key={i++}>
                <span>{rAddress.addressLine1}, {rAddress.city}, {rAddress.state}, {rAddress.postcode}</span>
            </div>);
        });

        return recentAddresses.length > 0 && <div className={styles.addresses}>
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