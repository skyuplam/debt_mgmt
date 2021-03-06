import { translateHttpError } from '../lib/error/error';
import FormData from 'form-data';

export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const UPLOAD_START = 'UPLOAD_START';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';

const API_VERSION = '/api/v1';

export function upload(files, user) {
  const Authorization = `?access_token=${user.token}`;
  const form = new FormData();
  files.forEach(file => {
    form.append('boarding', file);
  });
  return ({ fetch }) => {
    const getPromise = async () => {
      try {
        // Sure we can use smarter api than raw fetch.
        const response = await fetch(`${API_VERSION}/upload/boarding${Authorization}`, {
          method: 'POST',
          body: form
        });
        if (response.status !== 202) throw response;
        // Return JSON response.
        return response.json();
      } catch (error) {
        // Transform error status to custom error.
        if (error.status === 401) {
          throw translateHttpError(error, { action: 'upload' });
        }
        throw error;
      }
    };

    return {
      type: 'UPLOAD',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function uploadPlacement(files, user) {
  const Authorization = `?access_token=${user.token}`;
  const form = new FormData();
  files.forEach(file => {
    form.append('placement', file);
  });
  return ({ fetch }) => {
    const getPromise = async () => {
      try {
        // Sure we can use smarter api than raw fetch.
        const response = await fetch(`${API_VERSION}/upload/placement${Authorization}`, {
          method: 'POST',
          body: form
        });
        if (response.status !== 202) throw response;
        // Return JSON response.
        return response.json();
      } catch (error) {
        // Transform error status to custom error.
        if (error.status === 401) {
          throw translateHttpError(error, { action: 'upload' });
        }
        throw error;
      }
    };

    return {
      type: 'UPLOAD',
      payload: {
        promise: getPromise()
      }
    };
  };
}
