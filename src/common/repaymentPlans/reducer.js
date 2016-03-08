import * as actions from './actions';
import RepaymentPlan from './repaymentPlan';
import { Map, Record } from 'immutable';


const InitialState = Record({
  map: Map(),
  newRepaymentPlan: null
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map, newRepaymentPlan }) => initialState.merge({
  map: Map(map).map(repaymentPlan => new RepaymentPlan(repaymentPlan)),
  newRepaymentPlan: new RepaymentPlan(newRepaymentPlan),
});

export default function repaymentPlansReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_REPAYMENT_PALNS_SUCCESS: {
      const repaymentPlans = action.payload.repaymentPlans.reduce((repaymentPlans, json) =>
        repaymentPlans.set(json.id, new RepaymentPlan(json))
      , Map());
      return state.set('map', repaymentPlans);
    }

    case actions.NEW_REPAYMENT_PLAN_SUCCESS: {
      const repaymentPlan = new RepaymentPlan(action.payload.repaymentPlan);
      return state.update('map', map => map.merge(repaymentPlan));
    }

  }

  return state;
}
