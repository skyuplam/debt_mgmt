import express from 'express';
import passport from 'passport';
import { signAync } from '../auth/jwt';
import config from '../config';

const router = express.Router();

const { isProduction } = config;

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
      return signAync(user, getSecretKey(), {
        expiresIn: '1h'
      }).then(token => {
        user.token = token;
        delete user.password;
        res.status(201).json({ user });
      });
    }, {
      session: false,
    })(req, res);
  });

export default router;
