import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Modal from 'app/components/Modal';
import styles from './Verification.module.scss';
import Spinner from 'app/components/Spinner';
import { Link } from 'react-router-dom';

class VerificationPopup extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {

        return (
                <Modal analyticsMessage="Verification" analyticsType="popup" analyticsFrom={window.location.pathname}>
                    <div className={styles.overlay}>
                        <section className={classNames(styles['address-select'], 'fadein ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow')}>
                            { ( this.props.displayed === 1 ) && <Spinner /> }
                            { ( this.props.displayed === 1 ) && <p>Verifying your identity document...</p> }
                            { ( this.props.displayed === 2 ) &&
                                <div className={styles.verifycheck}>
                                    <Link to='/checkout'><i className="fa fa-check-circle"></i></Link>
                                </div>
                            }   
                            { ( this.props.displayed === 2 ) && <p>Your age was successfully verified</p> }
                        </section>
                    </div>
                </Modal>
        );
    }
}

const mapStateToProps = (state, props) => ({
 
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(VerificationPopup); 