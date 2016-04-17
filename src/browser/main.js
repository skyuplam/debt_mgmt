import 'babel-polyfill';
import Bluebird from 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from '../common/configureStore';
import createEngine from 'redux-storage-engine-localstorage';
import createRoutes from './createRoutes';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { addLocaleData } from 'react-intl';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import zh from 'react-intl/locale-data/zh';


// http://bluebirdjs.com/docs/why-bluebird.html
window.Promise = Bluebird;


// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// github.com/yahoo/react-intl/wiki/Upgrade-Guide#add-call-to-addlocaledata-in-browser
addLocaleData(zh);

const store = configureStore({
  createEngine,
  initialState: window.__INITIAL_STATE__,
  platformMiddleware: [routerMiddleware(browserHistory)]
});
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(store.getState);

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={history}
    >
      {routes}
    </Router>
  </Provider>
  , document.getElementById('app')
);
