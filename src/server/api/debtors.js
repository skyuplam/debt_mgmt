import express from 'express';
import models from '../models';
import moment from 'moment';


const router = express.Router();

function getDebtors(criteria) {
  let condition = '';
  if (criteria) {
    const matchIdCard = criteria.idCard ? `i.idNumber = '${criteria.idCard}'` : '';
    const matchName = criteria.name ? `p.name = '${criteria.name}'` : '';
    const matchOriAgmentNo = criteria.originatedAgreementNo ?
     `l.originatedAgreementNo = '${criteria.originatedAgreementNo}'` :
     '';
    const criteriaStr = [matchIdCard, matchName, matchOriAgmentNo].filter(a => a).join(' OR ');
    condition = criteriaStr ? `WHERE ${criteriaStr}` : '';
  }

  return models.sequelize.query(`
    SELECT
      p.id,
      p.name,
      p.maritalStatus,
      p.dob,
      i.idNumber,
      l.originatedAgreementNo
    from person p
    LEFT JOIN personIdentity pi ON p.id = pi.personId
    LEFT JOIN identity i ON i.id = pi.identityId
      AND i.identityTypeId = 1
    LEFT JOIN debtorLoan dl ON dl.debtorId = p.id
      AND dl.isPrimary = 1
    LEFT JOIN loan l ON l.id = dl.loanId
    ${condition}
    `,
    { type: models.sequelize.QueryTypes.SELECT });
}

function getDebtor(debtorId) {
  return models.sequelize.query(`
    SELECT
      p.id,
      p.name,
      p.maritalStatus,
      p.dob,
      i.idNumber,
      l.originatedAgreementNo
    from person p
    LEFT JOIN personIdentity pi ON p.id = pi.personId
    LEFT JOIN identity i ON i.id = pi.identityId
      AND i.identityTypeId = 1
    LEFT JOIN debtorLoan dl ON dl.debtorId = p.id
      AND dl.isPrimary = 1
    LEFT JOIN loan l ON l.id = dl.loanId
    WHERE p.id = ${debtorId}
    `,
    { type: models.sequelize.QueryTypes.SELECT });
}

router.route('/')
  .get((req, res) => {
    // Simulate async access.
    // In real app we would check user credentials and load user data from DB.
    // setTimeout(() => {
    //   res.status(200).send({ debtors }).end();
    // }, 50);
    getDebtors().then(people => {
      // console.log(`Debtors Count:${people.length}`);
      const debtors = people;
      return res.status(200).send({ debtors }).end();
    });
  });

router.route('/')
  .post((req, res) => {
    const { idCard, originatedAgreementNo, name } = req.body;

    getDebtors({ idCard, originatedAgreementNo, name }).then(people => {
      const debtors = people;
      return res.status(200).send({ debtors }).end();
    });
  });

router.route('/:debtorId')
  .get((req, res) => {
    const debtorId = req.params.debtorId;
    getDebtor(debtorId).then(debtors =>
      res.status(200).send({ debtors }).end()
    );
  });

router.route('/:debtorId/loans')
  .get((req, res) => {
    const debtorId = req.params.debtorId;
    models.sequelize.query(`
      SELECT
        l.*,
        lp.placementStatusId,
        p.placementCode,
        p.servicingFeeRate placementServicingFeeRate,
        p.placedAt,
        p.expectedRecalledAt,
        p.recalledAt,
        c.name agency
      FROM debtorLoan dl
      LEFT JOIN loan l ON l.id = dl.loanId
      LEFT JOIN loanPlacement lp ON lp.loanId = l.id AND lp.placementStatusId = 1
      LEFT JOIN placement p ON p.id = lp.placementId
      LEFT JOIN company c ON c.id = p.companyId
      WHERE dl.debtorId = ${debtorId}
      `, { type: models.sequelize.QueryTypes.SELECT }
    ).then(loans => res.status(200).send({ loans }).end());
  });

