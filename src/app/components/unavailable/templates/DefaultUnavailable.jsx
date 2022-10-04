import React from 'react';
import { withRouter } from 'react-router-dom';
import Status from 'app/components/Status';

import styles from './DefaultUnavailable.module.scss';
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
                                    <h1 className="tagline font-size-45">Wohhh this place is cool!</h1>
                                    <h2 className="sub-tagline font-size-16">Stumbling again in places you don’t belong? Nothing to see here</h2>
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