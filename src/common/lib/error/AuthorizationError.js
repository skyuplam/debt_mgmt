import { BaseError } from 'make-error';

class AuthorizationError extends BaseError {

  constructor(name, params = {}) {
    super(`AuthorizationError: ${JSON.stringify({ name, params })}`);
    this.name = name;
    this.params = params;
  }

}


export default AuthorizationError;
