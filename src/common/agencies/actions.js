// Note prefix ON_.
// This convention means action is dispatched by server, not by viewer.
import { translateHttpError } from '../lib/error/error';

const API_VERSION = '/api/v1';

export const FETCH_AGENCIES_START = 'FETCH_AGENCIES_START';
export const FETCH_AGENCIES_ERROR = 'FETCH_AGENCIES_ERROR';
export const FETCH_AGENCIES_SUCCESS = 'FETCH_AGENCIES_SUCCESS';
export const FETCH_PLACEMENTS_START = 'FETCH_PLACEMENTS_START';
export const FETCH_PLACEMENTS_ERROR = 'FETCH_PLACEMENTS_ERROR';
export const FETCH_PLACEMENTS_SUCCESS = 'FETCH_PLACEMENTS_SUCCESS';
export const CREATE_AGENCY_START = 'CREATE_AGENCY_START';
export const CREATE_AGENCY_ERROR = 'CREATE_AGENCY_ERROR';
export const CREATE_AGENCY_SUCCESS = 'CREATE_AGENCY_SUCCESS';
export const CREATE_PLACEMENT_START = 'CREATE_PLACEMENT_START';
export const CREATE_PLACEMENT_ERROR = 'CREATE_PLACEMENT_ERROR';
export const CREATE_PLACEMENT_SUCCESS = 'CREATE_PLACEMENT_SUCCESS';

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

export function fetchPlacements(locParams, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/agencies/placements`, {
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
        throw translateHttpError(error, { action: 'fetchPlacements' });
      }
    }
    return {
      type: 'FETCH_PLACEMENTS',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function createPlacement(placement, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/agencies/${placement.placement.companyId}/placements`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          },
          body: JSON.stringify(placement)
        });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'createPlacement' });
      }
    }
    return {
      type: 'CREATE_PLACEMENT',
      payload: {
        promise: getPromise()
      }
    };
  };
}
