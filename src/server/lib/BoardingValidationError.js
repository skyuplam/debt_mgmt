import { BaseError } from 'make-error';

export default class BoardingValidationError extends BaseError {

  constructor(name, params = {}) {
    super(`BoardingValidationError: ${JSON.stringify({ name, params })}`);
    this.name = name;
    this.params = params;
  }

}
