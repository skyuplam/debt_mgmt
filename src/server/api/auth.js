import express from 'express';
import passport from 'passport';
import { signAync } from '../auth/jwt';
import config from '../config';
import moment from 'moment';
import ipware from 'ipware';

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
      user.lastLoginAt = user.currentLoginAt;
      user.lastLoginIP = user.currentLoginIP;
      user.currentLoginAt = moment();
      user.currentLoginIP = getIP(req).clientIp;
      user.loginCount += 1;
      return user.save().then(currentUser => {
        const userJson = currentUser.toJSON();
        return signAync(userJson, getSecretKey(), {
          expiresIn: tokenExpiredIn
        }).then(token => {
          userJson.token = token;
          delete userJson.password;
          res.status(201).json({ user: userJson });
        });
      });
    }, {
      session: false,
    })(req, res);
  });

export default router;