router.route('/:debtorId/repaymentPlans')
  .get((req, res) => {
    const debtorId = req.params.debtorId;
    models.sequelize.query(`
      SELECT
        rp.*,
        d.id debtorId
      FROM repaymentPlan rp
      LEFT JOIN loan l ON l.id = rp.loanId
      LEFT JOIN debtorLoan dl ON dl.loanId = l.id
      LEFT JOIN person d ON d.id = dl.debtorId
      WHERE d.id = ${debtorId}
    `, { type: models.sequelize.QueryTypes.SELECT }
  ).then(repaymentPlans => {
    repaymentPlans.map(rp => {
      rp.debtorId = parseInt(debtorId, 10);
      return rp;
    });
    return res.status(200).send({ repaymentPlans }).end();
  });
  });

router.route('/:debtorId/repaymentPlans')
  .post((req, res) => {
    const debtorId = req.params.debtorId;
    const {
      loanId,
      repayAmount,
      terms,
      startedAt,
      repayments
    } = req.body;

    return models.sequelize.transaction(t =>
      models.repaymentPlan.findAll({
        where: {
          loanId
        },
        transaction: t
      }).then(repaymentPlans => Promise.all(
        repaymentPlans.map(repaymentPlan => {
          if ([1, 2, 4].indexOf(repaymentPlan.repaymentPlanStatusId) !== -1) {
            return models.repaymentPlanStatus.find({
              where: {
                status: 'Canceled'
              },
              transaction: t
            }).then(rpmStatus => repaymentPlan.setRepaymentPlanStatus(rpmStatus, {
              transaction: t
            }));
          }
          return repaymentPlan;
        })
      )).then(() =>
        models.repaymentPlan.create({
          principal: repayAmount,
          terms,
          startedAt
        }, { transaction: t }).then(repaymentPlan =>
          models.loan.findById(loanId).then(loan =>
            // Link repaymentplan with loan
            models.loanStatus.find({
              where: {
                status: 'In Repayment'
              }
            }).then(loanStatus =>
              loan.setLoanStatus(loanStatus, { transaction: t })
            ).then(loan =>
              repaymentPlan.setLoan(loan, { transaction: t })
            )
          ).then(repaymentPlan =>
            Promise.all(
              repayments.map(repayment =>
                models.repayment.create(
                  repayment,
                  { transaction: t }
                ).then(newRpmt => {
                  // Link repayment with repaymentplan
                  repaymentPlan.addRepayment(newRpmt, {
                    transaction: t
                  });
                  return newRpmt;
                })
              )
            ).then(() =>
              // Created new repayments
              repaymentPlan
            )
          )
        )
      )
    ).then(repaymentPlan => {
      const rp = repaymentPlan.toJSON();
      rp.debtorId = parseInt(debtorId, 10);
      return res.status(201).send({ repaymentPlan }).end();
    });
  });

router.route('/:debtorId/repaymentPlans/:repaymentPlanId/repayments')
  .get((req, res) => {
    const { repaymentPlanId } = req.params;
    models.sequelize.query(`
      SELECT
       r.*,
       rp.terms,
       rps.status repaymentPlanStatus,
       rs.status repaymentStatus
      FROM repayment r
      LEFT JOIN repaymentStatus rs ON rs.id = r.repaymentStatusId
      LEFT JOIN repaymentPlan rp ON rp.id = r.repaymentPlanId
      LEFT JOIN repaymentPlanStatus rps ON rps.id = rp.repaymentPlanStatusId
      WHERE r.repaymentPlanId = ${repaymentPlanId}
    `, { type: models.sequelize.QueryTypes.SELECT }
  ).then(repayments =>
      res.status(200).send({ repayments }).end()
    );
  });

