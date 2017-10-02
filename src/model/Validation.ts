import {isNull} from '../helper/type';

/**
 * Parameter validation model
 */
export class Validation {
  private errorMessages: IErrorData = {}

  /**
   * hasError checks that validator has error or not.
   * @returns return true if error exists.
   */
  public hasError(): boolean {
    const err: {} = this.errorMessages
    if (err === null || err === undefined) {
      return false
    }

    return Object.keys(err).length > 0
  }

  /**
   * getErrors returns error messages.
   * @returns error message maps.
   */
  public getErrors(): {} {
    return this.errorMessages
  }

  /**
   * addError adds an error message.
   * @param key parameter key name.
   * @param message error message.
   */
  public addError(key: string, message: string): void {
    this.errorMessages[key] = message
  }

  /**
   * isNull validates val is null or undefined.
   * @param val parameter to validate.
   * @returns return true if `val` is null or undefined.
   */
  public isNull(val: {}): boolean {
    return isNull(val)
  }

  /**
   * isStringLength validates string value and its length.
   * @param val parameter to validate.
   * @param lengthFrom  minimum length. if 0 is given, null value is allowed.
   * @param lengthTo  maximum length.
   * @returns return true if `val` is valid.
   */
  public isStringLength(val: string, lengthFrom: number, lengthTo: number): boolean {
    if (isNull(val)) {
      return (lengthFrom === 0)
    } else if (val.length < lengthFrom) {
      return false
    } else if (val.length > lengthTo) {
      return false
    }

    return true
  }
}

interface IErrorData {
  [key: string]: string;
}
