import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            req: 1,
            isLoading: false
        };
    }

    getDate = deliveryDate => {
        const delivery = new Date(deliveryDate);
        return delivery.toDateString();
    };

    render() {
        const item = this.props.item;

        return (
            <div>
                <div className="cart-items row added noselect pt-24 pb-24 clearfix">
                    <div className="col-xs-9 col-md-9">
                        <span className="title">
                            <Link to={"/order/details/" + item.order.orderNumber}>
                                {item.order.orderNumber}
                            </Link>
                        </span>
                        <br />
                        <span>{item.status}</span>
                        <br />
                        <span>{this.getDate(item.order.delivered)}</span>
                    </div>
                    <div className="col-xs-3 col-md-3">
                        <div className="text-right">
                            <br />
                            {/* <a className="change-button" href="#">
                Reorder
              </a> */}
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

export default connect(mapStateToProps)(Item);
