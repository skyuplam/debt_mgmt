import { BaseError } from 'make-error';
import { notify } from '../../eventEmitter/eventEmitter';

class AuthorizationError extends BaseError {

  constructor(name, params = {}) {
    super(`AuthorizationError: ${JSON.stringify({ name, params })}`);
    this.name = name;
    this.params = params;

    notify({
      message: '沒有權限進行此操作',
      level: 'error',
      uid: 401
    });
  }

}


export default AuthorizationError;
