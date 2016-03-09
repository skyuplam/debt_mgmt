import * as actions from './actions';
import RepaymentPlan from './repaymentPlan';
import Repayment from '../repayments/repayment';
import NewRepaymentPlan from './newRepaymentPlan';
import { Map, Record } from 'immutable';


const InitialState = Record({
  map: Map(),
  newRepaymentPlan: NewRepaymentPlan(),
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map, newRepaymentPlan }) => initialState.merge({
  map: Map(map).map(repaymentPlan => new RepaymentPlan(repaymentPlan)),
  newRepaymentPlan: new NewRepaymentPlan(newRepaymentPlan),
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
      return state.update('map', map => map.merge(Map().set(repaymentPlan.id, repaymentPlan)));
    }

    case actions.ADD_REPAYMENTS: {
      if (!action.payload) return state;
      const newRepayments = action.payload.reduce(
        (repayments, nxtRepayment) =>
          repayments.set(nxtRepayment.term, new Repayment(nxtRepayment))
      , Map());
      return state.update('newRepaymentPlan', newRepaymentPlan =>
        newRepaymentPlan.update('repayments', () =>
          newRepayments)
      );
    }

  }

  return state;
}
