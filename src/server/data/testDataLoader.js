import models from '../models';
import data from '../data/testData.json';
import bcrypt from 'bcrypt';
import moment from 'moment';

export function loadTestData() {
  const { debtors, companies } = data;
  return models.sequelize.transaction(t3 =>
    Promise.all(companies.map(theCompany =>
      models.company.create(theCompany, {
        transaction: t3
      }).then(company =>
        models.companyType.find({
          where: {
            type: theCompany.companyType
          },
          transaction: t3
        }).then(companyType => {
          company.setCompanyType(companyType, {
            transaction: t3
          }).then(company => {
            if (theCompany.companyType === 'DCA') {
              models.agency.create({
                servicingFeeRate: 0.3,
              }, {
                transaction: t3
              }).then(agency =>
                agency.setCompany(company, {
                  transaction: t3
                })
              );
            } else {
              models.portfolio.create({
                referenceCode: 'SZYZ-Z-201512070001',
                biddedAt: moment('20151207', 'YYYYMMDD').toDate(),
                cutoffAt: moment('20151207', 'YYYYMMDD').toDate(),
              }, {
                transaction: t3
              }).then(portfolio =>
                portfolio.setCompany(company, {
                  transaction: t3
                })
              );
            }
          });
          return company;
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
      )
    ))
  ).then(() =>
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
                lateFeeRate: 0.001,
                apr: 0.276,
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
                models.portfolio.findById(1, {
                  transaction: t1
                }).then(portfolio =>
                  loan.setPortfolio(portfolio, {
                    transaction: t1
                  })
                )
              ).then(loan =>
                models.placement.findById(loan.id % 2 ? 1 : 2, {
                  transaction: t1
                }).then(placement =>
                  models.loanPlacement.create({
                    refCode: `${placement.placementCode}-${loan.id}`,
                    expectedRecalledAt: placement.expectedRecalledAt
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
  ).then(() =>
    models.sequelize.transaction(t =>
      bcrypt.hashAsync('passw0rd', 10).then(passwordHashed =>
        models.user.create({
          username: 'terrencelam',
          password: passwordHashed
        }, {
          transaction: t
        }).then(user =>
          models.role.find({
            where: {
              role: 'admin'
            }
          }, {
            transaction: t
          }).then(role =>
            user.addRole(role, {
              transaction: t
            })
          )
        )
      )
    )
  ).then(() =>
    models.sequelize.transaction(t =>
      bcrypt.hashAsync('123', 10).then(passwordHashed =>
        models.user.create({
          username: 'manager',
          password: passwordHashed
        }, {
          transaction: t
        }).then(user =>
          models.role.find({
            where: {
              role: 'manager'
            }
          }, {
            transaction: t
          }).then(role =>
            user.addRole(role, {
              transaction: t
            })
          )
        )
      )
    )
  ).then(() =>
    models.sequelize.transaction(t =>
      bcrypt.hashAsync('123', 10).then(passwordHashed =>
        models.user.create({
          username: 'user',
          password: passwordHashed
        }, {
          transaction: t
        }).then(user =>
          models.role.find({
            where: {
              role: 'user'
            }
          }, {
            transaction: t
          }).then(role =>
            user.addRole(role, {
              transaction: t
            })
          )
        )
      )
    )
  );
}
