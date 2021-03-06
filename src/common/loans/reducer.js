import * as actions from './actions';
import Loan from './loan';
import { Map, Record } from 'immutable';


const InitialState = Record({
  map: Map()
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map }) => initialState.merge({
  map: Map(map).map(loan => new Loan(loan))
});

export default function loansReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_LOANS_SUCCESS: {
      const loans = action.payload.loans.reduce((loans, json) =>
        loans.set(json.id, new Loan(json))
      , Map());
      return state.set('map', loans);
    }

    case actions.POSTPONE_PLACEMENT_RECALL_SUCCESS: {
      const loanPlacement = action.payload.loanPlacement;
      const loan = state.map.find(loan => loan.loanPlacementId === loanPlacement.id).toJS();
      loan.expectedRecalledAt = loanPlacement.expectedRecalledAt;
      const loanMap = Map().set(loan.id, new Loan(loan));
      return state.update('map', map => map.mergeDeep(loanMap));
    }

  }

  return state;
}
