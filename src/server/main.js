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
  models.idType.create(
    {
      idType: 'ID Card',
    }
  ).then(idType =>
    models.identity.create({
      idNumber: '12345678',
    }).then(identity => {
      identity.setIdType(idType);
      return identity;
    })
  ).then(identity =>
    models.person.create({
      name: '陈大文',
      maritalStatus: '已婚',
      dob: new Date(1985, 7, 1)
    }).then(person => {
      person.addIdentities(identity);
      return person;
    })
  ).catch(error => console.log(error));

  var server = app.listen(port, () => {
    console.log('Server started at port %d', port);
  });

  return server;
});
