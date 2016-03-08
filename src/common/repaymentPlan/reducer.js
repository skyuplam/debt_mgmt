import * as actions from './actions';
import RepaymentPlan from './repaymentPlan';
import { Map, Record } from 'immutable';


const InitialState = Record({
  map: Map()
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map }) => initialState.merge({
  map: Map(map).map(repaymentPlan => new RepaymentPlan(repaymentPlan))
});

export default function debtorsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_REPAYMENT_PALNS_SUCCESS: {
      const repaymentPlans = action.payload.repaymentPlans.reduce((repaymentPlans, json) =>
        repaymentPlans.set(json.id, new RepaymentPlan(json))
      , Map());
      return state.update('map', map => map.merge(repaymentPlans));
    }

  }

  return state;
}
