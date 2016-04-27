// Application configuration.

// http://www.codedependant.net/2015/01/31/production-ready-node-configuration
import nconf from 'nconf';

const appName = require('../../package.json').name;
const isProduction = process.env.NODE_ENV === 'production';
const DB_ADDR = process.env.DB_PORT_5432_TCP_ADDR;
const DB_PWD = process.env.DB_PWD;


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
  tokenExpiredIn: '1h',
  port: process.env.PORT || 8000,
  db: {
    development: {
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'loan',
      host: '192.168.99.100',
      dialect: 'postgres'
    },
    test: {
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'loan',
      host: '192.168.99.100',
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
