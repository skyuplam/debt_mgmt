import * as actions from './actions';
import Portfolio from './portfolio';
import { Record, Map } from 'immutable';

const InitialState = Record({
  // Undefined is absence of evidence. Null is evidence of absence.
  map: Map(),
});
const initialState = new InitialState;

const revive = ({ map }) => initialState.merge({
  map: Map(map).map(portfolio => new Portfolio(portfolio)),
});

export default function agenciesReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_PORTFOLIOS_SUCCESS: {
      const portfolios = action.payload.portfolios.reduce((portfolios, json) =>
        portfolios.set(json.id, new Portfolio(json))
      , Map());
      return state.set('map', portfolios);
    }

    case actions.CREATE_PORTFOLIO_SUCCESS: {
      const portfolio = Map().set(action.payload.portfolio.id,
        new Portfolio(action.payload.portfolio));
      return state.update('map', map => map.merge(portfolio));
    }

  }

  return state;
}
