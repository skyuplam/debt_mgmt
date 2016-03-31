export const FETCH_RELATIONSHIPS_START = 'FETCH_RELATIONSHIPS_START';
export const FETCH_RELATIONSHIPS_FAILURE = 'FETCH_RELATIONSHIPS_FAILURE';
export const FETCH_RELATIONSHIPS_SUCCESS = 'FETCH_RELATIONSHIPS_SUCCESS';


const API_VERSION = '/api/v1';


export function fetchRelationships() {
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/categories/relationships`,
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
      type: 'FETCH_RELATIONSHIPS',
      payload: {
        promise: getPromise()
      }
    };
  };
}
