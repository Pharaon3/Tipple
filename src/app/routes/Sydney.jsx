import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Page from 'app/components/Page';
import { ssrComponent } from 'lib/ssrHelper';
import cn from 'classnames';
import ShopButton from 'app/components/homepage/ShopButton';
import { sydney as suburbs } from 'lib/constants/deliverySuburbs';
import styles from './Sydney.module.scss';

const suburbsSorted = suburbs.sort((a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  return 0;
});

class Sydney extends Component {

  componentDidMount() {
      window.scrollTo(0, 0);
  }

  static async getInitialProps(props) { }

  render() {
    return (
      <Page id="Sydney" title="Alcohol Delivery Sydney | Tipple - Alcohol Delivered Fast" description="Alcohol Delivery in Sydney" className={cn(styles['sydney'], styles.pageLocation)}>
        <div className={cn(styles.header, styles.section, 'container-fluid')}>
          <div className="container container-wide">
            <div className={cn(styles.headerCopy)}>
              <h1>
                Alcohol Delivery in Sydney
              </h1>
            </div>
          </div>
          <div className={cn(styles.headerImage)} />
        </div>

        <div className={cn(styles.section, styles.white, styles.subheader, 'container-fluid')}>
          <div className="container container-wide">
            <div className="row">
              <div className="col-xs-12 col-md-6">
                <h3 className={cn(styles.titleFirst)}>Sydney's Alcohol Delivery Favourite</h3>
                <p>
                  Since launching our alcohol delivery platform across Sydney in early 2018, we’ve been 
                  working hard to bring our ‘bottle shop in your pocket’ concept to more of Sydney’s sunny 
                  suburbs. With hundreds of alcohol products on offer and fast delivery across Sydney, 
                  we’re now ready to bring the party to more of Sydney!
                </p>
              </div>
              <div className="col-xs-12 col-md-6">
                <h3>The Tipple Difference</h3>
                <p>
                  At Tipple we partner with local independent Sydney bottle shops to help us get your 
                  alcohol to you quick. Our ‘bottle shop in your pocket’ concept means you get a bigger 
                  range of products available for delivery to your door while still supporting the 
                  local independent Sydney alcohol retailers fulfilling your order. Win win!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(styles.section, 'container-fluid')}>
          <div className="container container-wide">
            <div className="row">
              <div className="col-xs-12">
                <h2>Sydney Delivery Details</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 clearfix">
                <div className="row">
                  <div className="col-md-12">
                    <h3>Sydney Hours</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <p>Open 7 days a week for delivery between midday and 10pm</p>
                    <p>Tipple is closed in Sydney on Christmas Day and Good Friday.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 clearfix">
                <div className="row">
                  <div className="col-md-12">
                    <h3>Delivery Cost</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <p>Our delivery fee in Sydney is $7.95 with a minimum order of $30.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 clearfix">
                <div className="row">
                  <div className="col-md-12">
                    <h3>Delivery Partners</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <p>Interested in becoming a Sydney alcohol delivery partner? We’re always on the 
                      lookout for bottle shops in Sydney to join! <Link to="/contact-us">Get in touch here</Link> to register your 
                      interest.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(styles.section, styles.white, 'container-fluid')}>
          <div className="container container-wide">
            <div className="row">
              <div className="col-xs-12">
                <h3>Sydney Alcohol Delivery Drop Zone</h3>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <ul className={styles.suburbs}>
                  {suburbsSorted.map(suburb => <li>{suburb.name} {suburb.postcode}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(styles.section, styles.spritz, 'container-fluid')}>
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h5>Sydney Alcohol Delivery Area</h5>
                <p className="mb-16">Check if you're in the Tipple Sydney delivery area!</p>
                <ShopButton className={styles.shopBtn} />
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default ssrComponent(Sydney);
