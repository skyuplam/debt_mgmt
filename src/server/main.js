import api from './api';
import config from '../common/config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import helmet from 'helmet';
import frontend from './frontend';
import models from './models';
import data from './data/testData.json';
import typesAndStatus from './data/data.json';

const app = express();

// helmet
app.use(helmet());

app.use('/api/v1', api);
app.use(frontend);
app.use(errorHandler);

const { port, isProduction } = config;

models.sequelize.sync({force: !isProduction}).then(() => {

  const { debtors, companies } = data;
  const {
    identityTypes,
    loanTypes,
    repaymentStatuses,
    loanStatuses,
    repaymentPlanStatuses,
    placementStatuses,
  } = typesAndStatus;

  models.sequelize.transaction(t2 => {
    return Promise.all([
      identityTypes.map(idType => models.identityType.create(idType, {
        transaction: t2
      })),
      loanTypes.map(loanType => models.loanType.create(loanType, {
        transaction: t2
      })),
      repaymentStatuses.map(status => models.repaymentStatus.create(status, {
        transaction: t2
      })),
      loanStatuses.map(loanStatus =>
        models.loanStatus.create(loanStatus, {
          transaction: t2
        })
      ),
      repaymentPlanStatuses.map(repaymentPlanStatus =>
        models.repaymentPlanStatus.create(repaymentPlanStatus, {
          transaction: t2
        })
      ),
      placementStatuses.map(placementStatus =>
        models.placementStatus.create(placementStatus, {
          transaction: t2
        })
      ),
    ]);
  }).catch(error => console.log(error));

  models.sequelize.transaction(t3 => {
    return Promise.all(companies.map(company =>
      models.company.create(company,
        {
          transaction: t3
        }).then(company => {
          return models.placement.create({
            placementCode: `${company.code}-201603`,
            servicingFeeRate: 0.3,
            managementFeeRate: 0.2,
            placedAt: new Date(2016, 3, 11),
            expectedRecalledAt: new Date(2016, 6, 10)
          }, {
            transaction: t3
          }).then(placement =>
            placement.setCompany(company, {
              transaction: t3
            })
          );
        })
    ));
  }).catch(error => console.log(error));

  models.sequelize.transaction(t1 =>
    models.identityType.findById(1)
  ).then(identityType =>
    models.sequelize.transaction(t2 =>
      Promise.all(
        debtors.map(debtor => {
          return models.identity.create({
            idNumber: debtor['身份证号']
          }, {
            transaction: t2
          }).then(identity => {
            identity.setIdentityType(identityType, {
              transaction: t2
            });
            return models.person.create({
              name: debtor['客户姓名'],
              dob: new Date(1980, 7, Math.floor(Math.random() * (31)) + 1)
            }, {
              transaction: t2
            }).then(person => {
              person.addIdentity(identity, {
                transaction: t2
              });
              return person;
            });
          }).then(person =>
            models.loan.create({
              amount: parseFloat(debtor['原贷款本金']),
              terms: parseInt(debtor['贷款总期数']),
              issuedAt: new Date(debtor['贷款日期']),
              transferredAt: new Date(debtor['转让日期']),
              collectableMgmtFee: parseFloat(debtor['管理费应收']),
              collectableHandlingFee: parseFloat(debtor['手续费应收']),
              collectableLateFee: parseFloat(debtor['滞纳金应收']),
              collectablePenaltyFee: parseFloat(debtor['违约金应收']),
              collectablePrincipal: parseFloat(debtor['本金应收']),
              collectableInterest: parseFloat(debtor['利息应收']),
              repaidTerms: parseInt(debtor['已还期数']),
              originatedAgreementNo: debtor['贷款合同号'],
              originatedLoanProcessingBranch: debtor['分行']
            }, {
              transaction: t2
            }).then(loan => {
              person.addLoan(loan, {
                transaction: t2
              });
              return loan;
            }).then(loan => {
              return models.placement.findById(loan.id%2?1:2, {
                transaction: t2
              }).then(placement => {
                return models.placementStatus.find({
                  where: {
                    status: 'Placed'
                  }
                }, {
                  transaction: t2
                }).then(placementStatus =>
                  models.loanPlacement.create({
                    refCode: `${placement.placementCode}-${loan.id}`,
                  }, {
                    transaction: t2
                  }).then(loanPlacement =>
                    loanPlacement.setLoan(loan, {
                      transaction: t2
                    }).then(loanPlacement =>
                      loanPlacement.setPlacement(placement, {
                        transaction: t2
                    }))
                  )
                )
              });
            })
          );
        })
      )
    )
  ).catch(error =>
      console.log(error)
  );



  var server = app.listen(port, () => {
    console.log('Server started at port %d', port);
  });

  return server;
});
