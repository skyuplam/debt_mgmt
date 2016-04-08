import { Strategy } from 'passport-http-bearer';
import models from '../../models';
import { verifyAsync } from '../jwt';
import config from '../../config';


const { isProduction, secretKey } = config;

const strategy = new Strategy((token, done) => {
  const key = isProduction ? process.env.SECRET_KEY : secretKey;
  return verifyAsync(token, key).then(decoded => {
    if (decoded) {
      return models.user.findOne({
        where: {
          username: decoded.username
        }
      }).then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    }
    return done(null, false);
  });
});

export default strategy;
