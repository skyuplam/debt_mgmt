export const FETCH_DEBTORS_START = 'FETCH_DEBTORS_START';
export const FETCH_DEBTORS_FAILURE = 'FETCH_DEBTORS_FAILURE';
export const FETCH_DEBTORS_SUCCESS = 'FETCH_DEBTORS_SUCCESS';


export function fetchDebtors() {
  return ({ fetch }) => ({
    type: 'FETCH_DEBTORS',
    payload: {
      promise: fetch('/api/v1/debtors/user')
        .then(response => response.json())
    }
  });
}
