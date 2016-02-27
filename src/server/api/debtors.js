import Debtor from '../../common/debtors/debtor';
import express from 'express';
import shortid from 'shortid';

const router = express.Router();

const debtor = new Debtor({
  id: shortid.generate(),
  name: 'Chan Tai Man',
  dateOfBirth: null,
  idCardNumber: '1234566789'
});

const debtors = {
  [debtor.id]: debtor
};

router.route('/')
  .get((req, res) => {
    // Simulate async access.
    // In real app we would check user credentials and load user data from DB.
    setTimeout(() => {
      res.status(200).send({ debtors }).end();
    }, 50);
  });

export default router;
