import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { decodeSearchParams } from 'lib/searchParams';
import CategoryProductsLoader from 'app/components/CategoryProductsLoader';

import NotFound from './routes/NotFound';
import { useSelector } from 'react-redux';

// NOTE: Each Loadable route adds 2.5kb of runtime

const loadingError = (props) => {
  if (props.error) {
    throw new Error("CHUNK FAILED");
  }
  return null;
}

const Homepage = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ './routes/Homepage'),
  loading: loadingError,
  modules: ['Homepage'],
  webpack: () => [require.resolveWeak('./routes/Homepage')] // Prevents white flash
});

const Content = Loadable({
  loader: () => import(/* webpackChunkName: "content" */ './routes/Content'),
  loading: loadingError,
  modules: ['content'],
  webpack: () => [require.resolveWeak('./routes/Content')] // Prevents white flash
});

const ProductDetails = Loadable({
  loader: () => import(/* webpackChunkName: "product-details" */ './routes/ProductDetails'),
  loading: loadingError,
  modules: ['product-details'],
  webpack: () => [require.resolveWeak('./routes/ProductDetails')] // Prevents white flash
});

const BundleBuilder = Loadable({
  loader: () => import(/* webpackChunkName: "bundle-builder" */ './routes/BundleBuilder'),
  loading: loadingError,
  modules: ['bundle-builder'],
  webpack: () => [require.resolveWeak('./routes/BundleBuilder')] // Prevents white flash
});

const Products = Loadable({
  loader: () => import(/* webpackChunkName: "products" */ './routes/Products'),
  loading: loadingError,
  modules: ['products'],
  webpack: () => [require.resolveWeak('./routes/Products')] // Prevents white flash
});

const CategoryHome = Loadable({
  loader: () => import(/* webpackChunkName: "products" */ './routes/CategoryHome'),
  modules: ['category-home'],
  loading: loadingError,
  webpack: () => [require.resolveWeak('./routes/CategoryHome')] // Prevents white flash
});

const Categories = Loadable({
  loader: () => import(/* webpackChunkName: "categories" */ './routes/Categories'),
  loading: loadingError,
  modules: ['categories'],
  webpack: () => [require.resolveWeak('./routes/Categories')] // Prevents white flash
});

const CheckoutFlow = Loadable({
  loader: () => import(/* webpackChunkName: "checkout-flow" */ './routes/CheckoutFlow'),
  loading: loadingError,
  modules: ['checkoutFlow'],
  webpack: () => [require.resolveWeak('./routes/CheckoutFlow')] // Prevents white flash
});

const IdVerification = Loadable({
    loader: () => import(/* webpackChunkName: "checkout-flow" */ './routes/IdVerification'),
    loading: loadingError,
    modules: ['IdVerification'],
    webpack: () => [require.resolveWeak('./routes/IdVerification')] // Prevents white flash
});

const ContactUs = Loadable({
  loader: () => import(/* webpackChunkName: "contact-us" */ './routes/ContactUs'),
  loading: loadingError,
  modules: ['contact-us'],
  webpack: () => [require.resolveWeak('./routes/ContactUs')] // Prevents white flash
});

const OrderTracking = Loadable({
  loader: () => import(/* webpackChunkName: "order" */ './routes/OrderTracking'),
  loading: loadingError,
  modules: ['orderTracking'],
  webpack: () => [require.resolveWeak('./routes/OrderTracking')] // Prevents white flash
});

const OrderHistory = Loadable({
  loader: () => import(/* webpackChunkName: "order-history" */ './routes/OrderHistory'),
  loading: loadingError,
  modules: ['orderHistory'],
  webpack: () => [require.resolveWeak('./routes/OrderHistory')] // Prevents white flash
});

const OrderDetails = Loadable({
  loader: () => import(/* webpackChunkName: "order-details" */ './routes/OrderDetails'),
  loading: loadingError,
  modules: ['orderDetails'],
  webpack: () => [require.resolveWeak('./routes/OrderDetails')] // Prevents white flash
});

const ConfirmPassword = Loadable({
  loader: () => import(/* webpackChunkName: "confirm-password" */ './routes/ConfirmPassword'),
  loading: loadingError,
  modules: ['confirm-password'],
  webpack: () => [require.resolveWeak('./routes/ConfirmPassword')] // Prevents white flash
});

const BeerDelivery = Loadable({
  loader: () => import(/* webpackChunkName: "beer-delivery" */ './routes/BeerDelivery'),
  loading: loadingError,
  modules: ['BeerDelivery'],
  webpack: () => [require.resolveWeak('./routes/BeerDelivery')] // Prevents white flash
});

const LiquorDelivery = Loadable({
  loader: () => import(/* webpackChunkName: "liquor-delivery" */ './routes/LiquorDelivery'),
  loading: loadingError,
  modules: ['LiquorDelivery'],
  webpack: () => [require.resolveWeak('./routes/LiquorDelivery')] // Prevents white flash
});

