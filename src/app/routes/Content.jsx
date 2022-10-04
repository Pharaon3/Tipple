import React, { Component } from 'react';
import Page from 'app/components/Page';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ssrComponent } from 'lib/ssrHelper';
import Spinner from 'app/components/Spinner';

import registerContentRedux from 'app/resources/api/content';

import styles from './Content.module.scss';

const contentRedux = registerContentRedux('CONTENT', ['QUERY']);

class ContentPage extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.content !== this.props.match.params.content) {
            this.props.contentActions.query(this.props.auth, {
                uri: this.props.match.params.content
            });
        }

        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        this.props.contentActions.clear();
    }

    static async getInitialProps(props) {

        // Prevent the web request from happening if already loaded
        if (props.content.data) {
            return;
        }

        return await props.contentActions.query(props.auth, {
            uri: props.match.params.content
        });

    }

    render() {

        const content = this.props.content.data && this.props.content.data[0];

        return <Page id="content" description="....">
            <div className={classNames(styles.wrap, 'content-wrapper')}>
                <div className="container">
                    <div className="row">
                        <div className="content-container col-xs-12 col-sm-12 col-md-9">
                            <div className="row">
                                <div className={classNames(styles['content-height'], 'content mb-24 px-24 col-xs-12')}>
                                    {content ? <div className="row">
                                        <div className="col-xs-12">
                                            <h1>{content.title}</h1>
                                        </div>
                                        <div className="col-xs-12" dangerouslySetInnerHTML={{
                                            __html: content.content
                                        }} />
                                    </div> : <div className="row"><Spinner /></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    }
}

const mapStateToProps = (state, props) => ({
    auth: state.auth,
    searchParams: state.searchParams,
    content: state.CONTENT
});

const mapDispatchToProps = (dispatch) => ({
    contentActions: bindActionCreators(contentRedux.actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ssrComponent(ContentPage));