import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Status from 'app/components/Status';

import styles from './DefaultNotFound.module.scss';

export const NotFound = (props) => {
    const { location, code } = props;
    
    return (
        <Status code={code ? code : (location && location.state && location.state.code ? location.state.code : '404')}>
            <div className={styles.notfound}>
                <div className="not-found">
                    <div className="container">
                        <div className="row">

                            <div className="col-sm-6 text-left">
                                <h1 className="tagline font-size-45">Wohhh this place is cool!</h1>
                                <h2 className="sub-tagline font-size-16">Stumbling again in places you don’t belong? Nothing to see here</h2>
                                <Link to="/"><button className="btn btn-primary go-to-homepage">Take me home</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Status>
    );
}

export default withRouter(NotFound);