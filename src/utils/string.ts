import { trim } from 'lodash-es';

export function stringTrim(str: string) {
  return trim(str);
}

export function hextoString(hex: string) {
  const arr = hex.split('');
  let out = '';
  let tmp = '';
  // let charValue = ''
  // for (let i = 0; i < arr.length / 2; i++) {
  //   tmp = '0x' + arr[i * 2] + arr[i * 2 + 1]
  //   charValue = String.fromCharCode(parseInt(tmp))
  //   out += charValue
  // }
  // return out

  for (let i = 0; i < arr.length / 2; i++) {
    tmp = '%' + arr[i * 2] + arr[i * 2 + 1];
    out += tmp;
  }
  return decodeURI(out);
}

/**
 *
 * @param integarNum
 */
export function formatNum(
  integarNum: number | string,
  separator?: string | boolean
) {
  let s = String(integarNum);
  if (separator === '') {
    return s;
  }
  if (s.length < 4) return s;
  let sign = '';
  if (s[0] === '-') {
    sign = '-';
    s = s.substring(1);
  }
  const strSeparator = typeof separator === 'string' ? separator : ',';
  for (let i = s.length - 3; i > 0; i -= 3) {
    s = s.slice(0, i) + strSeparator + s.slice(i);
  }
  return sign + s;
}

export interface IFormatFloatOptionBase {
  /**
   *     ,   1
   */
  precision?: number;

  /**
   *      0   ，  false
   */
  reserveZeroDecimal?: boolean;

  // /**
  //  *       ，    false
  //  */
  // truncate?: boolean;

  /**
   *       ， true
   */
  round?: boolean;
}

/**
 *       option
 */
export interface IFormatLangOption {
  /**
   *    ,   ','
   */
  separator?: string;

  /**
   *    ,   '.'
   */
  decimalMark?: string;
}
export type IFormatFloatOption = IFormatFloatOptionBase & IFormatLangOption;

/**
 *
 * @param num
 * @param precision，     [0,x]
 * @returns
 */
export function getTruncateNum(num: number, precision: number) {
  const [integerPart, _decimalPart] = num.toFixed(precision + 1).split('.');
  if (precision === 0) {
    return integerPart;
  }
  if (!_decimalPart || _decimalPart.length < precision) {
    //
    return num.toFixed(precision);
  }

  //
  const decimalPart = _decimalPart.substring(0, precision); //0.02  ==>2
  return integerPart + '.' + decimalPart;
}
/**
 *      ，       ，    {separator = ',', decimalMark = '.', decimalDigits = 2, reserveZeroDecimal = false}
 * @param num  :      ， ，num     .
 * @param options
 * @returns
 */
export function formatFloatBase(num: number, options?: IFormatFloatOption) {
  const {
    separator = ',',
    decimalMark = '.',
    precision = 1,
    reserveZeroDecimal = false,
    round,
  } = options || {};
  if (num == null || isNaN(num)) {
    return '';
  }
  if (typeof num === 'string') {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      throw new Error('formatFloat not allow string!!');
    } else {
      num = Number(num);
    }
  }
  //typeof num === 'string' ? num :
  const numStr = round
    ? num.toFixed(precision)
    : getTruncateNum(num, precision);

  const [integerPart, _decimalPart] = numStr.split('.');
  let decimalPart = _decimalPart;
  if (precision) {
    //   string
    decimalPart = decimalPart.substr(0, precision);
  }
  const strList = [formatNum(integerPart, separator)];
  if (reserveZeroDecimal) {
    if (precision) {
      strList.push(decimalPart);
    }
  } else {
    if (decimalPart) {
      let notZeroIdx = -1;
      for (let i = decimalPart.length - 1; i >= 0; i--) {
        const dItem = decimalPart[i];
        if (dItem !== '0') {
          notZeroIdx = i;
          break;
        }
      }
      if (notZeroIdx >= 0) {
        strList.push(decimalPart.slice(0, notZeroIdx + 1));
      }
    }
  }
  return strList.join(decimalMark);
}

//#region

type IKMGT_SIGN = 'K' | 'M' | 'G' | 'T';
type NUMSHORTEN_OPTION_ITEM = {
  sign: '' | IKMGT_SIGN;
  len: number;
  ratio: number;
  round: boolean;
  isLast?: boolean;
};
const NUM_SHORTEN_LIST = (
  [
    { sign: '', len: 0, ratio: 1, round: false },
    { sign: 'K', len: 3, ratio: 1, round: false },
    { sign: 'M', len: 6, ratio: 1, round: false },
    { sign: 'G', len: 9, ratio: 1, round: false },
    { sign: 'T', len: 12, ratio: 1, round: false, isLast: true },
  ] as NUMSHORTEN_OPTION_ITEM[]
).map((item) => {
  return {
    ...item,
    ratio: Math.pow(10, item.len),
  };
});

/**
 *
 * @param intPartRaw
 * @returns
 */
function _getIntPartNumLength(intPartRaw: string) {
  return intPartRaw.length - (intPartRaw[0] === '-' ? 1 : 0);
}
/**
 *
 * 1).  999999   K M B T(     rb,jt,B,T）   ，        ，(       )
 * 2).      K M B T            ，           ，      0， 12,000,000        M
 * 3).      2   ，       1   。 12,345,678，   12.34M
 * 4).     0   ，  123001200，   123M
 * @param num
 * @param maxLength
 * @param maxPrecision       (     )
 * @param langOption
 * @returns
 */
