import express from 'express';
import passport from 'passport';
import { signAync } from '../auth/jwt';
import config from '../config';
import moment from 'moment';
import ipware from 'ipware';
import models from '../models';
import logger from '../lib/logger';

const router = express.Router();
const getIP = ipware().get_ip;
const { isProduction, tokenExpiredIn } = config;

function getSecretKey() {
  return isProduction ? process.env.SECRET_KEY : config.secretKey;
}

router.route('/login')
  .post((req, res) => {
    passport.authenticate('local', (err, user) => {
      if (err && Object.keys(err).length > 0) {
        return res.status(400).send({ err }).end();
      }
      if (!user) {
        return res.status(401).end();
      }
      return models.sequelize.transaction(t =>
        user.update({
          lastLoginAt: user.currentLoginAt,
          lastLoginIP: user.currentLoginIP,
          currentLoginAt: moment(),
          currentLoginIP: getIP(req).clientIp,
          loginCount: user.loginCount + 1,
        }, {
          transaction: t
        }).then(user =>
          signAync(user.toJSON(), getSecretKey(), {
            expiresIn: tokenExpiredIn
          }).then(token => {
            const userJson = user.toJSON();
            userJson.token = token;
            delete userJson.lastLoginIP;
            delete userJson.currentLoginIP;
            delete userJson.password;
            return res.status(201).json({ user: userJson });
          })
        )
      ).catch(err => {
        logger.error(err);
        return res.status(400).json({ err });
      });
    }, {
      session: false,
    })(req, res);
  });

export default router;
