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
      const repayments = action.payload.repayments.reduce((repayments, json) =>
        repayments.set(json.id, new Repayment(json))
      , Map());
      return state.set('map', repayments);
    }

    case actions.PAY_REPAYMENT_SUCCESS: {
      const repayment = action.payload.repayment;
      return state.update('map', map =>
        map.merge(Map().set(repayment.id, new Repayment(repayment)))
      );
    }

  }

  return state;
}
