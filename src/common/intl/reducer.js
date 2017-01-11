import * as actions from './actions';
import { Record } from 'immutable';

const InitialState = Record({
  currentLocale: null, // Autodetected in /server/frontend/render.js
  initialNow: null, // Set in /server/frontend/render.js
  locales: null, // Defined in /server/config.js
  messages: {} // Created from /messages files.
});
const initialState = new InitialState;

const reducer = (
  state: IntlState = initialState,
  action?: Action,
): IntlState => {
  // Because it's called from the createInitialState.
  if (!action) return state;

  switch (action.type) {

    case 'SET_CURRENT_LOCALE': {
      return { ...state, currentLocale: action.payload.locale };
    }

    default:
      return state;

  }
};

export default reducer;