router.route('/:debtorId/repaymentPlans/:repaymentPlanId/repayments/:repaymentId/pay')
  .post((req, res) => {
    const { repaymentId, repaymentPlanId } = req.params;
    const { amount, repaidAt, paidInFull } = req.body;

    return models.repayment.findById(repaymentId).then(repayment =>
      models.sequelize.transaction(t => {
        // Repayment Status
        let rpStatus;
        if (moment(repaidAt).isBefore(repayment.expectedRepaidAt, 'day') ||
            moment(repaidAt).isSame(repayment.expectedRepaidAt, 'day')) {
          // On Time
          if (amount < repayment.principal) {
            rpStatus = 'Partial Paid';
          } else {
            rpStatus = 'Paid';
          }
        } else {
          // Late
          if (amount < repayment.principal) {
            rpStatus = 'Partial Paid after Overdue';
          } else {
            rpStatus = 'Paid after Overdue';
          }
        }
        return models.repaymentStatus.find({
          where: {
            status: rpStatus
          }
        }).then(status => {
          // Update Repayment
          repayment.setRepaymentStatus(status, { transaction: t });
          repayment.paidAmount = amount;
          repayment.repaidAt = new Date(repaidAt);
          return repayment.save({ transaction: t });
        }).then(repayment =>
          models.repaymentPlan.findById(repaymentPlanId).then(rpPlan => {
            let rpPlanStatus;
            // Repayment Plan Status
            const totalRepaymentAmount = rpPlan.repaidAmount + amount;
            const isCompleted = paidInFull || totalRepaymentAmount >= rpPlan.principal;
            if (isCompleted) {
              rpPlanStatus = 'Completed';
            } else {
              rpPlanStatus = 'Repaying';
            }
            return models.repaymentPlanStatus.find({
              where: {
                status: rpPlanStatus
              }
            }).then(repaymentPlanStatus => {
              rpPlan.setRepaymentPlanStatus(repaymentPlanStatus, { transaction: t });
              if (isCompleted) {
                rpPlan.endedAt = new Date(repaidAt);
              }
              rpPlan.repaidAmount += amount;
              return rpPlan.save({ transaction: t });
            }).then(rpPlan =>
              models.loan.findById(rpPlan.loanId).then(loan => {
                // Update loan
                const totalAmount = loan.collectablePrincipal +
                  loan.collectableInterest +
                  loan.collectableMgmtFee +
                  loan.collectableHandlingFee +
                  loan.collectableLateFee +
                  loan.collectablePenaltyFee;
                let loanStatus;
                // Repayment Plan Status Code 5: Completed
                const isCompleted = rpPlan.repaymentPlanStatusId === 5;
                if (isCompleted) {
                  if (rpPlan.repaidAmount >= totalAmount) {
                    loanStatus = 'Paid in Full';
                  } else {
                    loanStatus = 'Settlement in Full';
                  }
                } else {
                  if (amount < repayment.principal) {
                    loanStatus = 'Forbearance';
                  } else {
                    loanStatus = 'In Repayment';
                  }
                }
                return models.loanStatus.find({
                  where: {
                    status: loanStatus
                  }
                }).then(theLoanStatus => {
                  loan.setLoanStatus(theLoanStatus, { transaction: t });
                  if (isCompleted) {
                    loan.completedAt = new Date(repaidAt);
                  }
                  return loan.save({ transaction: t });
                }).then(() => repayment);
              })
            );
          })
        );
      })
    ).then(repayment =>
      res.status(201).send({ repayment }).end());
  });

router.route('/:debtorId/contactNumbers')
  .get((req, res) => {
    const debtorId = req.params.debtorId;
    models.sequelize.query(`
      SELECT
        cn.*,
        cnt.type contactNumberType,
        s.source,
        pcn.contactPerson,
        pcn.relationshipId,
        pcn.verifiedAt,
        pcn.verifiedBy,
        pcn.personId debtorId
      FROM contactNumber cn
      LEFT JOIN contactNumberType cnt ON cnt.id = cn.contactNumberTypeId
      LEFT JOIN personContactNumber pcn ON pcn.contactNumberId = cn.id
      LEFT JOIN source s ON s.id = pcn.sourceId
      WHERE pcn.personid = ${debtorId}
    `, { type: models.sequelize.QueryTypes.SELECT }
    ).then(contactNumbers =>
      res.status(200).send({ contactNumbers }).end()
    );
  });

