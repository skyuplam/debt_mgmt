// Note prefix ON_.
// This convention means action is dispatched by server, not by viewer.
import { translateHttpError } from '../lib/error/error';

const API_VERSION = '/api/v1';

export const FETCH_USERS_START = 'FETCH_USERS_START';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const NEW_USER_START = 'NEW_USER_START';
export const NEW_USER_FAILURE = 'NEW_USER_FAILURE';
export const NEW_USER_SUCCESS = 'NEW_USER_SUCCESS';
export const UPDATE_USER_START = 'UPDATE_USER_START';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';

export const ON_USERS_LIST = 'ON_USERS_LIST';

export const userAction = {
  newUser: 'newUser',
  changePassword: 'changePassword',
  deactivate: 'deactivate',
  activate: 'activate',
};

export function onUsersList(users) {
  return {
    type: ON_USERS_LIST,
    payload: { users }
  };
}


export function fetchUsers(locParams, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/users`, {
          method: 'get',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          }
        });
        if (response.status !== 200) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'fetchUsers' });
      }
    }
    return {
      type: 'FETCH_USERS',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function createUser(newUser, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/users`, {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          },
          body: JSON.stringify(newUser)
        });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'createUser' });
      }
    }
    return {
      type: 'NEW_USER',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function updateUser({ user }, viewer = {}) {
  const Authorization = `Bearer ${viewer.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/users/${user.id}`, {
          method: 'put',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          },
          body: JSON.stringify({ user })
        });
        if (response.status !== 202) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'updateUser' });
      }
    }
    return {
      type: 'UPDATE_USER',
      payload: {
        promise: getPromise()
      }
    };
  };
}
