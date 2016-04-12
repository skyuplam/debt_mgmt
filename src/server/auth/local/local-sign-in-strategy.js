import { Strategy } from 'passport-local';
import bcrypt from '../bcrypt';
import models from '../../models';

const strategy = new Strategy('local', (username, password, done) =>
  models.user.findOne({
    where: {
      username
    },
    include: [models.role]
  }).then(user => {
    if (!user) {
      return done(null, false);
    }
    if (!user.active) {
      return done(null, false);
    }
    const storedPwd = user.password;
    return bcrypt.compareAsync(password, storedPwd)
    .then(verified => {
      if (verified) {
        return done(null, user.toJSON());
      }
      return done(null, false);
    });
  })
);


export default strategy;