const WineDelivery = Loadable({
  loader: () => import(/* webpackChunkName: "wine-delivery" */ './routes/WineDelivery'),
  loading: loadingError,
  modules: ['WineDelivery'],
  webpack: () => [require.resolveWeak('./routes/WineDelivery')] // Prevents white flash
});

const Melbourne = Loadable({
  loader: () => import(/* webpackChunkName: "melbourne" */ './routes/Melbourne'),
  loading: loadingError,
  modules: ['Melbourne'],
  webpack: () => [require.resolveWeak('./routes/Melbourne')] // Prevents white flash
});

const Sydney = Loadable({
  loader: () => import(/* webpackChunkName: "sydney" */ './routes/Sydney'),
  loading: loadingError,
  modules: ['Sydney'],
  webpack: () => [require.resolveWeak('./routes/Sydney')] // Prevents white flash
});

const User = Loadable({
  loader: () => import(/* webpackChunkName: "user" */ './routes/User'),
  loading: loadingError,
  modules: ['User'],
  webpack: () => [require.resolveWeak('./routes/User')] // Prevents white flash
});

export default () => {
  const theme = useSelector(store => store.theme);
  const storePath = theme?.storePath ?? '/bottleshop';

  // Render the <Products /> component with the parts of the location and pathname required. Changes to 
  // global search mean that these change more often, so splitting them out prevents unnecessary renders.
  const renderProducts = routeProps => (<Products 
    history={routeProps.history}
    locationPathname={routeProps.history?.location?.pathname}
    locationState={routeProps.history?.location?.state}
    matchCategory={routeProps.match?.params?.category}
  />);

  return (
    <Switch>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/beer-delivery" component={BeerDelivery} />
      <Route exact path="/liquor-delivery" component={LiquorDelivery} />
      <Route exact path="/wine-delivery" component={WineDelivery} />
      <Route exact path="/melbourne" component={Melbourne} />
      <Route exact path="/sydney" component={Sydney} />
      <Route exact path="/checkout" component={CheckoutFlow} />
      <Route exact path="/delivery" component={CheckoutFlow} />
      <Route exact path="/verify" component={IdVerification} />
      <Route exact path="/cart" component={CheckoutFlow} />
      <Route exact path="/contact-us" component={ContactUs} />
      <Route exact path="/user" component={User} />

      <Route exact path="/content/:content" component={Content} />
      <Route exact path="/product/:slug" component={ProductDetails} />

      <Route exact path={`${storePath}/:state/:city`} component={Categories} />
      <Route exact path={`${storePath}/:state/:city/categories`} render={(routeProps) => {
        let sp = decodeSearchParams(routeProps.location.search);
        let collectionId = parseInt(sp?.collection, 10);
        let title = sp?.title ?? '';

        if (collectionId > 0) {
          return <Products 
            history={routeProps.history}
            locationPathname={routeProps.history?.location?.pathname}
            locationState={routeProps.history?.location?.state}
            matchCategory={routeProps.match?.params?.category}
            collectionId={collectionId} 
            collectionTitle={title} 
          />
        } else {
          return <Categories {...routeProps} />;
        }
      }} />
      <Route exact path={`${storePath}/:state/:city/:category`} render={(routeProps) => {
        let sp = decodeSearchParams(routeProps.location.search);
        let collectionId = parseInt(sp?.collection, 10);
        let title = sp?.title ?? '';

        return (
          <CategoryProductsLoader 
            history={routeProps.history}
            locationPathname={routeProps.history?.location?.pathname}
            locationState={routeProps.history?.location?.state}
            matchCategory={routeProps.match?.params?.category}
            collectionId={collectionId ? collectionId : null}
            collectionTitle={title}
            collectionComponent={Products}
            categoryComponent={CategoryHome}
          />
        );
      }} />
      <Route exact path={`${storePath}/:state/:city/:category/all`} render={renderProducts} />
      <Route exact path={`${storePath}/:state/:city/:categoryParent/:category`} render={renderProducts} />
      <Route exact path={`${storePath}/:state/:city/collection/:slug/bundle`} component={BundleBuilder} />
      
      <Route exact path="/order/:orderId/tracking" component={OrderTracking} />
      <Route exact path="/track/:orderId" component={OrderTracking} />
      <Route exact path="/order/history" component={OrderHistory} />
      <Route exact path="/order/details/:orderNumber" component={OrderDetails} />
      <Route exact path="/forgot-password/:email/:code" component={ConfirmPassword} />
      <Route exact path="/forgot_password/:email/:code" component={ConfirmPassword} />
      
      <Route exact path="/:state/:city" render={renderProducts} />
      <Route exact path="/:state/:city/categories" component={Categories} />
      <Route exact path="/:state/:city/:category" render={renderProducts} />

      <Route exact path="/notfound" component={NotFound} />
      <Redirect to="/notfound" />
    </Switch>
  )
};
