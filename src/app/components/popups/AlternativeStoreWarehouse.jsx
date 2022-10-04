import React from 'react';
import Modal from 'app/components/Modal';

import './AlternativeStoreWarehouse.scss';

export const AlternativeStoreWarehousePopup = (props) => {
    return (
        <Modal analyticsMessage={props.zone.siteName} analyticsType="popup" analyticsFrom={window.location.pathname}>
            <div className="modal-overlay" id="alternativeStoreWarehouseModal">

                <div onClick={(e) => { props.onCloseModal(e); }} className="loading-overlay-transparent grey fadein"></div>

                <div className="modal--alternative-warehouse fadein ui-shadow">
                    <div className="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                        <span className="ui-dialog-title">
                            <h1>Delivery Options</h1>
                        </span>
                    </div>
                    <div className="ui-dialog-content ui-widget-content">
                        <div className="alt-store-cards">
                            <div className="alt-store-card disabled">
                                <h2>30 Minute Delivery</h2>
                                <ul>
                                    <li>
                                        <i className="fa fa-check-circle"></i>
                                        Delivered cold
                                    </li>
                                    <li>
                                        <i className="fa fa-check-circle"></i>
                                        Great range
                                    </li>
                                </ul>
                                <img alt="Tipple On Demand" className="img-responsive" src="/static/assets/img/home/select-tipple-ondemand.svg" />
                                <button className="btn btn-default" onClick={(e) => { props.onCloseModal(e); props.onRequestClick(); }}>Sorry Currently Not Available</button>
                                <div className="alt-store-card-ribbon">
                                    <div className="ribbon">
                                        <button className="btn btn-primary" onClick={(e) => { props.onCloseModal(e); props.onRequestClick(); }}>
                                            Request your suburb!
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="alt-store-card">
                                <h2>Next Day Shipping</h2>
                                <ul>
                                    <li>
                                        <i className="fa fa-check-circle"></i>
                                        Bulk deals
                                    </li>
                                    <li>
                                        <i className="fa fa-check-circle"></i>
                                        Exclusive Range
                                    </li>
                                </ul>
                                <img alt="Tipple Warehouse" className="img-responsive" src="/static/assets/img/home/select-tipple-warehouse.svg" />
                                <button className="btn btn-primary" onClick={props.goToAlternativeStore}>Shop Tipple Warehouse</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AlternativeStoreWarehousePopup;
