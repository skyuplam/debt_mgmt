import api from './api';
import config from './config';
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

models.sequelize.sync({ force: !isProduction }).then(() => {
  const { debtors, companies } = data;
  const {
    identityTypes,
    loanTypes,
    repaymentStatuses,
    loanStatuses,
    repaymentPlanStatuses,
    placementStatuses,
    contactNumberTypes,
    addressTypes,
    sources,
    relationships,
  } = typesAndStatus;

  models.sequelize.transaction(t2 =>
    // Status and Types
    Promise.all([
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
      contactNumberTypes.map(contactNumberType =>
        models.contactNumberType.create(contactNumberType, {
          transaction: t2
        })
      ),
      addressTypes.map(addressType =>
        models.addressType.create(addressType, {
          transaction: t2
        })
      ),
      sources.map(source =>
        models.source.create(source, {
          transaction: t2
        })
      ),
      relationships.map(relationship =>
        models.relationship.create(relationship, {
          transaction: t2
        })
      ),
    ])
  ).then(() =>
    // Test Data
    models.sequelize.transaction(t3 =>
      Promise.all(companies.map(company =>
        models.company.create(company,
          {
            transaction: t3
          }).then(company =>
            models.placement.create({
              placementCode: `${company.code}-201603`,
              servicingFeeRate: 0.3,
              placedAt: new Date(2016, 3, 11),
              expectedRecalledAt: new Date(2016, 6, 10)
            }, {
              transaction: t3
            }).then(placement =>
              placement.setCompany(company, {
                transaction: t3
              })
            )
          )
      ))
    )
  ).then(() =>
    // Load Test Data
    models.sequelize.transaction(t1 =>
      models.identityType.findById(1, {
        transaction: t1
      }).then(identityType =>
        Promise.all(
          debtors.map(debtor =>
            models.identity.create({
              idNumber: debtor['身份证号']
            }, {
              transaction: t1
            }).then(identity =>
              identity.setIdentityType(identityType, {
                transaction: t1
              }).then(identity =>
                models.person.create({
                  name: debtor['客户姓名'],
                  dob: new Date(1980, 7, Math.floor(Math.random() * (31)) + 1)
                }, {
                  transaction: t1
                }).then(person => {
                  person.addIdentity(identity, {
                    transaction: t1
                  });
                  return person;
                })
              )
            ).then(person =>
              models.loan.create({
                amount: parseFloat(debtor['原贷款本金']),
                terms: parseInt(debtor['贷款总期数'], 10),
                issuedAt: new Date(Date.parse(debtor['贷款日期'])),
                transferredAt: new Date(Date.parse(debtor['转让日期'])),
                delinquentAt: new Date(Date.parse(debtor['逾期日期'])),
                collectableMgmtFee: parseFloat(debtor['管理费应收']),
                collectableHandlingFee: parseFloat(debtor['手续费应收']),
                collectableLateFee: parseFloat(debtor['滞纳金应收']),
                collectablePenaltyFee: parseFloat(debtor['违约金应收']),
                collectablePrincipal: parseFloat(debtor['本金应收']),
                collectableInterest: parseFloat(debtor['利息应收']),
                repaidTerms: parseInt(debtor['已还期数'], 10),
                originatedAgreementNo: debtor['贷款合同号'],
                originatedLoanProcessingBranch: debtor['分行']
              }, {
                transaction: t1
              }).then(loan => {
                person.addLoan(loan, {
                  transaction: t1
                });
                return loan;
              }).then(loan =>
                models.placement.findById(loan.id % 2 ? 1 : 2, {
                  transaction: t1
                }).then(placement =>
                  models.loanPlacement.create({
                    refCode: `${placement.placementCode}-${loan.id}`,
                  }, {
                    transaction: t1
                  }).then(loanPlacement =>
                    loanPlacement.setLoan(loan, {
                      transaction: t1
                    }).then(loanPlacement =>
                      loanPlacement.setPlacement(placement, {
                        transaction: t1
                      })
                    )
                  )
                )
              ).then(() =>
                models.contactNumber.create({
                  contactNumber: `1387890765${person.id}`
                }, {
                  transaction: t1
                }).then(contactNumber =>
                  models.contactNumberType.findOne({
                    where: {
                      type: 'Mobile'
                    }
                  }, {
                    transaction: t1
                  }).then(contactNumberType =>
                    contactNumber.setContactNumberType(contactNumberType, {
                      transaction: t1
                    })
                  )
                ).then(contactNumber =>
                  models.personContactNumber.create({
                  }, {
                    transaction: t1
                  }).then(personContactNumber =>
                    personContactNumber.setContactNumber(contactNumber, {
                      transaction: t1
                    }).then(personContactNumber =>
                      personContactNumber.setPerson(person, {
                        transaction: t1
                      }).then(personContactNumber =>
                        models.source.findOne({
                          where: {
                            source: 'Originator'
                          }
                        }).then(source =>
                          personContactNumber.setSource(source, {
                            transaction: t1
                          })
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  ).catch(error => console.log(error));

  const server = app.listen(port, () => {
    console.log('Server started at port %d', port);
  });

  return server;
});
