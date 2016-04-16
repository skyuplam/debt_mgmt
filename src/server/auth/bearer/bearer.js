import { Strategy } from 'passport-http-bearer';
import models from '../../models';
import { verifyAsync } from '../jwt';
import config from '../../config';
import logger from '../../lib/logger';


const { isProduction, secretKey } = config;

const strategy = new Strategy((token, done) => {
  const key = isProduction ? process.env.SECRET_KEY : secretKey;
  return verifyAsync(token, key).then(decoded => {
    if (decoded) {
      return models.user.findOne({
        where: {
          username: decoded.username
        },
        attributes: {
          exclude: ['password']
        },
        include: [models.role]
      }).then(user => {
        if (user) {
          done(null, user);
          return null;
        }
        return done(null, false);
      });
    }
    return done(null, false);
  }).catch(err => {
    logger.error(err);
    done(err);
  });
});

export default strategy;
