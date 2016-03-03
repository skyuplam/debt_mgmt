export const FETCH_DEBTORS_START = 'FETCH_DEBTORS_START';
export const FETCH_DEBTORS_FAILURE = 'FETCH_DEBTORS_FAILURE';
export const FETCH_DEBTORS_SUCCESS = 'FETCH_DEBTORS_SUCCESS';
export const SEARCH_DEBTORS_START = 'SEARCH_DEBTORS_START';
export const SEARCH_DEBTORS_FAILURE = 'SEARCH_DEBTORS_FAILURE';
export const SEARCH_DEBTORS_SUCCESS = 'SEARCH_DEBTORS_SUCCESS';

const API_VERSION = '/api/v1';


export function fetchDebtors() {
  return ({ fetch }) => ({
    type: 'FETCH_DEBTORS',
    payload: {
      promise: fetch(`${API_VERSION}/debtors`)
        .then(response => response.json())
    }
  });
}

// export function searchDebtors(criteria) {
//   return ({ fetch }) => ({
//     type: 'SEARCH_DEBTORS',
//     payloand: {
//       promise: fetch(`${API_VERSION}/debtors`, {
//         method: 'post',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(criteria)
//       }).then(response => response.json())
//     }
//   });
// }

export function searchDebtors(criteria) {
  return ({ fetch }) => {
    async function getPromise(fields) {
      try {
        const response = await fetch(`${API_VERSION}/debtors`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(criteria)
        });
        if (response.status !== 200) throw response;
        return response.json();
      } catch (error) {
        throw error;
      }
    }
    return {
      type: 'SEARCH_DEBTORS',
      payload: {
        promise: getPromise()
      }
    };
  };
}
