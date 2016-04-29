import { Record } from 'immutable';

const repaymentPlan = Record({
  id: undefined,
  principal: 0,
  apr: 0,
  servicingFeeRate: 0,
  managementFeeRate: 0,
  lateFeeRate: 0,
  penaltyFeeRate: 0,
  terms: 0,
  loan: undefined,
  loanId: undefined,
  loanPlacementId: undefined,
  startedAt: undefined,
  endedAt: undefined,
  repaymentPlanStatusId: undefined,
  repaidAmount: 0,
  debtorId: undefined,
});

export default repaymentPlan;