router.route('/:debtorId/contactNumbers')
  .post((req, res) => {
    const debtorId = req.params.debtorId;
    const {
      contactNumber,
      contactNumberType,
      contactPerson,
      relationship,
      countryCode,
      areaCode,
      ext,
      source
    } = req.body;
    return models.sequelize.transaction(t =>
      models.person.findById(debtorId, {
        transaction: t
      }).then(debtor =>
        models.contactNumber.findOrCreate({
          where: {
            contactNumber,
            countryCode,
            areaCode,
            ext
          },
          default: {
            contactNumber,
            countryCode,
            areaCode,
            ext
          },
          transaction: t
        }).all().then(([theContactNumber, created]) => {
          if (created) {
            return models.contactNumberType.findById(contactNumberType, {
              transaction: t
            }).then(theContactNumberType =>
              theContactNumber.setContactNumberType(theContactNumberType, {
                transaction: t
              })
            );
          }
          return theContactNumber;
        }).then(theContactNumber =>
          models.personContactNumber.create({
            contactPerson
          }, {
            transaction: t
          }).then(personContactNumber =>
            models.source.findById(source, {
              transaction: t
            }).then(theSource =>
              personContactNumber.setSource(theSource, {
                transaction: t
              }).then(personContactNumber =>
                personContactNumber.setPerson(debtor, {
                  transaction: t
                })
              ).then(personContactNumber =>
                personContactNumber.setContactNumber(theContactNumber, {
                  transaction: t
                })
              ).then(personContactNumber =>
                models.relationship.findById(relationship, {
                  transaction: t
                }).then(theRelationship =>
                  personContactNumber.setRelationship(theRelationship, {
                    transaction: t
                  })
                )
              ).then(personContactNumber => {
                const cn = theContactNumber.toJSON();
                cn.source = theSource.source;
                cn.contactPerson = personContactNumber.contactPerson;
                cn.relationshipId = personContactNumber.relationshipId;
                cn.sourceId = personContactNumber.sourceId;
                cn.debtorId = personContactNumber.personId;
                return cn;
              })
            )
          )
        )
      )
    ).then(contactNumber =>
      res.status(201).send({ contactNumber }).end()
    );
  });


router.route('/:debtorId/addresses')
  .get((req, res) => {
    const debtorId = req.params.debtorId;
    models.sequelize.query(`
      SELECT
        ad.*,
        adt.type addressType,
        s.source,
        pad.contactPerson,
        pad.relationshipId,
        pad.verifiedAt,
        pad.verifiedBy,
        pad.personId debtorId
      FROM address ad
      LEFT JOIN personAddress pad ON pad.addressId = ad.id
      LEFT JOIN addressType adt ON adt.id = pad.addressTypeId
      LEFT JOIN source s ON s.id = pad.sourceId
      WHERE pad.personid = ${debtorId}
    `, { type: models.sequelize.QueryTypes.SELECT }
  ).then(addresses =>
      res.status(200).send({ addresses }).end()
    );
  });

