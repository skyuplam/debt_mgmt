import * as actions from './actions';
import ContactNumber from './contactNumber';
import { Map, Record } from 'immutable';


const InitialState = Record({
  map: Map()
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map }) => initialState.merge({
  map: Map(map).map(contactNumber => new ContactNumber(contactNumber))
});

export default function contactNumbersReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_CONTACT_NUMBERS_SUCCESS: {
      const contactNumbers = action.payload.contactNumbers.reduce((contactNumbers, json) =>
        contactNumbers.set(json.id, new ContactNumber(json))
      , Map());
      return state.update('map', map => map.merge(contactNumbers));
    }

  }

  return state;
}
