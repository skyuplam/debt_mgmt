import api from './api';
import config from './config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import helmet from 'helmet';
import frontend from './frontend';
import models from './models';

const app = express();

// helmet
app.use(helmet());

app.use('/api/v1', api);
app.use(frontend);
app.use(errorHandler);

const {port} = config;

models.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log('Server started at port %d', port);
  });
});
