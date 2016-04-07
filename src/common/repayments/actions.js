export const FETCH_REPAYMENTS_START = 'FETCH_REPAYMENTS_START';
export const FETCH_REPAYMENTS_FAILURE = 'FETCH_REPAYMENTS_FAILURE';
export const FETCH_REPAYMENTS_SUCCESS = 'FETCH_REPAYMENTS_SUCCESS';
export const PAY_REPAYMENT_START = 'PAY_REPAYMENT_START';
export const PAY_REPAYMENT_FAILURE = 'PAY_REPAYMENT_FAILURE';
export const PAY_REPAYMENT_SUCCESS = 'PAY_REPAYMENT_SUCCESS';

import { translateHttpError } from '../lib/error/error';

const API_VERSION = '/api/v1';


export function fetchRepaments(repaymentPlanId, debtorId, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/debtors/${debtorId}/repaymentPlans/${repaymentPlanId}/repayments`, {
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
        throw translateHttpError(error, { action: 'fetchRepaments' });
      }
    }
    return {
      type: 'FETCH_REPAYMENTS',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function payRepayment({
  repaymentPlanId,
  debtorId,
  repaymentId,
  amount,
  repaidAt,
  paidInFull
}, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/debtors/${debtorId}/repaymentPlans/${repaymentPlanId}/repayments/${repaymentId}/pay`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization
            },
            body: JSON.stringify({
              amount,
              repaidAt,
              paidInFull,
            })
          });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'payRepayment' });
      }
    }
    return {
      type: 'PAY_REPAYMENT',
      payload: {
        promise: getPromise()
      }
    };
  };
}
