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

const { port, isProduction } = config;

models.sequelize.sync({force: !!!isProduction}).then(() => {
  // Dummy Data
  models.person.bulkCreate(
    [{
      name: 'Chan Siu Man 1',
      maritalStatus: 'married',
      dob: Date(1985, 1, 21)
    },
    {
      name: 'Chan Siu Man 2',
      maritalStatus: 'married',
      dob: Date(1985, 2, 21)
    },
    {
      name: 'Chan Siu Man 3',
      maritalStatus: 'married',
      dob: Date(1985, 2, 21)
    }
  ]);

  var server = app.listen(port, () => {
    console.log('Server started at port %d', port);
  });

  return server;
});
