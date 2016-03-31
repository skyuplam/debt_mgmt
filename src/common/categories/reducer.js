import * as actions from './actions';
import Relationship from './relationship';
import { Map, Record } from 'immutable';


const InitialState = Record({
  relationships: Map()
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map }) => initialState.merge({
  relationships: Map(map).map(relationship => new Relationship(relationship))
});

export default function contactNumbersReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_RELATIONSHIPS_SUCCESS: {
      const relationships = action.payload.relationships.reduce((relationships, json) =>
        relationships.set(json.id, new Relationship(json))
      , Map());
      return state.update('relationships', map => map.merge(relationships));
    }

  }

  return state;
}
