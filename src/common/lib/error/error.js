import AuthorizationError from './AuthorizationError';

export function translateHttpError(error, info) {
  switch (error.status) {
    case 401:
      return new AuthorizationError(info.action);
    default:
      return error;
  }
}
