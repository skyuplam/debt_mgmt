import auth from './auth';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import debtors from './debtors';
import users from './users';
import categories from './categories';
import upload from './upload';
import logger from '../lib/logger';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/debtors', debtors);
app.use('/users', users);
app.use('/categories', categories);
app.use('/upload', upload);

app.on('mount', () => {
  logger.info('Api is available at %s', app.mountpath);
});

export default app;
