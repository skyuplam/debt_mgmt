export const FETCH_CONTACT_NUMBERS_START = 'FETCH_CONTACT_NUMBERS_START';
export const FETCH_CONTACT_NUMBERS_FAILURE = 'FETCH_CONTACT_NUMBERS_FAILURE';
export const FETCH_CONTACT_NUMBERS_SUCCESS = 'FETCH_CONTACT_NUMBERS_SUCCESS';


const API_VERSION = '/api/v1';


export function fetchContactNumbers(locParams) {
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/debtors/${locParams.params.id}/contactNumbers`,
          {
            method: 'get',
            headers: {
              Accept: 'application/json',
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
      type: 'FETCH_CONTACT_NUMBERS',
      payload: {
        promise: getPromise()
      }
    };
  };
}
