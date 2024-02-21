export function padStart(str: string, len: number, prefixChar: string) {
  let result = str;
  while (result.length < len) {
    result = prefixChar + result;
  }
  return result;
}
