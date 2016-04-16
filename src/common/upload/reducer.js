import * as actions from './actions';
import { Record } from 'immutable';

const InitialState = Record({
  formDisabled: false,
  formError: null
});
const initialState = new InitialState;

export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {

    // Note how one reducer can handle several actions.
    case actions.UPLOAD_SUCCESS:
      return state.set('formDisabled', true);

  }

  return state;
}
