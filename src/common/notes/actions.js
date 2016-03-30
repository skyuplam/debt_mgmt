export const FETCH_NOTES_START = 'FETCH_NOTES_START';
export const FETCH_NOTES_FAILURE = 'FETCH_NOTES_FAILURE';
export const FETCH_NOTES_SUCCESS = 'FETCH_NOTES_SUCCESS';
export const ADD_NEW_NOTE_START = 'ADD_NEW_NOTE_START';
export const ADD_NEW_NOTE_FAILURE = 'ADD_NEW_NOTE_FAILURE';
export const ADD_NEW_NOTE_SUCCESS = 'ADD_NEW_NOTE_SUCCESS';


const API_VERSION = '/api/v1';


export function fetchNotes(locParams) {
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/debtors/${locParams.params.id}/notes`,
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
      type: 'FETCH_NOTES',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function addNewNote(note) {
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/debtors/${note.debtorId}/notes`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
          });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw error;
      }
    }
    return {
      type: 'ADD_NEW_NOTE',
      payload: {
        promise: getPromise()
      }
    };
  };
}
