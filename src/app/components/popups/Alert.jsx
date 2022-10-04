import React, { Component } from 'react';
import Modal from 'app/components/Modal';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hideAlertShowing } from 'app/resources/modules/tdmReveal';

import styles from './Alert.module.scss';

class AlertPopup extends Component {

    closeClick = (ev) => {
        ev.preventDefault();

        this.props.hideAlertShowing();
    }

    ok = () => {
        this.props.hideAlertShowing();
    }

    render() {
        return this.props.alertShowing ? <Modal suppressAnalytics>
            <div className={styles.overlay}>
                <div onClick={this.closeClick} className={classNames(styles.loading, 'loading-overlay-transparent', 'fadein')}></div>
                <div className={classNames(styles.content, 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all')}>
                    <div className="ui-dialog-content ui-widget-content ui-shadow">
                        <div className="text-center">
                            {this.props.message}
                        </div>
                        <br />
                        <div className="col-xs-12">
                            {/* <div className="col-xs-6"> <button onClick={this.closeClick} className="btn btn-primary btn-lg btn-block btn-cancel mt-15">Back</button></div> */}
                            <div className="col-xs-6 col-xs-offset-3"> <button onClick={this.ok} className="btn btn-primary btn-lg btn-block mt-15">OK</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal> : null
    }
}

const mapStateToProps = state => ({
    alertShowing: state.tdmReveal?.alertShowing ?? false,
    message: state.tdmReveal?.alertMessage
});

const mapDispatchToProps = (dispatch) => ({
    hideAlertShowing: bindActionCreators(hideAlertShowing, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertPopup);
