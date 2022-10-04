import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Page from 'app/components/Page';
import { ssrComponent } from 'lib/ssrHelper';
import cn from 'classnames';
import ShopButton from 'app/components/homepage/ShopButton';
import { melbourne as suburbs } from 'lib/constants/deliverySuburbs';
import styles from './Melbourne.module.scss';

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

class Melbourne extends Component {

  componentDidMount() {
      window.scrollTo(0, 0);
  }

  static async getInitialProps(props) { }

  render() {
    return (
      <Page id="Melbourne" title="Alcohol Delivery Melbourne | Tipple - Alcohol Delivered Fast" description="Alcohol Delivery in Melbourne" className={cn(styles['melbourne'], styles.pageLocation)}>
        <div className={cn(styles.header, styles.section, 'container-fluid')}>
          <div className="container container-wide">
            <div className={cn(styles.headerCopy)}>
              <h1>
                Alcohol Delivery in Melbourne
              </h1>
            </div>
          </div>
          <div className={cn(styles.headerImage)} />
        </div>

        <div className={cn(styles.section, styles.white, styles.subheader, 'container-fluid')}>
          <div className="container container-wide">
            <div className="row">
              <div className="col-xs-12 col-md-6">
                <h3 className={cn(styles.titleFirst)}>Melbourne’s Alcohol Delivery Favourite</h3>
                <p>
                  As Melbourne’s first and biggest alcohol delivery platform, our Melbourne delivery 
                  service has been the choice for locals in need of alcohol cold &amp; fast since our 
                  inception all the way back in 2015. With hundreds of alcohol products to choose from 
                  and fast delivery across Melbourne, it’s easy to see why we’re the choice for alcohol 
                  delivery in Melbourne.
                </p>
              </div>
              <div className="col-xs-12 col-md-6">
                <h3>The Tipple Difference</h3>
                <p>
                  By partnering with local Melbourne bottle shops and delivering direct, we’re able to 
                  deliver a larger range of alcohol across our Melbourne delivery zones. Our ‘bottle 
                  shop in your pocket’ concept brings a bigger range of products for delivery to your 
                  door while also supporting local independent Melbourne alcohol retailers fulfilling 
                  your order. So with every Tipple delivery, you’re also supporting independent Melbourne 
                  alcohol shops.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(styles.section, 'container-fluid')}>
          <div className="container container-wide">
            <div className="row">
              <div className="col-xs-12">
                <h2>Melbourne Delivery Details</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 clearfix">
                <div className="row">
                  <div className="col-md-12">
                    <h3>Melbourne Hours</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <p>Open 7 days a week for delivery between midday and 10pm.</p>
                    <p>Tipple is closed in Melbourne on Christmas Day and Good Friday.</p>
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
                    <p>Our delivery fee in Melbourne is $7.95 with a minimum order of $30.</p>
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
                    <p>Interested in becoming a Melbourne alcohol delivery partner? We’re always on the 
                      lookout for bottle shops in Melbourne to join! <Link to="/contact-us">Get in touch here</Link> to register your 
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
                <h3>Melbourne Alcohol Delivery Drop Zone</h3>
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
                <h5>Melbourne Alcohol Delivery Area</h5>
                <p className="mb-16">Check if you're in the Tipple Melbourne delivery area!</p>
                <ShopButton className={styles.shopBtn} />
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default ssrComponent(Melbourne);
