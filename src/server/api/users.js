import express from 'express';
import passport from 'passport';
import models from '../models';
import { isAdmin } from '../auth/utils';
import bcrypt from '../auth/bcrypt';

const router = express.Router();


router.route('/')
  .get((req, res) => {
    passport.authenticate('bearer', { session: false }, (err, sender) => {
      if (err) {
        res.status(400).json({ error: err });
      }
      models.user.findAll({
        attributes: {
          exclude: ['password']
        },
        include: [models.role],
      }).then(users => {
        res.json({ users });
      });
    })(req, res);
  });


router.route('/')
  .post((req, res) => {
    passport.authenticate('bearer', { session: false }, (err, sender) => {
      if (err) {
        res.status(400).json({ error: err });
      }

      const { user } = req.body;
      if (isAdmin(sender)) {
        models.sequelize.transaction(t =>
          models.user.create({
            username: user.username,
            email: user.email,
            password: bcrypt.hashSync(user.password, 10)
          }, {
            transaction: t
          }).then(theUser =>
            models.role.find({
              where: {
                role: user.role
              }
            }, {
              transaction: t
            }).then(role =>
              theUser.addRole(role, {
                transaction: t
              })
            ).then(() => theUser)
          )
        );
      }
    })(req, res);
  });

export default router;
