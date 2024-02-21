import { safePerformanceTimeNow } from './datetime';

export interface IPromiseCacheStrategy {
  /**
   *       (ms), 0 ，
   */
  timeout: number;
  /**
   *       ，    ，  updateAt
   */
  useCreateTime?: boolean;
}
type PromiseCacheDateItem<T> = {
  createAt: number;
  p: Promise<T>;
  updateAt?: number;
  isSuccess?: boolean;
};

type PromiseCacheKeyType = string | number;
export default class PromiseCache {
  private _cache: {
    [key: string]: PromiseCacheDateItem<unknown>;
  } = {};

  /**
   *
   */
  private _strategy: IPromiseCacheStrategy;

  /**
   *
   * @param {{
   * timeout:number,
   * useCreateTime?:Boolean
   * }} strategy     ，
   */
  constructor(
    strategy: IPromiseCacheStrategy = {
      timeout: 0,
    }
  ) {
    this._strategy = strategy;
  }

  addPromiseCache<T>(key: PromiseCacheKeyType, p: Promise<T>) {
    const dtNow = safePerformanceTimeNow();
    const cacheItem = {
      p,
      createAt: dtNow,
      updateAt: null,
      isSuccess: null,
    } as PromiseCacheDateItem<T>;

    this._cache[key] = cacheItem;
    p.then(
      () => {
        cacheItem.isSuccess = true;
        cacheItem.updateAt = safePerformanceTimeNow();
      },
      () => {
        cacheItem.isSuccess = false;
        cacheItem.updateAt = safePerformanceTimeNow();
      }
    );
  }

  _isCacheItemTimeout<T>(
    cacheItem: PromiseCacheDateItem<T>,
    _strategy?: IPromiseCacheStrategy
  ) {
    const strategy = _strategy || this._strategy;
    if (strategy.timeout === 0) {
      return false;
    }
    if (!strategy.useCreateTime && !cacheItem.updateAt) {
      // promise    ，cache  timeout
      return false;
    }
    const mesureDt = strategy.useCreateTime
      ? cacheItem.createAt
      : cacheItem.updateAt;
    const dtNow = safePerformanceTimeNow();
    return mesureDt + strategy.timeout < dtNow;
  }

  /**
   *   Promise
   *
   * @param {*} key
   * @param {*} _strategy?
   */
  tryGetPromiseCache<T>(
    key: PromiseCacheKeyType,
    _strategy?: IPromiseCacheStrategy
  ) {
    const cacheItem = this._getCacheItem<T>(key);
    if (!cacheItem) {
      return;
    }
    if (this._isCacheItemTimeout(cacheItem, _strategy)) {
      return;
    }
    return cacheItem.p;
  }

  /**
   *   pending  promise,
   * @param key
   */
  tryGetPendingPromiseCache<T>(key: PromiseCacheKeyType) {
    const cacheItem = this._getCacheItem<T>(key);
    if (!cacheItem) {
      return;
    }
    if (cacheItem.updateAt == null) {
      //
      return cacheItem.p;
    }
  }

  /**
   *   Promise  ，    reject,   undefined
   * @param {*} key
   * @param {*} _strategy?
   */
  tryGetPromiseSuccessCache<T>(
    key: PromiseCacheKeyType,
    _strategy?: IPromiseCacheStrategy
  ) {
    const cacheItem = this._getCacheItem<T>(key);
    if (!cacheItem) {
      return;
    }
    if (this._isCacheItemTimeout(cacheItem, _strategy)) {
      return;
    }
    if (cacheItem.isSuccess === false) {
      return;
    }
    return cacheItem.p as Promise<T>;
  }

  _getCacheItem<T>(key: PromiseCacheKeyType) {
    return this._cache[key] as PromiseCacheDateItem<T>;
  }

  clearCacheItem(key: PromiseCacheKeyType) {
    delete this._cache[key];
  }

  /**
   *        promise
   */
  getCacheItemRawNoTimeout<T>(key: PromiseCacheKeyType) {
    const cacheItem = this._getCacheItem<T>(key);
    return {
      ...cacheItem,
    };
  }
}
