import { MS_DAY } from '../constants/time';
import LocalStorage from '../controller/LocalStorage';
import type { IBridgeResult } from './js_call_app.d';

const BRIDGE_CACHE_PREFIX = 'bridge_';

/**
 * bridge     cache(  30  )
 */
export default class BridgeCache {
  private static _ins: BridgeCache;
  static get Instance() {
    if (!BridgeCache._ins) {
      BridgeCache._ins = new BridgeCache();
    }
    return BridgeCache._ins;
  }

  private lc: LocalStorage;
  constructor() {
    this.lc = new LocalStorage({
      prefix: BRIDGE_CACHE_PREFIX,
      version: 2,
      timeout: MS_DAY,
    });
  }

  getCache<T>(handlerName: string) {
    return this.lc.getItem<IBridgeResult<T>>(handlerName);
  }

  setCache<T>(handlerName: string, json: IBridgeResult<T>) {
    this.lc.setItem<IBridgeResult<T>>(handlerName, json);
  }
}
