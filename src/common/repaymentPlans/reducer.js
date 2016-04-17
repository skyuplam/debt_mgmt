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

    case actions.FETCH_REPAYMENT_PLANS_SUCCESS: {
      if (!action.payload.repaymentPlans) {
        return state.update('map', map => map.clear());
      }
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

    case actions.UPDATE_REPAYMENT: {
      if (!action.payload) return state;
      const repayment = Map().set(action.payload.term, new Repayment(action.payload));
      return state.update('newRepaymentPlan', newRepaymentPlan =>
        newRepaymentPlan.update('repayments', repayments =>
        repayments.merge(repayment)
      ));
    }

    case actions.RESET_REPAYMENTS: {
      return state.update('newRepaymentPlan', newRepaymentPlan =>
        newRepaymentPlan.update('repayments', repayments =>
        repayments.clear()
      ));
    }

  }

  return state;
}
