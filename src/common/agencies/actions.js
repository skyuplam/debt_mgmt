// Note prefix ON_.
// This convention means action is dispatched by server, not by viewer.
import { translateHttpError } from '../lib/error/error';

const API_VERSION = '/api/v1';

export const FETCH_AGENCIES_START = 'FETCH_AGENCIES_START';
export const FETCH_AGENCIES_FAILURE = 'FETCH_AGENCIES_FAILURE';
export const FETCH_AGENCIES_SUCCESS = 'FETCH_AGENCIES_SUCCESS';
export const CREATE_AGENCY_START = 'CREATE_AGENCY_START';
export const CREATE_AGENCY_FAILURE = 'CREATE_AGENCY_FAILURE';
export const CREATE_AGENCY_SUCCESS = 'CREATE_AGENCY_SUCCESS';

export const agencyAction = {
  newAgency: 'newAgency',
};


export function fetchAgencies(locParams, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/agencies`, {
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
        throw translateHttpError(error, { action: 'fetchAgencies' });
      }
    }
    return {
      type: 'FETCH_AGENCIES',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function createAgency(agency, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/agencies`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          },
          body: JSON.stringify(agency)
        });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'createAgency' });
      }
    }
    return {
      type: 'CREATE_AGENCY',
      payload: {
        promise: getPromise()
      }
    };
  };
}
