import LocalStorage, { ILocalStorageItemOption } from './LocalStorage';

const DEFAULT_TIMEOUT_MS = 60 * 60 * 1000; // 60

export class HttpLocalStorage extends LocalStorage {
  static _Instance: HttpLocalStorage;

  static get Instance() {
    if (!HttpLocalStorage._Instance) {
      HttpLocalStorage._Instance = new HttpLocalStorage({
        prefix: 'HTTP_',
        version: 2,
        async: true,
        timeout: DEFAULT_TIMEOUT_MS,
      });
    }
    return HttpLocalStorage._Instance;
  }

  private _convertRequestToKey(urlPath: string, paramKey: string) {
    return `${urlPath || ''}_${paramKey || ''}`; //.replace(/[:/?&]/g, '|')
  }

  private _convertRequestToKey2(
    urlPath: string,
    param: { [key: string]: number | string }
  ) {
    const paramList: string[] = [];
    Object.keys(param || {})
      .sort()
      .forEach((key) => {
        const v = param[key];
        if (v != null) {
          paramList.push(`${key}=${v}`);
        }
      });
    return this._convertRequestToKey(urlPath, paramList.join('&'));
  }

  getCache<T>(
    urlPath: string,
    param: { [key: string]: number | string },
    options?: ILocalStorageItemOption
  ) {
    const k = this._convertRequestToKey2(urlPath, param);
    return this.getItem<T>(k, options);
  }

  setCache<T>(
    urlPath: string,
    param: { [key: string]: number | string },
    value: T,
    options?: ILocalStorageItemOption
  ) {
    const k = this._convertRequestToKey2(urlPath, param);
    return this.setItem(k, value, options);
  }

  removeCache(urlPath: string, param: { [key: string]: number | string }) {
    const k = this._convertRequestToKey2(urlPath, param);
    this.removeItem(k);
  }
}
