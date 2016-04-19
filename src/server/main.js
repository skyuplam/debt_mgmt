import api from './api';
import config from './config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import helmet from 'helmet';
import frontend from './frontend';
import models from './models';
import passport from './auth/passport';
import bootstrap from './data/bootstrap';
import logger from './lib/logger';


const app = express();
const { port, isProduction } = config;
// passport setup
app.use(passport.initialize());
// passport piggy backs of express sessions, still need to set express session options
app.use(passport.session());

// express-bunyan-logger
app.use(logger.expressLogger);

// helmet
app.use(helmet());

const directives = isProduction ?
{
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'unsafe-eval'", 'https://cdn.polyfill.io'],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:'],
  sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
  reportUri: '/report-violation',
  connectSrc: ["'self'"],
  mediaSrc: ["'self'"],
  objectSrc: ["'self'", 'allow-same-origin'], // An empty array allows nothing through
}
:
{
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.polyfill.io', '192.168.1.210:8080', 'localhost'],
  styleSrc: ["'self'", "'unsafe-inline'", 'localhost'],
  imgSrc: ["'self'", 'data:'],
  sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
  reportUri: '/report-violation',
  connectSrc: ["'self'", '192.168.1.210:8080'],
  mediaSrc: ["'self'"],
  objectSrc: ["'self'", 'allow-same-origin'], // An empty array allows nothing through
};

app.use(helmet.csp({
  // Specify directives as normal.
  directives: {
    ...directives
  },

  // Set to true if you only want browsers to report errors, not block them
  reportOnly: false,

  // Set to true if you want to blindly set all headers: Content-Security-Policy,
  // X-WebKit-CSP, and X-Content-Security-Policy.
  setAllHeaders: true,

  // Set to true if you want to disable CSP on Android where it can be buggy.
  disableAndroid: false,

  // Set to false if you want to completely disable any user-agent sniffing.
  // This may make the headers less compatible but it will be much faster.
  // This defaults to `true`.
  browserSniff: true
}));

app.use('/api/v1', api);
app.use(frontend);
app.use(errorHandler);

const force = { force: !isProduction };

models.sequelize.sync(force).then(() => {
  bootstrap();
  const server = app.listen(port, () => {
    logger.info('Server started at port %d', port);
  });

  return server;
});
