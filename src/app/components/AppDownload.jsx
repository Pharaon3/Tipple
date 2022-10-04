import React from 'react';
import classNames from 'classnames';

import styles from './AppDownload.module.scss';

export default () => (
    <div className={classNames(styles.download, 'border-top-primary')}>
        <div className="container">
            <div className="row is-table-row">
                <div className="col-xs-6 col-sm-6 text-right"><a rel="noopener noreferrer" href="https://itunes.apple.com/au/app/tipple/id1064886466" target="_blank"><img alt="Apple Store" src="/static/assets/img/apple-store.png" /></a></div>
                <div className="col-xs-6 col-sm-6 text-left"><a rel="noopener noreferrer" href="https://play.google.com/store/apps/details?id=com.tipple" target="_blank"><img alt="Google Play" src="/static/assets/img/google-play.png" /></a></div>
            </div>
        </div>
    </div>
);