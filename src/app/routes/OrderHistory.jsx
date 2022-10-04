import React, { Component } from "react";
import Page from 'app/components/Page';
import classNames from 'classnames';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ssrComponent } from "lib/ssrHelper";
import Dropdown from "app/components/Dropdown";

import OrderHistory from "app/components/order-history/OrderHistory";
import registerOrderHistoryRedux from "app/resources/api/orderHistory";

import styles from './OrderHistory.module.scss';

const orderHistoryRedux = registerOrderHistoryRedux("ORDER_HISTORY", [
    "GET",
    "LIST",
    "CREATE",
    "UPDATE"
]);

class OrderHistoryPage extends Component {
    componentDidUpdate(prevProps) {
        window.scrollTo(0, 0);
    }
    state = {
        status: "PENDING"
    }
    static async getInitialProps(props) {
        await props.orderHistoryActions.list(props.auth, {
            userId: props.user.id,
            status: "PENDING",
            inline: "order"
        });
    }

    handleSelectStatus = async status => {
        this.setState({
            status: status
        });

        await this.props.orderHistoryActions.list(this.props.auth, {
            userId: this.props.user.id,
            status: status,
            inline: "order"
        });
    };

    render() {
        return (
            <Page id="order-history" description="....">
                <div className={classNames(styles.wrap, 'content-wrapper')}>
                    <div className="container">
                        <div className="content-container">
                            <div className="row">
                                <div className="content mb-24 pb-24 col-xs-12 col-sm-offset-2 col-sm-8 content-height">
                                    <div className="row bb">
                                        <div className="col-xs-12">
                                            <h1>
                                                Order History
                                            </h1>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="col-xs-12">
                                                <br />
                                                <div className="row">
                                                    <div className="col-xs-2 day-select">
                                                        <div className="cart-input-container">
                                                            <span>Status:</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-xs-6 day-select">
                                                        <Dropdown
                                                            value={this.state.status}
                                                            onClick={this.handleSelectStatus}
                                                            className="tipple-select"
                                                            placeholder="Select Status"
                                                            options={[
                                                                { value: "COMPLETED", label: "COMPLETED" },
                                                                { value: "PENDING", label: "PENDING" }
                                                            ]}
                                                        />
                                                    </div>
                                                    <div className="col-xs-5 day-select"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            {this.props.orderHistory.items && <OrderHistory orders={this.props.orderHistory.items} />}
                                            {this.props.orderHistory.items && this.props.orderHistory.items.length < 1 && <span>No data found.</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    user: state.auth.currentUser,
    searchParams: state.searchParams,
    orderHistory: state.ORDER_HISTORY
});

const mapDispatchToProps = dispatch => ({
    orderHistoryActions: bindActionCreators(
        orderHistoryRedux.actionCreators,
        dispatch
    )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ssrComponent(OrderHistoryPage));
