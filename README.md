# Tipple Shop

TBC

## Automated UI Tests

There are automated tests set up with Testcafe to run through some 
scenarios for cart, ordering and delivery selection. These can be 
run with the following command from the `shop` folder:

`npm run tc:run`

This will run the full suite of tests in Chrome headless and output 
the results to the console as they run.

If you want to watch the tests run and keep an eye on anything that 
might be failing, you can run:

`npm run tc:run:chrome`

Which will run the tests in a full Chrome browser, allowing you to 
observe exactly what is happening and if a test might be failing 
due to an obvious reason.

### Delivery Tests

Delivery tests live in `tests/testcafe/cases/OrderDeliveryTiered.test.js` 
and are set up to run the same delivery tests for a given set of 
addresses. Currently we cover Sydney and Melbourne CBD addresses.

To add a new test, add a new element to the `testAddresses` array 
and the same suite of tests will be run with against address.

It's important to note that these tests are not only based around 
HTML structure of the site and need to be updated if the underlying 
code is updated, but also that they are based around the current 
tiered delivery configuration for the addresses being used for 
testing. If these tiered delivery settings change, the tests will 
fail. We should look at adding some identifiers to the code that 
allow us to test based on the presence of particular tiered delivery 
methods (and skip those tests if they are not there).

## Theming Guide

All static assets are located inside `public/static/assets/theme/[theme name]`.

On page load, the app will make a request to `site/config/[hostname]` to get the theme configuration. 

In the browser, the `hostname` will get its value from `window.location.hostname`. If requested from the server, `hostname`'s value will come from the request header instead. 

You can force the theme by adding the `theme: "[hostname]"` variable inside `config.js`. This is especially useful to spoof the theming during development.


### CSS Variables

Please refer to `public/static/assets/theme/default/variables.css` to find the list of css variables available.

*NOTE:* Anything that will be used in a SASS mixin cannot be rgb() or rgba(), it will break SASS. Use hex or if opacity is needed, ARGB hex OR hex + adding an opacity style rule.

### Dynamic Components

The homepage and footer components can dynamically switch based on the loaded theme configuration.

For the homepage, the routes for the templates can be found in `app/routes/Homepage.jsx`.

For the footer, the routes for the templates can be found in `app/components/footer/Footer.jsx`.

The templates are based on `homeComponent` and `footerComponent` values from the theme configuration.

### Example theme data

#### Theme Table

```json
[
  {
    "id": 1,
    "name": "default",
    "homeComponent": "default",
    "footerComponent": "default",
    "cssURL": "/static/assets/theme/default/variables.css",
    "faviconURL": "/static/assets/theme/default/favicon.ico",
    "headerLogoURL": "/static/assets/theme/default/img/logo.svg",
    "created": "2020-04-17 23:20:20",
    "modified": "2020-04-17 23:20:20"
  },
  {
    "id": 2,
    "name": "7Eleven",
    "homeComponent": "7Eleven",
    "footerComponent": "7Eleven",
    "cssURL": "/static/assets/theme/7eleven/variables.css",
    "faviconURL": "/static/assets/theme/7eleven/favicon.ico",
    "headerLogoURL": "/static/assets/theme/7eleven/img/logo.png",
    "created": "2020-04-17 23:20:20",
    "modified": "2020-04-17 23:20:20"
  }
]
```

#### Themedomain Table

```json
[
  {
    "id": 1,
    "domain": "tipple.com.au",
    "themeId": 1,
    "siteId": 1,
    "storeId": 1,
    "created": "2020-04-17 23:20:29",
    "modified": "2020-04-17 23:20:29"
  },
  {
    "id": 2,
    "domain": "7eleven.tipple.com.au",
    "themeId": 2,
    "siteId": 1,
    "storeId": 1,
    "created": "2020-04-21 06:29:31",
    "modified": "2020-04-21 06:29:31"
  }
]
```