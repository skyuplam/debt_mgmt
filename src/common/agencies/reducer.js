import * as actions from './actions';
import Agency from './agency';
import Placement from './placement';
import { Record, Map } from 'immutable';

const InitialState = Record({
  // Undefined is absence of evidence. Null is evidence of absence.
  map: Map(),
  targetAgency: undefined,
  placements: Map(),
});
const initialState = new InitialState;

const revive = ({ map, targetAgency, placement }) => initialState.merge({
  map: Map(map).map(agency => new Agency(agency)),
  targetAgency: targetAgency ? new Agency(targetAgency) : null,
  placements: targetAgency ? new Placement(placement) : null,
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

    case actions.FETCH_PLACEMENTS_SUCCESS: {
      const placements = action.payload.placements.reduce((placements, json) =>
        placements.set(json.id, new Placement(json))
      , Map());
      return state.set('placements', placements);
    }

    case actions.CREATE_PLACEMENT_SUCCESS: {
      const placement = Map().set(action.payload.placement.id,
        new Placement(action.payload.placement));
      return state.update('placements', map => map.merge(placement));
    }

  }

  return state;
}
