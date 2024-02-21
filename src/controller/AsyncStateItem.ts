import { EventEmitter } from './EventEmitter';

/**
 *  undefined ，
 */
export type IGetValue<T> = () => Promise<T | undefined>;
const IS_CANCELED_KEY = 'isCanceled';

function isPromiseCanceled(p: Promise<any>) {
  if (p && (p as any)[IS_CANCELED_KEY]) {
    return true;
  }
  return false;
}

export type IAsyncStateRef<T, TError = unknown> = {
  /**
   *  ( )
   */
  current?: T | null;

  /**
   *
   */
  status?: 'loading' | 'error' | 'ok' | '';

  /**
   *
   */
  err?: TError | null;

  /**
   *  ( )
   */
  lastSetDt: number;

  /**
   *  （ createHttpAsyncStateItem ）
   */
  lastServerDt?: number;
};
export const AsyncStateChangedEvent = 'updated';
export const AsyncStateErrorEvent = 'error';

export enum AsyncTryUpdateMode {
  /**
   *
   */
  NewAsync = 0,
  /**
   *  （timeout ）
   */
  UseCache = 1,
  /**
   *
   */
  UseProcessing = 2,
}

function createResult<T, TError>(
  mode: AsyncTryUpdateMode,
  hasError: boolean,
  dataOrError: T | TError
) {
  if (hasError) {
    return {
      mode,
      ok: !hasError,
      error: dataOrError,
    } as IAsyncTryUpdateResult<T, TError>;
  } else {
    return {
      mode,
      ok: !hasError,
      result: dataOrError,
    } as IAsyncTryUpdateResult<T, TError>;
  }
}
export interface IAsyncTryUpdateResult<T, TError = Error> {
  mode: AsyncTryUpdateMode;
  ok: boolean;
  error: TError;
  result: T;
}
/**
 *
 */
export default class AsyncStateItem<
  T,
  TCustomData = undefined,
  TError = Error
