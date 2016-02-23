import nconf from 'nconf';

const isProduction = process.env.NODE_ENV === 'production';

// Specifying an env delimiter allows you to override below config when shipping
// to production server.
nconf.env('__');

// Remember, never put production secrets in config. Use nconf.
const config = {
  isProduction: isProduction,
  googleAnalyticsId: 'UA-XXXXXXX-X',
  port: process.env.PORT || 8000,
  webpackStylesExtensions: ['css', 'less', 'sass', 'scss', 'styl'],
  db: {
    "development": {
      "dialect": "sqlite",
      "storage": "./db.development.sqlite"
    },
    "test": {
      "username": "loan",
      "password": "passw0rd",
      "database": "loan",
      "host": "192.168.99.100",
      "dialect": "postgres"
    },
    "production": {
      "username": "loan",
      "password": null,
      "database": "loan",
      "host": "192.168.99.100",
      "dialect": "postgres"
    }
  }
};

// Use above config as a default one. Multiple other providers are available
// like loading config from json and more. Check out nconf docs.
nconf.defaults(config);

export default nconf.get();
