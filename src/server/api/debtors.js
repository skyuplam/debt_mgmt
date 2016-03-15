import Debtor from '../../common/debtors/debtor';
import express from 'express';
import shortid from 'shortid';
import models from '../models';


const router = express.Router();

function getDebtors(criteria) {
  let condition = '';
  if (criteria) {
    const matchIdCard = criteria.idCard?`i.idNumber = '${criteria.idCard}'`:'';
    const matchName = criteria.name?`p.name = '${criteria.name}'`:'';
    const matchOriAgmentNo = criteria.originatedAgreementNo?`l.originatedAgreementNo = '${criteria.originatedAgreementNo}'`:'';
    const criteriaStr = [matchIdCard, matchName, matchOriAgmentNo].filter(a => a).join(' OR ');
    condition = criteriaStr?`WHERE ${criteriaStr}`:'';
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
      return res.status(200).send({debtors}).end();
    });
  });

router.route('/')
  .post((req, res) => {
    const { idCard, originatedAgreementNo, name } = req.body;

    getDebtors({ idCard, originatedAgreementNo, name }).then(people => {
        console.log(`Debtors Count:${people.length}`);
        const debtors = people;
        return res.status(200).send({debtors}).end();
      });
  });

router.route('/:debtorId')
  .get((req, res) => {
    const debtorId = req.params.debtorId;
    getDebtor(debtorId).then(debtors => {
      return res.status(200).send({debtors}).end();
    });
  });

router.route('/:debtorId/loans')
  .get((req, res) => {
    const debtorId = req.params.debtorId;
    models.sequelize.query(`
      SELECT
        l.*
      FROM debtorLoan dl
      LEFT JOIN loan l ON l.id = dl.loanId
      WHERE dl.debtorId = ${debtorId}
      `, { type: models.sequelize.QueryTypes.SELECT }
    ).then(loans => {
      return res.status(200).send({loans}).end();
    });
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
      rp.debtorId = parseInt(debtorId);
      return rp;
    })
    return res.status(200).send({repaymentPlans}).end()
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

    return models.sequelize.transaction(t => {
      return models.repaymentPlan.create({
        principal: repayAmount,
        terms: terms,
        startedAt: startedAt
      }, { transaction: t }).then(repaymentPlan => {
        return models.loan.findById(loanId).then(loan => {
          // Link repaymentplan with loan
          return models.loanStatus.find({
            where: {
              status: 'In Repayment'
            }
          }).then(loanStatus =>
            loan.setLoanStatus(loanStatus, { transaction: t })
          ).then(loan =>
            repaymentPlan.setLoan(loan, { transaction: t })
          )
        }).then(repaymentPlan => {
          return Promise.all(
            repayments.map(repayment => {
              return models.repayment.create(
                repayment,
                { transaction: t }
              ).then(newRpmt => {
                // Link repayment with repaymentplan
                repaymentPlan.addRepayment(newRpmt, {
                  transaction: t
                });
                return newRpmt;
              });
            })
          ).then(newRepayments => {
            // Created new repayments
            return repaymentPlan;
          });
        });
      });
    }).then(repaymentPlan => {
      const rp = repaymentPlan.toJSON();
      rp.debtorId = parseInt(debtorId);
      return res.status(201).send({repaymentPlan}).end();
    }
    );
  });

router.route('/:debtorId/repaymentPlans/:repaymentPlanId/repayments')
  .get((req, res) => {
    const { repaymentPlanId, debtorId } = req.params;
    models.sequelize.query(`
      SELECT
       r.*,
       rs.status
      FROM repayment r
      LEFT JOIN repaymentStatus rs ON rs.id = r.repaymentStatusId
      WHERE r.repaymentPlanId = ${repaymentPlanId}
    `, { type: models.sequelize.QueryTypes.SELECT }
  ).then(repayments =>
      res.status(200).send({repayments}).end()
    );
  });

router.route('/:debtorId/repaymentPlans/:repaymentPlanId/repayments/:repaymentId/pay')
  .post((req, res) => {
    const { repaymentId, repaymentPlanId } = req.params;
    const { amount, repaidAt, paidInFull } = req.body;

    return models.repayment.findById(repaymentId).then(repayment => {
      return models.sequelize.transaction(t => {
        // Repayment Status
        const expected = new Date(repayment.expectedRepaidAt);
        const actual = new Date(repaidAt);
        let rpStatus;
        if (actual.getFullYear() <= expected.getFullYear() &&
            actual.getMonth() <= expected.getMonth() &&
            actual.getDay() <= expected.getDay()) {
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
            }).then(rpPlan => {
              return models.loan.findById(rpPlan.loanId).then(loan => {
                // Update loan
                const totalAmount = loan.collectablePrincipal+
                  loan.collectableInterest+
                  loan.collectableMgmtFee+
                  loan.collectableHandlingFee+
                  loan.collectableLateFee+
                  loan.collectablePenaltyFee;
                let loanStatus;
                // Repayment Plan Status Code 5: Completed
                const isCompleted = rpPlan.repaymentPlanStatusId == 5;
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
                }).then(loan => repayment)
              })
            })
          })
        );
      });
    }).then(repayment =>
      res.status(201).send({repayment}).end());
  });

export default router;
