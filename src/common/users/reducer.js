import * as actions from './actions';
import * as authActions from '../auth/actions';
import { TOGGLE_USER_ACTION_POPUP, TOGGLE_USER_ACTION_DIALOG } from '../ui/actions';
import User from './user';
import { Record, Map, Seq } from 'immutable';

const InitialState = Record({
  // Undefined is absence of evidence. Null is evidence of absence.
  list: undefined,
  map: Map(),
  viewer: undefined,
  targetUser: undefined,
});
const initialState = new InitialState;

const usersJsonToList = users => users && Seq(users)
  .map(json => new User(json))
  .sortBy(user => -user.authenticatedAt)
  .toList();

const revive = ({ list, map, viewer, targetUser }) => initialState.merge({
  list: usersJsonToList(list),
  map: Map(map).map(user => new User(user)),
  viewer: viewer ? new User(viewer) : null,
  targetUser: targetUser ? new User(targetUser) : null,
});

export default function usersReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case authActions.LOGIN_SUCCESS: {
      const { user } = action.payload;
      const theUser = new User(user);
      return state.set('viewer', theUser);
    }

    case actions.ON_USERS_LIST: {
      const { users } = action.payload;
      const list = usersJsonToList(users);
      return state.set('list', list);
    }

    case actions.NEW_USER_SUCCESS: {
      const user = Map().set(action.payload.user.id, new User(action.payload.user));
      return state.update('map', map => map.mergeDeep(user));
    }

    case actions.FETCH_USERS_SUCCESS: {
      const users = action.payload.users.reduce((users, json) =>
        users.set(json.id, new User(json))
      , Map());
      return state.set('map', users);
    }

    case actions.UPDATE_USER_SUCCESS: {
      const user = Map().set(action.payload.user.id, new User(action.payload.user));
      return state.update('map', map => map.mergeDeep(user));
    }

    case TOGGLE_USER_ACTION_POPUP: {
      if (!(action.payload && action.payload.user)) {
        return state.delete('targetUser');
      }
      const user = action.payload.user;
      return state.set('targetUser', new User(user));
    }

    case TOGGLE_USER_ACTION_DIALOG: {
      if (!(action.payload && action.payload.user)) {
        return state.delete('targetUser');
      }
      const user = action.payload.user;
      return state.set('targetUser', new User(user));
    }

  }

  return state;
}
