import Debtor from '../../common/debtors/debtor';
import express from 'express';
import shortid from 'shortid';
import models from '../models';


const router = express.Router();

function getDebtors(criteria) {
  let condition = '';
  if (criteria) {
    const matchIdCard = criteria.idCard?`i.idNumber = ${criteria.idCard}`:'';
    const matchName = criteria.name?`p.name = ${criteria.name}`:'';
    const matchOriAgmentNo = criteria.originatedAgreementNo?`l.originatedAgreementNo = ${criteria.originatedAgreementNo}`:'';
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
        *
      FROM repaymentPlan rp
      LEFT JOIN loan l ON l.id = rp.loanId
      LEFT JOIN debtorLoan dl ON dl.loanId = l.id
      LEFT JOIN person d ON d.id = dl.debtorId
      WHERE d.id = ${debtorId}
    `, { type: models.sequelize.QueryTypes.SELECT }
    ).then(repaymentPlans =>
      res.status(200).send({repaymentPlans}).end()
    );
  });

router.route('/:repaymentPlansId/repayments')
  .get((req, res) => {
    const repaymentPlanId = req.params.repaymentPlanId;
    models.sequelize.query(`
      SELECT
       *
      FROM repayment r
      WHERE r.repaymentPlanId = ${repaymentPlanId}
    `, { type: models.sequelize.QueryTypes.SELECT }
  ).then(repayments =>
      res.status(200).send({repayments}).end()
    );
  });

export default router;
