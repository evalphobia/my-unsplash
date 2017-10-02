/**
 * Check the given value is set or not.
 * @param val parameter to validate.
 * @returns return true if `val` is not null nor undefined.
 */
export function isSet(val: {}): boolean {
  return !isNull(val)
}

/**
 * Check the given value is undefined or not.
 * Alternative for fallback idiom(`a = b || 'c'`)
 * @param val parameter to validate.
 * @returns return true if `val` is null or undefined.
 */
export function isNull(val: {}): boolean {
  return (val === null || val === undefined)
}
