import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import models from '../../models';

// the cost of processing the data. (default - 10)
const saltRounds = 10;

const signUp = new Strategy((username, password, done) => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (!err && hash) {
      models.user.create({
        username,
        password: hash
      }).then(user => {
        if (user) {
          return done(null, user);
        }
        return done(new Error('Could not sign up user'), false);
      }).catch(err => {
        done(err);
      });
    }
  });
});

export default signUp;
