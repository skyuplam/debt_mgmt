import * as actions from './actions';
import Debtor from './debtor';
import { Map, Record } from 'immutable';


const InitialState = Record({
  map: Map()
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map }) => initialState.merge({
  map: Map(map).map(debtor => new Debtor(debtor))
});

export default function debtorsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_DEBTORS_SUCCESS: {
      const debtors = Map(action.payload.debtors).map(debtor => new Debtor(debtor));
      return state.update('map', map => map.merge(debtors));
    }

  }

  return state;
}
