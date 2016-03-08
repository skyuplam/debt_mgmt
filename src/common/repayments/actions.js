export const FETCH_REPAYMENTS_START = 'FETCH_REPAYMENTS_START';
export const FETCH_REPAYMENTS_FAILURE = 'FETCH_REPAYMENTS_FAILURE';
export const FETCH_REPAYMENTS_SUCCESS = 'FETCH_REPAYMENTS_SUCCESS';

const API_VERSION = '/api/v1';


export function fetchRepaments(repaymentPlanId) {
  return ({ fetch }) => {
    async function getPromise(fields) {
      try {
        const response = await fetch(`${API_VERSION}/repayments/${repaymentPlanId}`, {
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
