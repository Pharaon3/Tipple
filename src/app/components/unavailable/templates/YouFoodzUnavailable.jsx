import React from 'react';
import { withRouter } from 'react-router-dom';
import Status from 'app/components/Status';

import styles from './YouFoodzUnavailable.module.scss';
import Page from 'app/components/Page';

export const Unavailable = (props) => {
    const { location, code } = props;

    const reload = () => {
        try {
            window.location.reload();
        } catch(e) {}
    };
    
    return (
        <Page
            id="not-found"
            description="This is embarrassing."
            noCrawl
            className={styles.page}
        >
            <Status code={code ? code : (location && location.state && location.state.code ? location.state.code : '404')}>
                <div className={styles.notfound}>
                    <div className="not-found">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-6 text-left">
                                <h1 className="tagline font-size-45">Oops! You found a broken link.</h1>
                                <h2 className="sub-tagline font-size-16">We’re not exactly sure what you were looking for but head home to start looking!</h2>
                                    <button className="btn btn-primary go-to-homepage" onClick={reload}>Retry</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Status>    
        </Page>
    );
}

export default withRouter(Unavailable);