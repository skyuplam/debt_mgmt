export const FETCH_CONTACT_NUMBERS_START = 'FETCH_CONTACT_NUMBERS_START';
export const FETCH_CONTACT_NUMBERS_FAILURE = 'FETCH_CONTACT_NUMBERS_FAILURE';
export const FETCH_CONTACT_NUMBERS_SUCCESS = 'FETCH_CONTACT_NUMBERS_SUCCESS';
export const NEW_CONTACT_NUMBER_START = 'NEW_CONTACT_NUMBER_START';
export const NEW_CONTACT_NUMBER_FAILURE = 'NEW_CONTACT_NUMBER_FAILURE';
export const NEW_CONTACT_NUMBER_SUCCESS = 'NEW_CONTACT_NUMBER_SUCCESS';

import { translateHttpError } from '../lib/error/error';

const API_VERSION = '/api/v1';


export function fetchContactNumbers(locParams, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/debtors/${locParams.params.id}/contactNumbers`,
          {
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
        throw translateHttpError(error, { action: 'fetchContactNumbers' });
      }
    }
    return {
      type: 'FETCH_CONTACT_NUMBERS',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function addNewContactNumber(contactNumber, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/debtors/${contactNumber.debtorId}/contactNumbers`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization
            },
            body: JSON.stringify(contactNumber)
          });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'addNewContactNumber' });
      }
    }
    return {
      type: 'NEW_CONTACT_NUMBER',
      payload: {
        promise: getPromise()
      }
    };
  };
}
