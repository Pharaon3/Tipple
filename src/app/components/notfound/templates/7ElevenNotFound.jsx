import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Status from 'app/components/Status';

import styles from './SevenElevenNotFound.module.scss';

export const NotFound = (props) => {
    const { location, code } = props;
    
    return (
        <Status code={code ? code : (location && location.state && location.state.code ? location.state.code : '404')}>
            <div className={styles.notfound}>
                <div className="not-found">
                    <div className="container">
                        <div className="row">

                            <div className="col-sm-6 text-left">
                                <h1 className="tagline font-size-45">Oops! You found a broken link.</h1>
                                <h2 className="sub-tagline font-size-16">We’re not exactly sure what you were looking for but head home to start looking!</h2>
                                <Link to="/"><button className="btn btn-primary go-to-homepage">Back to Home</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Status>
    );
}

export default withRouter(NotFound);