export function formatNumberInAbbreviationBase(
  num: number,
  maxLength: number,
  maxPrecision: number,
  langOption: IFormatLangOption & {
    KMGT: {
      K: string;
      M: string;
      G: string;
      T: string;
    };
    maxKMGT?: IKMGT_SIGN; //       T
  }
) {
  const { KMGT, maxKMGT, ...baseLangOption } = langOption;
  //     ，
  const [intPartRaw] = String(num).split('.');
  /**
   *      (     )
   */
  const rawIntlen = _getIntPartNumLength(intPartRaw);
  let shortenItem = NUM_SHORTEN_LIST[0];
  if (rawIntlen > maxLength) {
    for (let i = 1; i < NUM_SHORTEN_LIST.length; i++) {
      const curShortenItem = NUM_SHORTEN_LIST[i];
      if (curShortenItem.len >= rawIntlen) {
        break;
      }
      shortenItem = curShortenItem;
      if (curShortenItem.sign === maxKMGT) {
        break;
      }
    }
  }
  const newNum = Number(num / shortenItem.ratio);
  const shortenIntLen =
    shortenItem.ratio === 1
      ? rawIntlen
      : _getIntPartNumLength(String(newNum).split('.')[0]);
  // const leftPrecision = Math.max(maxLength - shortenIntLen, 0);
  //
  const precision = shortenItem.sign
    ? 2
    : Math.min(Math.max(maxLength - shortenIntLen, 0), maxPrecision);
  const shortenSign = shortenItem.sign ? KMGT[shortenItem.sign] : '';
  return (
    formatFloatBase(newNum, {
      precision: precision,
      reserveZeroDecimal: false,
      round: shortenItem.round,
      ...baseLangOption,
    }) + shortenSign
  );
}

//#endregion

export function toFixed(num: number, precision: number, isGreedy: boolean) {
  const moneyStr = num.toFixed(precision);
  if (!isGreedy) {
    let endIdx = moneyStr.length;
    for (let i = moneyStr.length - 1; i >= 0; i--) {
      const char = moneyStr[i];
      if (char === '0') {
        endIdx = i;
      } else if (char === '.') {
        endIdx = i;
        break;
      } else {
        break;
      }
    }
    return moneyStr.substring(0, endIdx);
  }
  return moneyStr;
}

export function paddingLeft(str: string, length: number, padChar: string) {
  str = str || '';
  while (str.length < length) {
    str = padChar + str;
  }
  return str;
}

export function paddingRight(str: string, length: number, padChar: string) {
  str = str || '';
  while (str.length < length) {
    str += padChar;
  }
  return str;
}

export function numToString(num?: number, nullStr?: string) {
  if (typeof num === 'number') {
    return `${num}`;
  }
  return nullStr || '--';
}

/**
 *     float         （ android   ）
 * @param num
 * @returns
 */
export function convertNumToFloatString(num: number) {
  const strNum = num + '';
  if (strNum.indexOf('.') > -1) {
    return strNum;
  } else {
    return strNum + '.0';
  }
}

export function getFirstString(str?: string | string[] | null) {
  if (str == null) {
    return str as null;
  }
  if (typeof str === 'object') {
    return str[0];
  }
  return str + '';
}

/**
 *     str(     )
 * @param str
 * @returns
 */
export function convertStrToHtml(
  str: string,
  options?: { whitespace?: boolean }
) {
  const { whitespace } = options || {};
  let str1 = (str || '').replace(/\n/g, '<br/>');
  if (whitespace) {
    str1 = str1.replace(/ /g, '&nbsp;');
  }
  return str1;
}

/**
 * str     ， splitChar partCount ，      splitChar
 * @param str
 * @param splitChar
 * @param partCount
 * @returns
 */
export function splitStrIntoParts(
  str: string,
  splitChar: string,
  partCount: number
) {
  const parts: string[] = [];
  let startIdx = 0;
  for (let i = 0; i < partCount; i++) {
    const endIdx = i === partCount - 1 ? -1 : str.indexOf(splitChar, startIdx);
    if (endIdx === -1) {
      parts.push(str.substring(startIdx));
      return parts;
    } else {
      parts.push(str.substring(startIdx, endIdx));
    }
    startIdx = endIdx + 1;
  }
  return parts;
}

/**
 *
 * @param str
 * @param fieldName：    ，    {FIELDNAME}
 * @param toValue
 * @returns
 */
export function replaceFieldAll(
  str: string,
  fieldName: string,
  toValue: string
) {
  if (!str) {
    return str;
  }
  const reg = new RegExp(`{${fieldName}}`, 'g');
  return str.replace(reg, toValue);
}

/**
 *
 * 1.        ID  /3（    ， 8        3），    5。
 * 2.    ID≥15     ，     ID 5      5   ，       5 “*”
 * 3.    ID≤15      ，*     ≥*
 *
 * 1   ID”a“，   "a"
 * 2   ID“ab”，   “ a* ”
 * @param str
 * @returns
 */
export function stringShield(str: string, isShort?: boolean) {
  if (!str) {
    return '';
  }
  const strLength = str.length;
  if (strLength === 1) {
    return str;
  }
  if (strLength > 15) {
    //, maxLength = 15
    return str.slice(0, 5) + (isShort ? '***' : '*****') + str.slice(-5);
  } else {
    const nonStarChars = Math.floor((2 / 3) * strLength);
    const starCount = Math.min(strLength - nonStarChars, isShort ? 3 : 5);
    const startCharCount = Math.ceil(nonStarChars / 2);
    const endCharCount = nonStarChars - startCharCount;
    const endIndex = strLength - endCharCount;
    return (
      str.slice(0, startCharCount) + '*'.repeat(starCount) + str.slice(endIndex)
    );
  }
}
