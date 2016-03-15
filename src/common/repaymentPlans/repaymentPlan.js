import { Record } from 'immutable';

const repaymentPlan = Record({
  id: '',
  principal: 0,
  apr: 0,
  servicingFeeRate: 0,
  managementFeeRate: 0,
  lateFeeRate: 0,
  penaltyFeeRate: 0,
  terms: 0,
  startedAt: null,
  endedAt: null,
  repaidAmount: 0,
  debtorId: null,
});

export default repaymentPlan;
