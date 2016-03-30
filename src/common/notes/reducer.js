import * as actions from './actions';
import Note from './note';
import { Map, Record } from 'immutable';


const InitialState = Record({
  map: Map()
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map }) => initialState.merge({
  map: Map(map).map(address => new Note(address))
});

export default function notesReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_NOTES_SUCCESS: {
      const notes = action.payload.notes.reduce((notes, json) =>
        notes.set(json.id, new Note(json))
      , Map());
      return state.update('map', map => map.merge(notes));
    }

    case actions.ADD_NEW_NOTE_SUCCESS: {
      const note = new Note(action.payload.note);
      return state.update('map', map => map.merge(Map().set(note.id, note)));
    }

  }

  return state;
}
