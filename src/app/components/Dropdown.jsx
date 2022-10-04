import React, { Component } from 'react';

import styles from './Dropdown.module.scss';

export default class Dropdown extends Component {

    constructor() {
        super();

        this.state = {
            showing: false
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleCancel, false);
        document.addEventListener('touchstart', this.handleCancel, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleCancel, false);
        document.removeEventListener('touchstart', this.handleCancel, false);
    }

    handleCancel = (ev) => {

        if (this.node && this.node.contains(ev.target)) {
            return;
        }

        if (this.state.showing) {
            this.setState({
                showing: false
            });
        }

    }

    handleClick = (ev) => {

        this.setState({
            showing: !this.state.showing
        });

    }

    handleOptionClick = (val, ev) => {
        this.props.onClick(val);
        return val;
    }

    render() {

        const offset = this.props.maxOffset ? this.props.maxOffset : 1000;

        const options = [];
        let selectedLabel = "";

        if (!this.props.options) {
            return <div />
        }

        this.props.options.forEach(x => {

            if (this.props.value === x.value) {
                selectedLabel = x.label;
            }

            options.push(<li key={x.value} onClick={this.handleOptionClick.bind(null, x.value)} className="ui-dropdown-item ui-corner-all ui-state-highlight">
                <span>{x.label}</span>
            </li>);
        })

        let topPx = 0;
        if (options.length > offset) {
            topPx = (options.length - 3) * -34;
        }

        return <div className={styles.wrap}>
            <div ref={node => this.node = node} onClick={this.handleClick} className={this.props.className + " ui-dropdown ui-widget ui-state-default ui-corner-all ui-helper-clearfix ui-dropdown-open"} >

                <label className="ui-dropdown-label ui-inputtext ui-corner-all">{selectedLabel ? selectedLabel : this.props.placeholder}</label>

                <div className="ui-dropdown-trigger ui-state-default ui-corner-right">
                    <span className="ui-clickable fa fa-fw fa-caret-down"></span>
                </div>
                {this.state.showing && <div className="ui-dropdown-panel ui-widget-content ui-corner-all ui-shadow" style={{ display: "block", zIndex: 1001, top: topPx+'px', left: 0 }}>

                    <div className="ui-dropdown-items-wrapper" style={{ maxHeight: "250px" }}>
                        <ul className="ui-dropdown-items ui-dropdown-list ui-widget-content ui-widget ui-corner-all ui-helper-reset">
                            {options}
                        </ul>
                    </div>
                </div>}
        </div>
        </div>
    }

}