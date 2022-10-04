import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { displayLoginPopup } from 'app/resources/action/Login';
import ShopButton from '../ShopButton';
import styles from './YouFoodz.module.scss';
import config from 'app/config';

const staticAssetsPath = process.env.PUBLIC_URL + '/static/assets/theme/youfoodz/';

function YouFoodz({ history }) {
  const user      = useSelector(store => store.auth.currentUser);
  const dispatch  = useDispatch();
  const login     = () => dispatch(displayLoginPopup());
  const backToTop = () => document.querySelector('#app header').scrollIntoView();

  return (
    <section className={styles.container}>
      <header>
        <div className='container'>
          <h1>Youfoodz Express<br />Delivered in 30 mins</h1>
          <p>
          It’s never been easier - or quicker - to get Australia's favourite ready-made meals, snacks, and drinks delivered to your door! Hungry? Just order Youfoodz.
          </p>
          <ShopButton label="Search" history={history}/>
          {!user && <p>
            <small>Already have an account? <a href='#login' onClick={login}>Log in here</a>.</small>
          </p>}
          <img alt='Youfoodz' src={`${staticAssetsPath}img/youfoodz_bloom.png?${config.cacheBust}`} />
        </div>
      </header>
      <main>
        <div className='container'>
          <h2>Why Youfoodz?</h2>
          <ul>
            <li>
              <img alt='Delivered in 30 minutes' src={`${staticAssetsPath}img/fresh-delivered-fast.jpg?${config.cacheBust}`} />
              <h3>Delivered in 30 minutes</h3>
              <p>
              Thanks to Tipple, you can have healthy Youfoodz delivered to your door in just 30 minutes.
              </p>
            </li>
            <li>
              <img alt='Fresh, healthy meals' src={`${staticAssetsPath}img/fresh-healthy-meals.jpg?${config.cacheBust}`} />
              <h3>Fresh, healthy meals</h3>
              <p>
              Choose from a delicious and healthy selection of fresh ready-made meals - heat and eat in 2 minutes!
              </p>
            </li>
            <li>
              <img alt='Snacks &amp; Drinks' src={`${staticAssetsPath}img/snacks-and-juices.jpg?${config.cacheBust}`} />
              <h3>Snacks &amp; Drinks</h3>
              <p>
              From protein-packed snacks to fresh drink blends, we've got every eating and drinking occasion sorted.
              </p>
            </li>
          </ul>
        </div>
      </main>
      <footer>
        <div className='container'>
          <h2>Healthy Meals Delivered</h2>
          <p>Enter your address to shop the Express Menu</p>
          <ShopButton label="View the Express Menu" history={history}/>
        </div>
      </footer>
    </section>
  );
}

export default YouFoodz;