import React, { Component } from 'react';
import classNames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ssrComponent } from 'lib/ssrHelper';

import registerContentRedux from 'app/resources/api/content';

import styles from './SevenEleven.module.scss';

const contentRedux = registerContentRedux('CONTENT_LIST', ['LIST']);

class SevenElevenFooter extends Component {

  static async getInitialProps(props) {
    if (props.content.items !== undefined) {
      return;
    }

    return await props.contentActions.list(props.auth, {
      fields: 'title,uri'
    });
  }

  render() {

    let contentLinks = [];

    if (Array.isArray(this.props.content.items)) {
      this.props.content.items.forEach(c => {
        contentLinks.push(<li key={c.uri}><Link to={"/content/" + c.uri}>{c.title}</Link></li>)
      })
    }

    return [<div key="push" className="push"></div>,
    <footer key="footer" className={classNames(styles.footer, 'footer-styled', 'brand-text-100')}>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-2">
            <div className="row">
              <div className="col-xs-12">
                <p>Powered by</p>
                <img className={styles['tipple-logo']} alt="Logo" src="/static/assets/img/logo-white.png" />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4">
            <ul className="list-unstyled">
              <li><Link to={`/content/faq`}>FAQ</Link></li>
              <li><Link to={`/content/privacy-policy`}>Privacy Policy</Link></li>
              <li><Link to={`/content/terms-and-conditions`}>Terms and Conditions</Link></li>
              <li><Link to={`/content/data-collection-notice`}>Data Collection Notice</Link></li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 text-right small">
            <div className={classNames(styles.footerText, 'text-right')}>*Delivery is available in select Melbourne suburbs only. Selected products only. Not all in-store promotions are available online. Not all online promotions are available in-store.</div>
            {/* <br /> */}
                        &copy; {new Date().getFullYear()} 7-Eleven Stores Pty Ltd. All rights reserved.<br />&copy; Tipple Group Pty Ltd. All rights reserved.
                    </div>
        </div>
      </div>
    </footer>]
  }
}

const mapStateToProps = (state, props) => ({
  auth: state.auth,
  content: state.CONTENT_LIST
});

const mapDispatchToProps = (dispatch) => ({
  contentActions: bindActionCreators(contentRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ssrComponent(withRouter(SevenElevenFooter)));