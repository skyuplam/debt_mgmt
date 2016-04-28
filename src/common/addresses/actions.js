export const FETCH_ADDRESSES_START = 'FETCH_ADDRESSES_START';
export const FETCH_ADDRESSES_ERROR = 'FETCH_ADDRESSES_ERROR';
export const FETCH_ADDRESSES_SUCCESS = 'FETCH_ADDRESSES_SUCCESS';
export const ADD_NEW_ADDRESS_START = 'ADD_NEW_ADDRESS_START';
export const ADD_NEW_ADDRESS_ERROR = 'ADD_NEW_ADDRESS_ERROR';
export const ADD_NEW_ADDRESS_SUCCESS = 'ADD_NEW_ADDRESS_SUCCESS';


const API_VERSION = '/api/v1';


export function fetchAddresses(locParams, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/debtors/${locParams.params.id}/addresses`,
          {
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization
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

export function addNewAddress(address, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/debtors/${address.debtorId}/addresses`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization
            },
            body: JSON.stringify(address)
          });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw error;
      }
    }
    return {
      type: 'ADD_NEW_ADDRESS',
      payload: {
        promise: getPromise()
      }
    };
  };
}
