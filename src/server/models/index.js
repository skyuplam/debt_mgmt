import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import config from '../config';
import logger from '../lib/logger';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config.db[env];
// Setup logging
dbConfig.logging = logger.debug.bind(logger);
const db = {};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

fs.readdirSync(__dirname).filter(file =>
  (file.indexOf('.') !== 0) && (file !== 'index.js')
).forEach(file => {
  const model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
  if ('hook' in db[modelName]) {
    db[modelName].hook(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
