import * as path from 'path';

let production: boolean;
let debug: boolean;

/**
 * init setup current environment.
 * @param isProd production flag
 * @param isDebug debug flag
 */
export function init(isProd: boolean, isDebug: boolean): void {
  production = isProd;
  debug = isDebug;
}

/**
 * isProd checks if current environment is production.
 * @return production flag
 */
export function isProd(): boolean {
  return production;
}

/**
 * isDebug checks if current environment is debug.
 * @return debug flag
 */
export function isDebug(): boolean {
  return debug;
}

/**
 * logDebug logs application debug info. (only shown in non-production env)
 * @param val debug message.
 */
export function logDebug(val: {}): void {
  if (production) {
    return
  }

  const maxSize: number = 300
  const time: string = (new Date()).toLocaleTimeString()
  let msg: string = `[DEBUG] [${time}] ${val}`
  if (msg.length > maxSize) {
    msg = `${msg.substr(0, maxSize)}...`
  }
  console.log(msg)
}

/**
 * logError logs application error.
 * @param val error data or message.
 */
export function logError(val: {}): void {
  const time: string = (new Date()).toLocaleTimeString()
  console.error(`[ERROR] [${time}] ${JSON.stringify(val)}`)
}

/**
 * isSet checks the given value is set or not.
 * @param val parameter to validate.
 * @returns return true if `val` is not null nor undefined.
 */
export function isSet(val: {}): boolean {
  return !isNull(val)
}

/**
 * isNull checks the given value is undefined or not.
 * Alternative for fallback idiom(`a = b || 'c'`)
 * @param val parameter to validate.
 * @returns return true if `val` is null or undefined.
 */
export function isNull(val: {}): boolean {
  return (val === null || val === undefined)
}

/**
 * Dummy JSON data for API response.
 */
export const dummyDataPath: string = path.join(__dirname, '..', '..', '..', 'dummy_data') + path.sep
