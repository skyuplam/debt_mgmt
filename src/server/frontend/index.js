import compression from 'compression';
import express from 'express';
import render from './render';
import logger from '../lib/logger';

const app = express();

app.use(compression());

// Note we don't need serve-favicon middleware, it doesn't work with static
// prerendered sites anyway.

// All assets must be handled via require syntax like this:
// <img alt="50x50 placeholder" src={require('./50x50.png')} />
app.use('/assets', express.static('build', { maxAge: '200d' }));

app.get('*', render);

app.on('mount', () => {
  logger.info('App is available at %s', app.mountpath);
});

export default app;
