/**
 *      Token format
 */

import {
  formatFloatG,
  formatNumberInAbbreviation,
} from '@/store/modules/universe/universe';
import type { IFormatFloatOption } from '@/utils/string';
import type { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';

export function formatVGold(num: number, _option?: IFormatFloatOption) {
  let rOption = {
    precision: 0,
    reserveZeroDecimal: false,
  };
  if (_option) {
    rOption = {
      ...rOption,
      ..._option,
    };
  }
  return formatFloatG(num, rOption);
}

/**
 * VToken
 * @param num
 * @param _option
 * @returns
 */
export function formatVToken(num: number, _option?: IFormatFloatOption) {
  let rOption = {
    precision: 6,
    reserveZeroDecimal: false,
  };
  if (_option) {
    rOption = {
      ...rOption,
      ..._option,
    };
  }
  return formatFloatG(num, rOption);
}

export function formatAssetByType(num: number, coinType: VCoinEnum) {
  if (coinType === 'GOLD') {
    return formatVGold(num);
  } else {
    return formatVToken(num);
  }
}
export function formatVRp(num: number) {
  return formatFloatG(num, { precision: 0, reserveZeroDecimal: false });
}

/**
 *
 * @param num
 * @returns
 */
export function formatVGold2(num: number) {
  return formatNumberInAbbreviation(num, 6, 0);
}

/**
 * Rp
 * @param num
 * @returns
 */
export function formatVRp2(num: number) {
  return formatNumberInAbbreviation(num, 6, 0);
}

/**
 * vToken     ,  ：99,999.9jt
 * @param num
 * @returns
 */
export function formatVToken2(num: number) {
  return formatNumberInAbbreviation(num, 6, 6);
}
