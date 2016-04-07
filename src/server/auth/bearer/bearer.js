import { Strategy } from 'passport-http-bearer';
import models from '../../models';
import jwt from 'jsonwebtoken';
import config from '../../config';

const { isProduction, secretKey } = config;

const strategy = new Strategy((token, done) => {
  const key = isProduction ? process.env.SECRET_KEY : secretKey;
  jwt.verify(token, key, (err, decoded) => {
    models.user.findOne({
      where: {
        username: decoded.username
      }
    }).then(user => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    }).catch(err => done(err));
  });
});

export default strategy;
