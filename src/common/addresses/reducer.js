import * as actions from './actions';
import Address from './address';
import { Map, Record } from 'immutable';


const InitialState = Record({
  map: Map()
});
const initialState = new InitialState;

// Note how JSON from server is revived to immutable record.
const revive = ({ map }) => initialState.merge({
  map: Map(map).map(address => new Address(address))
});

export default function addressesReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.FETCH_ADDRESSES_SUCCESS: {
      const addresses = action.payload.addresses.reduce((addresses, json) =>
        addresses.set(json.id, new Address(json))
      , Map());
      return state.update('map', map => map.merge(addresses));
    }

    case actions.NEW_ADDRESS_SUCCESS: {
      const address = new Address(action.payload.address);
      return state.update('map', map => map.merge(Map().set(address.id, address)));
    }

  }

  return state;
}
