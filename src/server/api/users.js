import express from 'express';
import passport from 'passport';
import models from '../models';
import { isAdmin, isManager } from '../auth/utils';
import bcrypt from '../auth/bcrypt';

const router = express.Router();


router.route('/')
  .get((req, res) => {
    passport.authenticate('bearer', { session: false }, (err, sender) => {
      if (err || !sender) {
        res.status(400).json({ error: err });
      }
      isAdmin(sender).then(isAdmin =>
        isManager(sender).then(isManager => {
          if (isAdmin || isManager) {
            const roles = ['user', 'manager'];
            if (isAdmin) {
              roles.push('admin');
            }
            models.user.findAll({
              attributes: {
                exclude: ['password']
              },
              include: [{
                model: models.role,
                where: {
                  role: {
                    $in: roles
                  }
                }
              }],
            }).then(users => {
              res.json({ users });
            });
          } else {
            res.status(401).json({ error: 'Unauthorized' });
          }
        })
      );
    })(req, res);
  });


router.route('/')
  .post((req, res) => {
    passport.authenticate('bearer', { session: false }, (err, sender) => {
      if (err || !sender) {
        res.status(400).json({ error: err });
      }

      const { user } = req.body;
      models.sequelize.transaction(t =>
        isAdmin(sender, {
          transaction: t
        }).then(isAdmin =>
          isManager(sender, {
            transaction: t
          }).then(isManager => {
            if (isAdmin || isManager) {
              if (user.role === 'admin' && isManager) {
                return res.status(401).json({ error: 'Unauthorized' });
              }

              return models.user.create({
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
                ).then(() =>
                  models.user.findById(theUser.id, {
                    attributes: {
                      exclude: ['password']
                    },
                    include: [models.role],
                    transaction: t
                  }).then(newUser =>
                    res.status(201).json({ user: newUser })
                  )
                )
              );
            }
            return res.status(401).json({ error: 'Unauthorized' });
          })
        )
      ).catch(error => res.status(400).json({ error }));
    })(req, res);
  });

router.route('/:userId')
  .put((req, res) => {
    passport.authenticate('bearer', { session: false }, (err, sender) => {
      if (err || !sender) {
        res.status(400).json({ error: err });
      }
      const userId = parseInt(req.params.userId, 10);
      const { user } = req.body;
      models.sequelize.transaction(t =>
        isAdmin(sender, {
          transaction: t
        }).then(isAdmin =>
          isManager(sender, {
            transaction: t
          }).then(isManager =>
            models.user.findById(userId, {
              include: [models.role],
              transaction: t
            }).then(theTargetUser => {
              // Modify Self data
              const isSelf = theTargetUser.username === sender.username;
              if (isSelf && user.oldPassword) {
                return bcrypt.compareAsync(user.oldPassword, theTargetUser.password)
                .then(verified => {
                  if (verified) {
                    theTargetUser.password = bcrypt.hashSync(user.password, 10);
                    return theTargetUser.save({
                      transaction: t
                    }).then(() => {
                      const userJSON = theTargetUser.toJSON();
                      delete userJSON.password;
                      return res.status(202).json({ user: userJSON });
                    });
                  }
                  return res.status(401).json({ error: 'Unauthorized' });
                });
              }
              // user Modified by admin or manager
              if (isAdmin || isManager || isSelf) {
                const roles = ['user', 'manager'];
                if (isAdmin) {
                  roles.push('admin');
                }
                return models.user.findById(userId, {
                  include: [{
                    model: models.role,
                    where: {
                      role: {
                        $in: roles
                      }
                    }
                  }],
                  transaction: t
                }).then(theUser => {
                  if (user.password) {
                    theUser.password = bcrypt.hashSync(user.password, 10);
                  }
                  if (typeof user.active !== 'undefined') {
                    theUser.active = user.active;
                  }
                  return theUser.save({
                    transaction: t
                  }).then(() => {
                    const userJSON = theUser.toJSON();
                    delete userJSON.password;
                    return res.status(202).json({ user: userJSON });
                  });
                }, rejected =>
                  res.status(400).json({ error: rejected })
                );
              }
              return res.status(401).json({ error: 'Unauthorized' });
            })
          )
        )
      ).catch(error => res.status(400).json({ error }));
    })(req, res);
  });

export default router;
