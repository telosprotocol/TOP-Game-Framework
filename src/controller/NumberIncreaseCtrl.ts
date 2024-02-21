import { getCurrentTimeStamp } from '@/utils/datetime';
import type { IStorageItemOperators } from './LocalStorage';
export interface INumberIncreaseOption {
  /**
   *  intervalSecond
   */
  intervalSecond: number;

  /**
   *
   */
  intervalDelta: number;
  // /**
  //  *
  //  */
  // intervalDeltas?: number

  /**
   *
   */
  baseTimeStamp: number;

  /**
   *
   */
  baseNumber: number;

  /**
   *
   */
  maxNumber?: number;

  /**
   *  perfanceNow
   */
  usePerfamanceNow?: boolean;

  /**
   *  cacheOperator，
   *
   * getValue ， < ，
   */
  cacheOperator?: IStorageItemOperators<number>;
}

/**
 *
 * ==  ，  or
 */
export default class NumberIncreaseCtrl {
  option: INumberIncreaseOption;

  constructor(option: INumberIncreaseOption) {
    this.option = option;
  }

  updateInfo(info: { baseTimeStamp: number; baseNumber: number }) {
    this.option.baseTimeStamp = info.baseTimeStamp;
    this.option.baseNumber = info.baseNumber;
  }

  private _getDeltaNumber(dtNow: number, startDt: number, baseNumber: number) {
    const { intervalDelta, intervalSecond } = this.option;
    let second = Math.floor((dtNow - startDt) / 1000);
    if (second < 0) {
      second = 0;
    }
    const toNumber =
      baseNumber + Math.floor(second / intervalSecond) * intervalDelta;
    return toNumber;
  }
  private _getValue() {
    const {
      baseNumber,
      baseTimeStamp,
      maxNumber,
      usePerfamanceNow = true,
    } = this.option;
    const dtNow = getCurrentTimeStamp(usePerfamanceNow);
    const toNumber = this._getDeltaNumber(dtNow, baseTimeStamp, baseNumber);
    if (maxNumber) {
      if (toNumber > maxNumber) {
        return maxNumber;
      }
    }
    // //
    // if (this._lastCnt > toNumber) {
    //   //  lastCnt
    //   return this.getDeltaNumber(dtNow, this._startDt, baseNumber)
    // }
    return toNumber;
  }

  /**
   *  value
   */
  private lastValue: number;

  private _tryInitLastValue() {
    const { cacheOperator } = this.option;
    if (cacheOperator && !this.lastValue) {
      //
      const cacheValue = cacheOperator.getItem();
      this.lastValue = cacheValue;
      return true;
    }
    return false;
  }
  getValue() {
    const { cacheOperator } = this.option;
    this._tryInitLastValue();
    const curValue = this._getValue();
    if (this.lastValue && curValue < this.lastValue) {
      return this.lastValue; //
    }
    if (cacheOperator && this.lastValue !== curValue) {
      cacheOperator.setItem(curValue);
    }
    this.lastValue = curValue;
    return curValue;
  }
}
