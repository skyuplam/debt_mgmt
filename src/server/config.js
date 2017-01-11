// Application configuration.

// http://www.codedependant.net/2015/01/31/production-ready-node-configuration
import nconf from 'nconf';

const appName = require('../../package.json').name;
const isProduction = process.env.NODE_ENV === 'production';
const DB_ADDR = isProduction ? process.env.DB_ADDR : 'localhost';
const DB_PWD = isProduction ? process.env.DB_PWD : 'passw0rd';
const ADMIN_PWD = isProduction ? process.env.APP_ADMIN_PWD : 'passw0rd';
const LOAD_BOOTSTRAP = isProduction ? process.env.BOOTSTRAP === 'boostrap' : true;
const RBMQ_ADDR = isProduction ? process.env.RBMQ_ADDR : 'localhost';
const RBMQ_USER = isProduction ? process.env.RBMQ_USER : 'user';
const RBMQ_PWD = isProduction ? process.env.RBMQ_PWD : 'passw0rd';

// Specifying an env delimiter allows us to override config when shipping to
// production server. 'foo__bar=2 gulp' will set config to '{foo: {bar: 2}}'
nconf.env('__');

// For local development with secrets. Check src/common/_secrets.json file.
nconf.file('src/common/secrets.json');

// Remember, never put secrets in default config.
// Use environment variables for production, and secrets.json for development.
nconf.defaults({
  appName,
  defaultLocale: 'zh',
  saltRounds: 10,
  googleAnalyticsId: 'UA-XXXXXXX-X',
  isProduction,
  adminPwd: ADMIN_PWD,
  tokenExpiredIn: '1h',
  loadBootstrap: LOAD_BOOTSTRAP,
  rbmqUri: RBMQ_ADDR,
  rbmqUser: RBMQ_USER,
  rbmqPwd: RBMQ_PWD,
  port: process.env.PORT || 8000,
  db: {
    development: {
      username: 'postgres',
      password: DB_PWD,
      database: 'loan',
      host: DB_ADDR,
      dialect: 'postgres'
    },
    test: {
      username: 'postgres',
      password: DB_PWD,
      database: 'loan',
      host: DB_ADDR,
      dialect: 'postgres'
    },
    production: {
      username: 'postgres',
      password: DB_PWD,
      database: 'loan',
      host: DB_ADDR,
      dialect: 'postgres'
    }
  },
  locales: ['zh'],
});

export default nconf.get();
