import { Record } from 'immutable';

const Repayment = Record({
  id: '',
  principal: 0,
  interest: 0,
  servicingFee: 0,
  managementFee: 0,
  lateFee: 0,
  penaltyFee: 0,
  terms: 0,
  expectedRepaidAt: null,
  repaidAt: null,
});

export default Repayment;
