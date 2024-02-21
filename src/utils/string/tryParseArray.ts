import { trim } from 'lodash-es';

export function tryParseArray(strList: string) {
  if (!strList) {
    return;
  }
  const tstr = trim(strList);
  if (tstr[0] === '[' && tstr[tstr.length - 1] === ']') {
    try {
      return JSON.parse(strList) as string[];
    } catch (ex) {
      return [strList];
    }
  } else {
    return strList.split(',');
  }
}
export function tryParseArrayAndRemoveEmpty(strList: string) {
  const list = tryParseArray(strList);
  if (list) {
    return list.filter((item) => !!item);
  }
  return list;
}
