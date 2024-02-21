import { safePerformanceTimeNow } from '../utils/datetime';

type ILockItem = {
  /**
   *
   */
  nextDt: number;
};

export const BUTTON_LOCK_TYPE = {
  /**
   *
   *           ，            ，
   */
  NAV: 'NAV',

  /**
   *     ，  1s
   */
  NORMAL: 'NORMAL',
};
export default class ButtonLockController {
  private static _Ins: ButtonLockController;
  static get Instance() {
    if (!ButtonLockController._Ins) {
      ButtonLockController._Ins = new ButtonLockController();
    }
    return ButtonLockController._Ins;
  }
  private constructor() {}

  /**
   * lock
   * key: lockName
   */
  private _lockMap: Record<string, ILockItem> = {};

  private _getOrCreateLockItem(lockName: string) {
    const item = this._lockMap[lockName];
    if (item) {
      return item;
    }
    const itemNew: ILockItem = {
      nextDt: 0,
    };
    this._lockMap[lockName] = itemNew;
    return itemNew;
  }

  private setIsLock(lockName: string, isLock: boolean, lockSecond = 1) {
    const lockItem = this._getOrCreateLockItem(lockName);
    if (isLock) {
      lockItem.nextDt = safePerformanceTimeNow() + lockSecond * 1000;
    } else {
      lockItem.nextDt = 0;
    }
  }

  /**
   *
   * @param lockName
   * @returns
   */
  private isLockItemLocked(lockName: string) {
    const item = this._lockMap[lockName];
    if (item) {
      if (item.nextDt === 0) {
        return false;
      }
      return item.nextDt > safePerformanceTimeNow();
    }
    return false;
  }

  /**
   *
   * @param key
   * @param lockSecond      (  s)
   * @returns
   */
  tryGetLock(lockName: string, lockSecond?: number) {
    const isLocked = this.isLockItemLocked(lockName);
    if (isLocked) {
      console.warn(
        '[Lock]',
        lockName,
        'operator is canceled because button is locked'
      );
      return false;
    }
    this.setIsLock(lockName, true, lockSecond);
    return true;
  }

  /**
   *
   * @param lockSecond   3s (  s)
   * @returns
   */
  tryGetNavLock(lockSecond = 2) {
    return this.tryGetLock(BUTTON_LOCK_TYPE.NAV, lockSecond);
  }

  /**
   *
   * @param lockSecond   1s (  s)
   * @returns
   */
  tryGetNormalLock(lockSecond = 1) {
    return this.tryGetLock(BUTTON_LOCK_TYPE.NORMAL, lockSecond);
  }
}
