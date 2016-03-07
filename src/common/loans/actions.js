export const FETCH_LOANS_START = 'FETCH_LOANS_START';
export const FETCH_LOANS_SUCCESS = 'FETCH_LOANS_SUCCESS';
export const FETCH_LOANS_FAILURE = 'FETCH_LOANS_FAILURE';

const API_VERSION = '/api/v1';


export function fetchLoans(locParams) {
  return ({ fetch }) => {
    async function getPromise(fields) {
      try {
        const response = await fetch(`${API_VERSION}/debtors/${locParams.params.id}/loans`, {
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
      type: 'FETCH_LOANS',
      payload: {
        promise: getPromise()
      }
    };
  };
}
