import * as actions from './actions';
import Repayment from './repayment';
import { Map, Record } from 'immutable';


const InitialState = Record({
  map: Map()
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map }) => initialState.merge({
  map: Map(map).map(repayment => new Repayment(repayment))
});

export default function repaymentsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_REPAYMENTS_SUCCESS: {
      const repaymants = action.payload.repaymants.reduce((repaymants, json) =>
        repaymants.set(json.id, new Repayment(json))
      , Map());
      return state.set('map', repaymants);
    }

  }

  return state;
}
