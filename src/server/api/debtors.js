import Debtor from '../../common/debtors/debtor';
import express from 'express';
import shortid from 'shortid';
import models from '../models';


const router = express.Router();

// const debtor = new Debtor({
//   id: shortid.generate(),
//   name: 'Chan Tai Man',
//   dateOfBirth: null,
//   idCardNumber: '1234566789'
// });
//
// const debtors = {
//   [debtor.id]: debtor
// };
//
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
      AND i.idTypeId = 1
    LEFT JOIN debtorLoan dl ON dl.debtorId = p.id
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
      i.idNumber
    from person p
    LEFT JOIN personIdentity pi ON p.id = pi.personId
    LEFT JOIN identity i ON i.id = pi.identityId
      AND i.idTypeId = 1
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

export default router;
