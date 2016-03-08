export const FETCH_REPAYMENT_PALNS_START = 'FETCH_REPAYMENT_PALNS_START';
export const FETCH_REPAYMENT_PALNS_FAILURE = 'FETCH_REPAYMENT_PALNS_FAILURE';
export const FETCH_REPAYMENT_PALNS_SUCCESS = 'FETCH_REPAYMENT_PALNS_SUCCESS';
export const NEW_REPAYMENT_PLAN_START = 'NEW_REPAYMENT_PLAN_START';
export const NEW_REPAYMENT_PLAN_FAILURE = 'NEW_REPAYMENT_PLAN_FAILURE';
export const NEW_REPAYMENT_PLAN_SUCCESS = 'NEW_REPAYMENT_PLAN_SUCCESS';

const API_VERSION = '/api/v1';

export function newRepaymentPlan(repaymentPlan) {
  return ({ fetch }) => {
    async function getPromise(fields) {
      try {
        const response = await fetch(`${API_VERSION}/debtors/repaymentPlans`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(repaymentPlan)
        });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw error;
      }
    }
    return {
      type: 'NEW_REPAYMENT_PLAN',
      payload: {
        promise: getPromise()
      }
    };
  };
}


export function fetchRepamentPlans(locParams) {
  return ({ fetch }) => {
    async function getPromise(fields) {
      try {
        const response = await fetch(`${API_VERSION}/debtors/${locParams.params.id}/repaymentPlans`, {
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
      type: 'FETCH_REPAYMENT_PLANS',
      payload: {
        promise: getPromise()
      }
    };
  };
}
