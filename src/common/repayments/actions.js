export const FETCH_REPAYMENTS_START = 'FETCH_REPAYMENTS_START';
export const FETCH_REPAYMENTS_FAILURE = 'FETCH_REPAYMENTS_FAILURE';
export const FETCH_REPAYMENTS_SUCCESS = 'FETCH_REPAYMENTS_SUCCESS';
export const PAY_REPAYMENT_START = 'PAY_REPAYMENT_START';
export const PAY_REPAYMENT_FAILURE = 'PAY_REPAYMENT_FAILURE';
export const PAY_REPAYMENT_SUCCESS = 'PAY_REPAYMENT_SUCCESS';

const API_VERSION = '/api/v1';


export function fetchRepaments(repaymentPlanId, debtorId) {
  return ({ fetch }) => {
    async function getPromise(fields) {
      try {
        const response = await fetch(`${API_VERSION}/debtors/${debtorId}/repaymentPlans/${repaymentPlanId}/repayments`, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (response.status !== 200) throw response;
        return response.json();
      } catch (error) {
        throw error;
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

export function payRepayment(repaymentPlanId, debtorId, repaymentId) {
  return ({ fetch }) => {
    async function getPromise(fields) {
      try {
        const response = await fetch(`${API_VERSION}/debtors/${debtorId}/repaymentPlans/${repaymentPlanId}/repayments/${repaymentId}/pay`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw error;
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
