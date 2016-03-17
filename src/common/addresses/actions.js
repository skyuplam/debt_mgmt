export const FETCH_ADDRESSES_START = 'FETCH_ADDRESSES_START';
export const FETCH_ADDRESSES_FAILURE = 'FETCH_ADDRESSES_FAILURE';
export const FETCH_ADDRESSES_SUCCESS = 'FETCH_ADDRESSES_SUCCESS';


const API_VERSION = '/api/v1';


export function fetchAddresses(locParams) {
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/debtors/${locParams.params.id}/addresses`,
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
      type: 'FETCH_ADDRESSES',
      payload: {
        promise: getPromise()
      }
    };
  };
}
