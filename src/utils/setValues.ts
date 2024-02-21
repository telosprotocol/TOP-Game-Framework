/**
 *
 * @param toVal
 * @param defaultValue
 */
export function getNotNullValue<T>(
  toVal: T | null | undefined,
  defaultValue?: T
) {
  if (toVal == null) {
    return defaultValue;
  } else {
    return toVal;
  }
}

/**
 *    oldValue     ，   newValue
 * @param oldValue
 * @param newVal
 * @returns
 */
export function getValuePreferOld<T>(
  oldValue: T | null | undefined,
  newVal: T
) {
  if (oldValue == null) {
    return newVal;
  }
  return oldValue;
}
