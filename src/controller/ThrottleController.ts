import { MS_MINUTE_5, MS_SECOND_3 } from '@/constants/time';
import { getCurrentTimeStamp } from '@/utils/datetime';
import { noop } from 'lodash-es';
import { MS_MINUTES_30 } from './../constants/time';
export interface IThrottleConfigBase {
  /**
   *  ，
   */
  maxCount: number;
  /**
   *
   */
  minIntervalMs: number;
  /**
   *
   */
  sleepIntervalMs: number;
}

export interface IUpdateConfigBase {
  /**
   *  （ms) ,
   *  ，
   */
  timeout: number;
}

export interface IThrottleConfig
  extends IThrottleConfigBase,
    IUpdateConfigBase {
  /**
   *  performace
   */
  usePerformaceTime?: boolean;
}

const DEFAULT_THROTTLE_CONFIG = {
  maxCount: 3,
  minIntervalMs: MS_SECOND_3,
  sleepIntervalMs: MS_MINUTE_5,

  usePerformaceTime: false,

  timeout: MS_MINUTES_30,
};
const LOG_TYPE = true;

/**
 *
 */
export default class ThrottleController {
  private _options: IThrottleConfig;

  private _name: string;
  constructor(name: string, options?: Partial<IThrottleConfig>) {
    this._name = name;

    this._options = { ...DEFAULT_THROTTLE_CONFIG, ...options };
  }

  private _updateCb: () => void = noop;
  init(updateCallback: () => void) {
    if (updateCallback) {
      this._updateCb = updateCallback;
    } else {
      this._updateCb = noop;
    }
  }

  //#region

  /**
   *
   */
  private errorCount = 0;

  /**
   *  http flag
   *  http ， curFlag ， （ ）
   */
  private curFlag: string = null;

  /**
   *
   */
  private curReqTime = 0;

  /**
   *
   */
  private _lastTimer: ReturnType<typeof setTimeout>;
  //#endregion

  /**
   *
   * @param promise  true: ,false:
   */
  setReqPromise(
    reqPromise: Promise<boolean>,
    data: {
      curFlag: string;
      dtNow?: number;
    }
  ) {
    this.setReqStart(data);
    reqPromise.then(
      (isOk) => {
        this.setReqEnd(isOk);
      },
      (_ex) => {
        this.setReqEnd(false);
      }
    );
  }

  setReqStart(data: { curFlag: string; dtNow?: number }) {
    const dtNow = data.dtNow || this.getTimeNow();
    this.curReqTime = dtNow;
    this.curFlag = data.curFlag;
  }

  private lastReqOkTime: number;
  setReqEnd(isOk: boolean) {
    if (isOk) {
      this.errorCount = 0;
      this.lastReqOkTime = this.getTimeNow();
    } else {
      this.errorCount++;
    }
  }

  getTimeNow() {
    return getCurrentTimeStamp(this._options.usePerformaceTime);
  }

  private getOption(
    customOption?: Partial<IThrottleConfigBase & IUpdateConfigBase>
  ) {
    if (customOption) {
      return {
        ...this._options,
        ...(customOption || {}),
      };
    }
    return this._options;
  }

  /**
   *  ( ， ， _updateCb)
   *
   * 1.  >maxCount,
   * 2.  ，
   * 2.  ， sleepIntervalMs
   * 3.  ， minIntervalMs
   */
  needThrottle(
    data: { curFlag: string; dtNow?: number },
    customOption?: Partial<IThrottleConfigBase & IUpdateConfigBase>
  ) {
    if (data.curFlag !== this.curFlag) {
      this.errorCount = 0;
    }
    if (this.curReqTime === 0) {
      return false;
    }
    const options = this.getOption(customOption);
    const dtNow = data.dtNow || this.getTimeNow();
    const intervalMs =
      this.errorCount > options.maxCount
        ? options.sleepIntervalMs
        : options.minIntervalMs;
    const delayTime = this.curReqTime + intervalMs - dtNow;
    if (delayTime > 0) {
      if (this._lastTimer) {
        clearTimeout(this._lastTimer);
      }
      if (LOG_TYPE && process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log(
          `[Throttle] [${this._name}] throttled delay=${delayTime}`,
          data.curFlag
        );
      }
      this._lastTimer = setTimeout(() => {
        if (LOG_TYPE && process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log(`[Throttle] [${this._name}] retry`, data.curFlag);
        }
        this._updateCb();
      }, delayTime);
      return true;
    } else {
      //
      return false;
    }
  }

  /**
   *  （ ， ）
   * @param data
   * @param customOption
   */
  needUpdateOnly(
    data: { curFlag: string; dtNow?: number },
    customOption?: Partial<IThrottleConfigBase & IUpdateConfigBase>
  ) {
    const dtNow = data.dtNow || this.getTimeNow();
    if (data.curFlag !== this.curFlag) {
      this.errorCount = 0;
      return true;
    } else {
      if (!this.lastReqOkTime) {
        return true;
      }
      //
      const options = this.getOption(customOption);
      const { timeout } = options;
      if (timeout != null) {
        if (this.lastReqOkTime + timeout < dtNow) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   *  （ ）
   * 1.  timeout
   * 2.  curFlag ，
   * 3.  needThrottle
   */
  needUpdateWithThrottle(
    data: { curFlag: string; dtNow?: number },
    customOption?: Partial<IThrottleConfigBase & IUpdateConfigBase>
  ) {
    const dtNow = data.dtNow || this.getTimeNow();
    data.dtNow = dtNow;
    const needRefresh = this.needUpdateOnly(data, customOption);

    if (needRefresh) {
      if (this.needThrottle(data, customOption)) {
        return false; // updateCb
      } else {
        return true;
      }
    }
    return false;
  }
}
