import React from 'react';
import classNames from 'classnames';

import styles from './SevenElevenErrorBoundary.module.scss';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        
      if (global.newrelic) {
        global.newrelic.noticeError(error);
      }
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div className={styles['not-found']}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 text-left">
                                <h1 className={classNames(styles['tagline'], 'font-size-45')}>We're currently doing some maintenance.</h1>
                                <button onClick={() => typeof window !== 'undefined' && window.location.reload()} className={classNames(styles['go-to-homepage'], 'btn btn-primary ')}>Check if we're back!</button>
                            </div>
                        </div>
                    </div>
                </div>;
        }

        return this.props.children;
    }
}
