import { Record } from 'immutable';

const Repayment = Record({
  id: '',
  principal: 0,
  interest: 0,
  servicingFee: 0,
  managementFee: 0,
  lateFee: 0,
  penaltyFee: 0,
  term: 0,
  terms: 0,
  expectedRepaidAt: null,
  paidAmount: 0,
  repaidAt: null,
  repaymentPlanId: null,
  repaymentStatusId: null,
  repaymentPlanStatus: null,
  repaymentStatus: null,
});

export default Repayment;
