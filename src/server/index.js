

// const Bluebird = require('bluebird');
// const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
// const config = require('./config').default;
// const polyfillLocales = require('./intl/polyfillLocales');
// const rootDir = require('path').resolve(__dirname, '..', '..');
// const webpackIsomorphicAssets = require('../../internal/webpack/assets').default;
import Bluebird from 'bluebird';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import config from './config';
import polyfillLocales from './intl/polyfillLocales';
const rootDir = require('path').resolve(__dirname, '..', '..');
import webpackIsomorphicAssets from '../../internal/webpack/assets';

if (!process.env.NODE_ENV) {
  throw new Error(
    'Environment variable NODE_ENV must be set to development or production.'
  );
}

polyfillLocales(global, config.locales);

// http://bluebirdjs.com/docs/why-bluebird.html
global.Promise = Bluebird;

global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsomorphicAssets)
  .server(rootDir, () => {
    require('./main');
  });
