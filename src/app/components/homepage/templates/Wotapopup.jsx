import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { displayLoginPopup } from 'app/resources/action/Login';
import ShopButton from '../ShopButton';
import styles from './Wotapopup.module.scss';
import config from 'app/config';

const staticAssetsPath = process.env.PUBLIC_URL + '/static/assets/theme/wotapopup/';

function Wotapopup({ history }) {
  const user      = useSelector(store => store.auth.currentUser);
  const dispatch  = useDispatch();
  const login     = () => dispatch(displayLoginPopup());
  const backToTop = () => document.querySelector('#app header').scrollIntoView();

  return (
    <section className={styles.container}>
      <header>
        <div className='container'>
          <h1>Wot A Kebab Popup<br />Delivered in 30 mins</h1>
          <p>
          It’s never been easier - or quicker - to get that unforgetable taste.
          </p>
          <ShopButton label="Search" history={history}/>
          {!user && <p>
            <small>Already have an account? <a href='#login' onClick={login}>Log in here</a>.</small>
          </p>}
          <img alt='Wot A Kebab' src={`${staticAssetsPath}img/specialextras.jpeg?${config.cacheBust}`} />
        </div>
      </header>
      <main>
        <div className='container'>
          <h2>Why Wot A Kebab?</h2>
          <ul>
            <li>
             {/* <img alt='Delivered in 30 minutes' src={`${staticAssetsPath}img/fresh-delivered-fast.jpg?${config.cacheBust}`} /> */}
              <h3>Delivered in 30 minutes</h3>
              <p>
              Wot A Kebab delivered to your door in just 30 minutes.
              </p>
            </li>
            <li>
              {/* <img alt='Fresh, delicious meals' src={`${staticAssetsPath}img/fresh-healthy-meals.jpg?${config.cacheBust}`} /> */}
              <h3>Fresh, tasty meals</h3>
              <p>
              Classic, Spicy, lamb, chicken or falafel!
              </p>
            </li>
            <li>
              {/* <img alt='Snacks &amp; Drinks' src={`${staticAssetsPath}img/snacks-and-juices.jpg?${config.cacheBust}`} /> */}
              <h3>Snacks &amp; Drinks</h3>
              <p>
              From snacks to fresh drinks, we've got every eating and drinking occasion sorted.
              </p>
            </li>
          </ul>
        </div>
      </main>
      <footer>
        <div className='container'>
          <h2>Delicious Meals Delivered</h2>
          <p>Enter your address to shop the Popup Menu</p>
          <ShopButton label="View the Popup Menu" history={history}/>
        </div>
      </footer>
    </section>
  );
}

export default Wotapopup;