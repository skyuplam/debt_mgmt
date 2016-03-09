import { Record, Map } from 'immutable';

const newRepaymentPlan = Record({
  repayAmount: 0,
  terms: 0,
  startedAt: null,
  repayments: Map(),
});

export default newRepaymentPlan;
