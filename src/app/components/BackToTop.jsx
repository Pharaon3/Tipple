import React, { Component } from 'react';
import classNames from 'classnames';

import styles from './BackToTop.module.scss';

export default class BackToTop extends Component {

    state = {
        isVisible: false
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = (event) => {
        if (window.pageYOffset > window.innerHeight * 2) {
            if (!this.state.isVisible) {
                this.setState({
                    isVisible: true
                });
            }
        } else {
            if (this.state.isVisible) {
                this.setState({
                    isVisible: false
                });
            }
        }

    }

    backToTop = () => {
        window.scrollTo(0, 0);
    }

    render() {
        const { path, hidePaths } = this.props;
        const hideBasedOnPath = (hidePaths ?? []).indexOf(path) !== -1;
        return <button className={classNames(styles.back, this.state.isVisible && !hideBasedOnPath && styles.active)} onClick={this.backToTop}>
            <i className="material-icons">&#xE5D8;</i>
        </button>
    }
}