> extends EventEmitter {
  ref: IAsyncStateRef<T, TError>;
  currentPromise?: Promise<T | undefined>;
  logName = ''; //logName

  on(eventName: typeof AsyncStateErrorEvent, cb: (err: TError) => void): this;
  on(eventName: typeof AsyncStateChangedEvent, cb: (res: T) => void): this;
  on(eventName: string, cb: any) {
    return super.on(eventName, cb);
  }
  on2(
    eventName: typeof AsyncStateErrorEvent,
    cb: (err: TError) => void
  ): (err: TError) => void;
  on2(
    eventName: typeof AsyncStateChangedEvent,
    cb: (res: T) => void
  ): (res: T) => void;
  on2(eventName: string, cb: any) {
    return super.on2(eventName, cb) as typeof cb;
  }
  /**
   *  ,
   */
  custom: TCustomData;

  // private _lastGetDt = 0;
  private _updateValue: IGetValue<T>;

  /**
   *
   * @param updateValue then current, ， ex
   * @param defaultValue current
   */
  constructor(updateValue: IGetValue<T>, defaultValue?: T, logName?: string) {
    super();
    this.logName = logName;
    this.ref = { current: defaultValue, lastSetDt: 0, status: '' };
    this._updateValue = updateValue;
    if (defaultValue !== undefined) {
      if (typeof defaultValue === 'function') {
        this.ref.current = defaultValue();
      } else {
        this.ref.current = defaultValue;
      }
    }
  }

  /**
   *  （ ）
   * @returns
   */
  cancel() {
    const curPromise = this.currentPromise;
    if (curPromise) {
      if (isPromiseCanceled(curPromise)) {
        return;
      }
      (curPromise as any)[IS_CANCELED_KEY] = true;
      this.currentPromise = undefined;
    }
  }

  protected execUpdateValue() {
    return this._updateValue();
  }

  /**
   *  （ ）
   *  ： 、 、 lastSetDt， emit
   * @param res
   */
  setSuccessResult(res: T) {
    this.ref.status = 'ok';
    this.ref.err = null;
    this.ref.current = res;
    this.ref.lastSetDt = new Date().getTime();
    this.emit(AsyncStateChangedEvent, res);
  }

  clearResult() {
    this.ref.lastSetDt = 0;
    this.ref.current = null;
    this.ref.err = null;
    this.ref.status = '';
  }

  /**
   *  ，
   * @param delayFunc ref delay(for  )
   * @returns
   */
  update(delayFunc?: (newRes: T, oldRes?: T) => Promise<void>) {
    // this._lastGetDt = new Date().getTime();
    this.ref.status = 'loading';
    const curValuePromise = this.execUpdateValue()
      .then(async (res) => {
        if (isPromiseCanceled(curValuePromise)) {
          return;
        }
        if (delayFunc) {
          await delayFunc(res, this.ref.current);
        }
        if (curValuePromise === this.currentPromise) {
          this.currentPromise = undefined;
        }
        this.setSuccessResult(res);
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log(
            '[AsyncState] current updated',
            this.logName,
            this.ref.current
          );
        }
        return res;
      })
      .catch((_ex) => {
        this.ref.status = 'error';
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[AsyncState] UpdateError', this.logName, _ex);
        }
        this.ref.err = _ex;
        //
        if (curValuePromise === this.currentPromise) {
          this.currentPromise = undefined;
        }
        this.emit(AsyncStateErrorEvent, _ex as TError);
        throw _ex;
      });
    this.currentPromise = curValuePromise;
    return curValuePromise;
  }

  /**
   *  ， ，
   * @param timeout  ，0:  ， ， 0 ： ， set <timeout
   *  ex
   */
  tryUpdate<TCustomError = TError>(timeout: number) {
    if (this.currentPromise) {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log(
          '[AsyncState] currentPromise is not finished,use currentPromise',
          this.logName
        );
      }
      //
      return this.currentPromise
        .then((res) => {
          return createResult<T, TCustomError>(
            AsyncTryUpdateMode.UseProcessing,
            false,
            res
          );
        })
        .catch((ex) => {
          return createResult<T, TCustomError>(
            AsyncTryUpdateMode.UseProcessing,
            true,
            ex
          );
        });
    }
    if (timeout) {
      const dtNow = new Date().getTime();
      const spanMs = dtNow - (this.ref.lastSetDt || 0);
      if (spanMs < timeout) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log(
            '[AsyncState] last value is not timeouted',
            `${spanMs}ms<${timeout}`,
            this.logName
          );
        }

        return Promise.resolve(
          createResult<T, TCustomError>(
            AsyncTryUpdateMode.UseCache,
            false,
            this.ref.current
          )
        );
      }
    }
    return this.update()
      .then((res) => {
        return createResult<T, TCustomError>(
          AsyncTryUpdateMode.NewAsync,
          false,
          res
        );
      })
      .catch((ex) => {
        return createResult<T, TCustomError>(
          AsyncTryUpdateMode.NewAsync,
          true,
          ex
        );
      });
  }

  /**
   *  ，
   */
  getValue() {
    if (this.ref.current) {
      return Promise.resolve(this.ref.current);
    }
    if (this.currentPromise) {
      return this.currentPromise;
    }
    return this.update();
  }
}

export function dealHttpResponse<T>(res: IHttpVResponse<T>) {
  if (res && ((res as any).Result === 1 || res.success)) {
    return res.data;
  } else {
    throw res;
  }
}
export function createHttpAsyncStateItem<T, TCustomData = undefined>(
  updateValue: IGetValue<IHttpVResponse<T>>,
  defaultValue?: T,
  logName?: string
) {
  const stateItem = new AsyncStateItem<T, TCustomData, IHttpResponse<T>>(
    function updateValueWrap() {
      return updateValue().then((res) => {
        if (res && ((res as any).Result === 1 || res.success)) {
          stateItem.ref.lastServerDt = res.servertime;
          return res.data;
        }
        throw res;
      });
    },
    defaultValue,
    logName
  );
  return stateItem;
}

export function getClientTimestampByAsyncStateItemRef<T>(
  serverTimeStamp: BigDecimalString | number | undefined,
  stateItemRef: IAsyncStateRef<T, IHttpResponse<T>>,
  ignoreMaxTimestamp?: boolean
) {
  if (!serverTimeStamp) {
    return 0;
  }
  const iTimeStamp = Number(serverTimeStamp);
  if (isNaN(iTimeStamp)) {
    return 0;
  }
  if (ignoreMaxTimestamp) {
    if (iTimeStamp > 5302793430000) {
      return 0;
    }
  }
  return iTimeStamp - stateItemRef.lastServerDt + stateItemRef.lastSetDt;
}
