import express from 'express';
import passport from 'passport';
import models from '../models';
import { isAdmin, isManager } from '../auth/utils';

const router = express.Router();

router.route('/')
  .get((req, res) => {
    passport.authenticate('bearer', { session: false }, (err, sender) => {
      if (err || !sender) {
        return res.status(400).json({ error: err });
      }
      return isAdmin(sender).then(isAdmin =>
        isManager(sender).then(isManager => {
          if (isAdmin || isManager) {
            const roles = ['user', 'manager'];
            if (isAdmin) {
              roles.push('admin');
            }
            return models.agency.findAll({
              include: [
                {
                  model: models.company,
                  include: [
                    {
                      model: models.companyType,
                      where: {
                        type: 'DCA'
                      }
                    }
                  ]
                }
              ]
            }).then(agencies => res.json({ agencies }));
          }
          return res.status(401).json({ error: 'Unauthorized' });
        })
      );
    })(req, res);
  });


router.route('/')
  .post((req, res) => {
    passport.authenticate('bearer', { session: false }, (err, sender) => {
      if (err || !sender) {
        return res.status(400).json({ error: err });
      }

      const { agency } = req.body;
      return models.sequelize.transaction(t =>
        isAdmin(sender, {
          transaction: t
        }).then(isAdmin =>
          isManager(sender, {
            transaction: t
          }).then(isManager => {
            if (isAdmin || isManager) {
              return models.agency.create({
                servicingFeeRate: agency.servicingFeeRate
              }, {
                transaction: t
              }).then(theAgency =>
                models.company.create({
                  name: agency.name,
                  code: agency.code,
                }, {
                  transaction: t
                }).then(company =>
                  models.companyType.find({
                    where: {
                      type: 'DCA'
                    },
                    transaction: t
                  }).then(companyType =>
                    company.setCompanyType(companyType, {
                      transaction: t
                    })
                  ).then(company =>
                    theAgency.setCompany(company, {
                      transaction: t
                    })
                  )
                ).then(() =>
                  models.agency.findById(theAgency.id, {
                    include: [{
                      model: models.company
                    }],
                    transaction: t
                  }).then(agency =>
                    res.status(201).json({ agency })
                  )
                )
              );
            }
            return res.status(401).json({ error: 'Unauthorized' });
          })
        )
      );
    })(req, res);
  });

router.route('/placements')
  .get((req, res) => {
    passport.authenticate('bearer', { session: false }, (err, sender) => {
      if (err || !sender) {
        return res.status(400).json({ error: err });
      }
      return isAdmin(sender).then(isAdmin =>
        isManager(sender).then(isManager => {
          if (isAdmin || isManager) {
            const roles = ['user', 'manager'];
            if (isAdmin) {
              roles.push('admin');
            }
            return models.placement.findAll({
              include: [
                {
                  model: models.company,
                }
              ]
            }).then(placements => res.json({ placements }));
          }
          return res.status(401).json({ error: 'Unauthorized' });
        })
      );
    })(req, res);
  });

router.route('/:agencyId/placements')
  .post((req, res) => {
    passport.authenticate('bearer', { session: false }, (err, sender) => {
      if (err || !sender) {
        return res.status(400).json({ error: err });
      }

      const { placement } = req.body;
      const agencyId = parseInt(req.params.agencyId, 10);
      return models.sequelize.transaction(t =>
        isAdmin(sender, {
          transaction: t
        }).then(isAdmin =>
          isManager(sender, {
            transaction: t
          }).then(isManager => {
            if (isAdmin || isManager) {
              return models.placement.create({
                placementCode: placement.placementCode,
                placedAt: new Date(placement.placedAt),
                expectedRecalledAt: new Date(placement.expectedRecalledAt),
                servicingFeeRate: parseFloat(placement.servicingFeeRate)
              }, {
                transaction: t,
              }).then(placement =>
                models.company.findById(agencyId, {
                  transaction: t,
                }).then(company =>
                  placement.setCompany(company, {
                    transaction: t,
                  }).then(placement => {
                    const p = placement.toJSON();
                    p.company = company.toJSON();
                    return res.status(201).json({ placement: p });
                  })
                )
              );
            }
            return res.status(401).json({ error: 'Unauthorized' });
          })
        )
      );
    })(req, res);
  });

export default router;
