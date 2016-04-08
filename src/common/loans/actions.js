export const FETCH_LOANS_START = 'FETCH_LOANS_START';
export const FETCH_LOANS_SUCCESS = 'FETCH_LOANS_SUCCESS';
export const FETCH_LOANS_FAILURE = 'FETCH_LOANS_FAILURE';
export const POSTPONE_PLACEMENT_RECALL_START = 'POSTPONE_PLACEMENT_RECALL_START';
export const POSTPONE_PLACEMENT_RECALL_SUCCESS = 'POSTPONE_PLACEMENT_RECALL_SUCCESS';
export const POSTPONE_PLACEMENT_RECALL_ERROR = 'POSTPONE_PLACEMENT_RECALL_ERROR';

import { translateHttpError } from '../lib/error/error';

const API_VERSION = '/api/v1';


export function fetchLoans(locParams, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(`${API_VERSION}/debtors/${locParams.params.id}/loans`, {
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
        throw translateHttpError(error, { action: 'fetchLoans' });
      }
    }
    return {
      type: 'FETCH_LOANS',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function postponePlacementRecall({
  postponedRecallDate, debtorId
}, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(`${API_VERSION}/debtors/`, {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          }
        });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'fetpostponeLoanRecallchLoans' });
      }
    }
    return {
      type: 'POSTPONE_PLACEMENT_RECALL',
      payload: {
        promise: getPromise()
      }
    };
  };
}
