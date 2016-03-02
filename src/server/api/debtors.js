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

router.route('/')
  .get((req, res) => {
    // Simulate async access.
    // In real app we would check user credentials and load user data from DB.
    // setTimeout(() => {
    //   res.status(200).send({ debtors }).end();
    // }, 50);
    models.sequelize.query(`
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
      `,
      { type: models.sequelize.QueryTypes.SELECT }).then(people => {
      console.log(`Debtors Count:${people.length}`);
      const debtors = people;
      res.status(200).send({debtors}).end();
    });
  });

export default router;
