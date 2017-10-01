/**
 * Check the given value is set or not.
 */
export function isSet(val: {}): boolean {
  return !isNull(val)
}

/**
 * Check the given value is undefined or not.
 * Alternative for fallback idiom(`a = b || 'c'`)
 */
export function isNull(val: {}): boolean {
  return (val === null || val === undefined)
}
