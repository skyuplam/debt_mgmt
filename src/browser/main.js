/* eslint-disable import/default */
import 'babel-polyfill';
import Bluebird from 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from '../common/configureStore';
import createRoutes from './createRoutes';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

// http://bluebirdjs.com/docs/why-bluebird.html
window.Promise = Bluebird;

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const app = document.getElementById('app');
const initialState = window.__INITIAL_STATE__;
const store = configureStore({
  initialState,
  platformMiddleware: [routerMiddleware(browserHistory)]
});
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(store.getState);

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider>
      <Router history={history}>
        {routes}
      </Router>
    </IntlProvider>
  </Provider>,
  app
);
