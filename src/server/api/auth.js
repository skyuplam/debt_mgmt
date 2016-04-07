import express from 'express';
import passport from 'passport';
import models from '../models';
import jwt from 'jsonwebtoken';
import config from '../config';

const router = express.Router();

const { isProduction } = config;

function getSecretKey() {
  return isProduction ? process.env.SECRET_KEY : config.secretKey;
}

function createToken(user, done) {
  return models.user.findOne({
    where: {
      username: user.username
    }
  }).then(theUser => {
    const key = getSecretKey();
    if (theUser) {
      const token = jwt.sign(theUser.toJSON(), key, {
        expiresIn: '1h',
      });
      return done(null, token);
    }
    return done(null, false);
  });
}

router.route('/login')
  .post((req, res) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return res.status(400).send({ err }).end();
      }
      if (!user) {
        return res.status(401).end();
      }
      createToken(user, (err, token) => {
        if (err) {
          return res.status(400).send({ token }).end();
        }
        const theUser = user.toJSON();
        theUser.token = token;
        delete theUser.password;
        return res.status(201).send({ user: theUser }).end();
      });
    }, {
      session: false,
    })(req, res);
  });

export default router;
