import React from 'react';
import ReactDOM from 'react-dom';
import { AnalyticsEvents } from 'lib/analytics';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.modalRoot = document.getElementById('modal-root');
        this.el = document.createElement('div');
    }

    componentDidMount() {
        const analyticsData = {
            'modal': {
                'message': this.props.analyticsMessage? this.props.analyticsMessage : 'Unset',
                'from': this.props.analyticsFrom? this.props.analyticsFrom : 'Unset',
                'type': this.props.analyticsType? this.props.analyticsType : 'Unset',
            }
        };

        if (!this.props?.suppressAnalytics) {
            window.tippleAnalytics.trigger(AnalyticsEvents.user_alert, analyticsData );
        }
        this.modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        this.modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el,
        );
    }
}
