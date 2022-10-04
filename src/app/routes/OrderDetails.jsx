import React, { Component } from "react";
import Page from "app/components/Page";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ssrComponent } from "lib/ssrHelper";

import Navigation from "app/components/Navigation";
import Footer from "app/components/Footer";
import OrderDetails from "app/components/order-details/OrderDetails";
import registerOrderRedux from "app/resources/api/order";
const orderRedux = registerOrderRedux("ORDER", [
    "GET",
    "LIST",
    "CREATE",
    "UPDATE"
]);

class OrderDetailsPage extends Component {
    constructor() {
        super();

        this.state = {};
    }

    static async getInitialProps(props) {
        await props.orderActions.get(
            props.match.params.orderNumber + "/history",
            props.auth,
            {
                userId: props.user.id,
                inline: "order,address,cart,cartItems"
            }
        );
    }

    render() {
        return (
            <Page id="cart" description="....">
                <div className="body-wrapper">
                    <Navigation history={this.props.history} />
                    <div className="content-wrapper">
                        <div className="container">
                            <div className="content-container">
                                <div className="row">
                                    <div className="content mb-24 pb-24 col-xs-12 col-sm-offset-2 col-sm-8 content-height">
                                        <div className="row bb">
                                            <div className="col-xs-12">
                                                <h1>
                                                    Order Details
                        </h1>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xs-12">
                                                {this.props.order.item &&
                                                    this.props.order.item.data.length > 0 && (
                                                        <OrderDetails
                                                            currentUser={this.props.auth.currentUser}
                                                            history={this.props.history}
                                                            order={this.props.order.item.data[0].order}
                                                        />
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </Page>
        );
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    user: state.auth.currentUser,
    searchParams: state.searchParams,
    order: state.ORDER
});

const mapDispatchToProps = dispatch => ({
    orderActions: bindActionCreators(orderRedux.actionCreators, dispatch)
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ssrComponent(OrderDetailsPage));
