import { translateHttpError } from '../lib/error/error';

export const FETCH_DEBTORS_START = 'FETCH_DEBTORS_START';
export const FETCH_DEBTORS_ERROR = 'FETCH_DEBTORS_ERROR';
export const FETCH_DEBTORS_SUCCESS = 'FETCH_DEBTORS_SUCCESS';
export const SEARCH_DEBTORS_START = 'SEARCH_DEBTORS_START';
export const SEARCH_DEBTORS_ERROR = 'SEARCH_DEBTORS_ERROR';
export const SEARCH_DEBTORS_SUCCESS = 'SEARCH_DEBTORS_SUCCESS';
export const FETCH_DEBTOR_START = 'FETCH_DEBTOR_START';
export const FETCH_DEBTOR_ERROR = 'FETCH_DEBTOR_ERROR';
export const FETCH_DEBTOR_SUCCESS = 'FETCH_DEBTOR_SUCCESS';

const API_VERSION = '/api/v1';


export function fetchDebtors(user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => ({
    type: 'FETCH_DEBTORS',
    payload: {
      promise: fetch(`${API_VERSION}/debtors`, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization
      })
        .then(response => response.json())
    }
  });
}

export function searchDebtors(criteria, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(`${API_VERSION}/debtors`, {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          },
          body: JSON.stringify(criteria)
        });
        if (response.status !== 200) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'searchDebtors' });
      }
    }
    return {
      type: 'SEARCH_DEBTORS',
      payload: {
        promise: getPromise()
      }
    };
  };
}


export function fetchDebtor(locParams, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(`${API_VERSION}/debtors/${locParams.params.id}`, {
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
        throw translateHttpError(error, { action: 'fetchDebtor' });
      }
    }
    return {
      type: 'FETCH_DEBTOR',
      payload: {
        promise: getPromise()
      }
    };
  };
}
