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
            return models.portfolio.findAll({
              include: [
                {
                  model: models.company
                }
              ]
            }).then(portfolios => res.json({ portfolios }));
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

      const { portfolio } = req.body;
      return models.sequelize.transaction(t =>
        isAdmin(sender, {
          transaction: t
        }).then(isAdmin =>
          isManager(sender, {
            transaction: t
          }).then(isManager => {
            if (isAdmin || isManager) {
              return models.portfolio.create({
                referenceCode: portfolio.referenceCode,
                biddedAt: portfolio.biddedAt,
                cutoffAt: portfolio.cutoffAt,
              }, {
                transaction: t
              }).then(thePortfolio =>
                models.company.create({
                  name: portfolio.name,
                  code: portfolio.code,
                }, {
                  transaction: t
                }).then(company =>
                  models.companyType.find({
                    type: portfolio.companyType
                  }, {
                    transaction: t
                  }).then(companyType =>
                    company.setCompanyType(companyType, {
                      transaction: t
                    })
                  ).then(company =>
                    thePortfolio.setCompany(company, {
                      transaction: t
                    })
                  )
                ).then(() =>
                  models.portfolio.findById(thePortfolio.id, {
                    include: [{
                      model: models.company
                    }],
                    transaction: t
                  }).then(portfolio =>
                    res.status(201).json({ portfolio })
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

export default router;
