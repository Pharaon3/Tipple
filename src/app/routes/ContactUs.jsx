import React, { Component } from 'react';
import Page from 'app/components/Page';
import classNames from 'classnames';

import ContactUsForm from 'app/components/contact/Form';

import styles from './ContactUs.module.scss';

class ContactUsPage extends Component {

    constructor() {
        super();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return <Page id="contact-us" description="....">
            <div className={classNames(styles.wrap, 'content-wrapper')}>
                <div className="container">
                    <div className="row">
                        <div className="content-container col-xs-12 col-sm-12 col-md-9">
                            <div className="row">
                                <div className="content mb-24 px-24 col-xs-12">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <h1>Contact Us</h1>
                                            <p>We love hearing from our amazing customers. If you have any questions, queries, advice, or just want to have a chat,
                                                fill in the form to the right and we’ll get back to you as soon as we possibly can.</p>
                                            <address>
                                                <strong className="text-primary">Tipple Group Pty Ltd</strong><br />
                                                Level 1, 146 Chapel Street<br />
                                                St Kilda, VIC, 3182
                                            </address>
                                            <span className="text-primary">Email:</span> <a href="mailto:support@tipple.com.au">support@tipple.com.au</a><br />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="content mb-24 px-24 col-xs-12">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <h1>Careers</h1>
                                            <p>Currently there are no positions that Tipple is looking to fill. Please check back later for opportunities. Please send your resume and info to:</p>
                                            <p><span className="text-primary">Contact:</span> <a href="mailto:support@tipple.com.au">support@tipple.com.au</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="content mb-24 px-24 col-xs-12">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <h1>Product Stocking Enquiry</h1>
                                            <p>We’re always on the lookout for great drinks to join us. Team up with us and reach more customers than ever.</p>
                                            <p><span className="text-primary">Contact:</span> <a href="mailto:supply@tipple.com.au">supply@tipple.com.au</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sidebar pt-24 col-xs-12 col-sm-12 col-md-3">
                            <div className="row">
                                <div className="col-xs-12 inner pb-12">
                                    <div className="row">
                                        <div className="col-xs-12 title">Contact Us</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-12 container">
                                            <ContactUsForm />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    }
}

export default ContactUsPage;