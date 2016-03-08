export const FETCH_REPAYMENT_PALNS_START = 'FETCH_REPAYMENT_PALNS_START';
export const FETCH_REPAYMENT_PALNS_FAILURE = 'FETCH_REPAYMENT_PALNS_FAILURE';
export const FETCH_REPAYMENT_PALNS_SUCCESS = 'FETCH_REPAYMENT_PALNS_SUCCESS';

const API_VERSION = '/api/v1';


export function fetchRepamentPalns(locParams) {
  return ({ fetch }) => {
    async function getPromise(fields) {
      try {
        const response = await fetch(`${API_VERSION}/${locParams.params.id}/repaymentPlans`, {
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
