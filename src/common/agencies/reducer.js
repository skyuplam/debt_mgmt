import * as actions from './actions';
import Agency from './agency';
import { Record, Map } from 'immutable';

const InitialState = Record({
  // Undefined is absence of evidence. Null is evidence of absence.
  map: Map(),
  targetAgency: undefined,
});
const initialState = new InitialState;

const revive = ({ map, targetAgency }) => initialState.merge({
  map: Map(map).map(agency => new Agency(agency)),
  targetAgency: targetAgency ? new Agency(targetAgency) : null,
});

export default function agenciesReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_AGENCIES_SUCCESS: {
      const agencies = action.payload.agencies.reduce((agencies, json) =>
        agencies.set(json.id, new Agency(json))
      , Map());
      return state.set('map', agencies);
    }

    case actions.CREATE_AGENCY_SUCCESS: {
      const agency = Map().set(action.payload.agency.id, new Agency(action.payload.agency));
      return state.update('map', map => map.merge(agency));
    }

  }

  return state;
}