router.route('/:debtorId/addresses')
  .post((req, res) => {
    const debtorId = req.params.debtorId;
    const {
      address,
      county,
      city,
      province,
      addressType,
      country,
      source,
      contactPerson,
      relationship,
    } = req.body;
    const longAddress = `${province}${city}${county}${address}`;
    return models.sequelize.transaction(t =>
      models.person.findById(debtorId, {
        transaction: t
      }).then(debtor =>
        models.address.findOrCreate({
          where: {
            address,
            longAddress
          },
          default: {
            address,
            longAddress
          },
          transaction: t
        }).all().then(([theAddress]) =>
          theAddress
        ).then(theAddress =>
          models.personAddress.create({
            contactPerson
          }, {
            transaction: t
          }).then(personAddress =>
            models.source.findById(source, {
              transaction: t
            }).then(theSource =>
              models.addressType.findById(addressType, {
                transaction: t
              }).then(theAddressType =>
                personAddress.setAddressType(theAddressType, {
                  transaction: t
                }).then(() =>
                  models.country.findOrCreate({
                    where: {
                      country
                    },
                    default: {
                      country
                    },
                    transaction: t
                  }).all().then(([theCountry, countryCreated]) =>
                    models.province.findOrCreate({
                      where: {
                        province
                      },
                      default: {
                        province
                      },
                      transaction: t
                    }).all().then(([theProvince, provinceCreated]) =>
                      models.city.findOrCreate({
                        where: {
                          city
                        },
                        default: {
                          city
                        },
                        transaction: t
                      }).all().then(([theCity]) =>
                        models.county.findOrCreate({
                          where: {
                            county
                          },
                          default: {
                            county
                          },
                          transaction: t
                        }).all().then(([theCounty]) =>
                          theCounty.hasCity(theCity, {
                            transaction: t
                          }).then(hasCity => {
                            if (hasCity) {
                              return theCounty;
                            }
                            return theCounty.addCity(theCity, {
                              transaction: t
                            });
                          }).then(() =>
                            theCity.hasProvince(theProvince, {
                              transaction: t
                            }).then(hasProvince => {
                              if (hasProvince) {
                                return theCity;
                              }
                              return theCity.addProvince(theProvince, {
                                transaction: t
                              });
                            })
                          ).then(() => {
                            if (provinceCreated || countryCreated) {
                              return theProvince.setCountry(theCountry, {
                                transaction: t
                              });
                            }
                            return theProvince;
                          }).then(() =>
                            models.cityCounty.findOrCreate({
                              where: {
                                cityId: theCity.id,
                                countyId: theCounty.id
                              },
                              transaction: t
                            }).all().then(([theCityCounty]) =>
                              theAddress.setCityCounty(theCityCounty, {
                                transaction: t
                              })
                            )
                          )
                        )
                      )
                    )
                  )
              ).then(() =>
                  personAddress.setSource(theSource, {
                    transaction: t
                  }).then(personAddress =>
                    personAddress.setPerson(debtor, {
                      transaction: t
                    })
                  ).then(personAddress =>
                    personAddress.setAddress(theAddress, {
                      transaction: t
                    })
                  ).then(personAddress =>
                    models.relationship.findById(relationship, {
                      transaction: t
                    }).then(theRelationship =>
                      personAddress.setRelationship(theRelationship, {
                        transaction: t
                      })
                    )
                  ).then(personAddress => {
                    const addr = theAddress.toJSON();
                    addr.source = theSource.source;
                    addr.contactPerson = personAddress.contactPerson;
                    addr.relationshipId = personAddress.relationshipId;
                    addr.addressType = theAddressType.type;
                    addr.sourceId = personAddress.sourceId;
                    addr.debtorId = personAddress.personId;
                    return addr;
                  })
                )
              )
            )
          )
        )
      )
    ).then(address =>
      res.status(201).send({ address }).end()
    );
  });

router.route('/:debtorId/notes')
  .get((req, res) => {
    const debtorId = req.params.debtorId;
    models.note.findAll({
      where: {
        personId: debtorId
      }
    }).then(notes =>
      res.status(200).send({ notes }).end()
    );
  });

router.route('/:debtorId/notes')
  .post((req, res) => {
    const debtorId = req.params.debtorId;
    const {
      note
    } = req.body;
    return models.sequelize.transaction(t =>
      models.note.create({
        note
      }, {
        transaction: t
      }).then(note =>
        models.person.findById(debtorId, {
          transaction: t
        }).then(debtor =>
          note.setPerson(debtor, {
            transaction: t
          })
        )
      )
    ).then(note =>
      res.status(201).send({ note }).end()
    );
  });

export default router;
