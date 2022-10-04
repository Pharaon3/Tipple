import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import Helmet from 'react-helmet';
import config from '../config';
import { getItem } from 'lib/util/localStorage';
import { SITE_ID_WAREHOUSE, SITE_ID_BUSINESS } from 'lib/constants/app';

import styles from './Page.module.scss';

let SITE_URL = 'http://localhost:3000';
if (typeof window !== 'undefined') {
    SITE_URL = window.location.protocol + "//" + window.location.hostname
} else {
    if (config.siteRoot) {
        SITE_URL = config.siteRoot;
    }
}

const FACEBOOK_APP_ID = 'XXXXXXXXX';

let defaultTitle = 'Tipple - Alcohol Delivered Fast';
let defaultDescription = 'Alcohol delivered fast! Browse over 500 products and get them delivered with Tipple alcohol delivery.';
const siteId = getItem('tipple_site_id') || config.siteId;

switch (siteId) {
    case SITE_ID_WAREHOUSE:
        defaultTitle = 'Tipple Warehouse - Great range of Spirits, Wine and Beer delivered to you';
        defaultDescription = 'Save money. Great Range. Australia\'s best spirits, wine and beer direct from the Warehouse.';
        break;
    case SITE_ID_BUSINESS:
        defaultTitle = 'Tipple Business - Great range of Spirits, Wine and Beer delivered cold to your business';
        defaultDescription = 'Cold and fast. Save money. Great Range. Australia\'s best spirits, wine and beer on demand to your business.';
        break;
    default:
}
// const defaultImage = `${SITE_URL}${logo}`;
const defaultSep = ' | ';

class Page extends Component {
    getMetaTags(
        {
            title,
            description,
            image,
            contentType,
            twitter,
            noCrawl,
            published,
            updated,
            category,
            tags
        },
        pathname
    ) {
        let themeTitle = false;

        if (this.props.theme) {
            if (this.props.theme?.metaTitle) {
                title = this.props.theme.metaTitle;
                themeTitle = true;
            }

            if (this.props.theme?.metaDescription) {
                description = this.props.theme.metaDescription;
            }
        }

        const theTitle = title
            ? (title + 
                (!themeTitle ? (title.indexOf(defaultSep + defaultTitle) === -1 ? defaultSep + defaultTitle : '') : '')).substring(0, 60)
            : defaultTitle;
        const theDescription = description
            ? description.substring(0, 155)
            : defaultDescription;
        // const theImage = image ? `${SITE_URL}${image}` : defaultImage;

        const metaTags = [
            { itemprop: 'name', content: theTitle },
            { itemprop: 'description', content: theDescription },
            // { itemprop: 'image', content: theImage },
            { name: 'description', content: theDescription },
            { property: 'og:title', content: theTitle },
            { property: 'og:type', content: contentType || 'website' },
            { property: 'og:url', content: SITE_URL + pathname },
            // { property: 'og:image', content: theImage },
            { property: 'og:description', content: theDescription },
            { property: 'og:site_name', content: themeTitle ? title : defaultTitle },
            { property: 'fb:app_id', content: FACEBOOK_APP_ID }
        ];

        if (noCrawl) {
            metaTags.push({ name: 'robots', content: 'noindex, nofollow' });
        }

        if (published) {
            metaTags.push({ name: 'article:published_time', content: published });
        }
        if (updated) {
            metaTags.push({ name: 'article:modified_time', content: updated });
        }
        if (category) {
            metaTags.push({ name: 'article:section', content: category });
        }
        if (tags) {
            metaTags.push({ name: 'article:tag', content: tags });
        }

        return metaTags;
    }

    render() {
        const { children, id, className, ...rest } = this.props;
        let helmetTitle = rest.title ? rest.title : defaultTitle;

        if (this.props.theme?.metaTitle) {
            helmetTitle = this.props.theme.metaTitle;
        }

        return (
            <div id={id} className={classNames(className, styles.page)}>
                <Helmet
                    htmlAttributes={{
                        lang: 'en',
                        itemscope: undefined,
                        itemtype: `http://schema.org/${rest.schema || 'WebPage'}`
                    }}
                    title={helmetTitle}
                    link={[
                        {
                            rel: 'canonical',
                            href: SITE_URL + this.props.location.pathname
                        }
                    ]}
                    meta={this.getMetaTags(rest, this.props.location.pathname)}
                />
                {children}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    theme: state.theme
});

export default withRouter(connect(mapStateToProps)(Page));
