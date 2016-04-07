import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import models from '../../models';

const strategy = new Strategy('local', (username, password, done) => {
  models.user.findOne({
    where: {
      username
    }
  }).then(user => {
    if (user) {
      const storedPwd = user.password;

      bcrypt.compare(password, storedPwd, (err, isVerified) => {
        if (!err && isVerified) {
          done(null, user);
        } else {
          done(null, false, {
            message: 'Incorrect password'
          });
        }
      });
    } else {
      done(null, false, {
        message: 'Incorrect username'
      });
    }
  });
});


export default strategy;
