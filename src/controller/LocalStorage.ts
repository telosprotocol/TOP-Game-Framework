import { safePerformanceTimeNow } from '@/utils/datetime';
import { splitStrIntoParts } from '@/utils/string';
interface ILocalStorageItemOptionNormal {
  /**
   *
   * @default 0
   */
  version: number;

  /**
   *  ( ms)
   *  0 ， ，
   * @default 0
   */
  timeout: number;
}

interface ILocalStorageOption extends ILocalStorageItemOptionNormal {
  /**
   * cache
   *  VD1_
   * @default: VD1_
   */
  prefix: string;

  /**
   *  （ ）
   */
  async: boolean;
}

export type ILocalStorageItemOption = Partial<ILocalStorageItemOptionNormal>;

type ILocalStorageDataItemParsed<T> = {
  /**
   *  ， ，
   *  timeout,
   */
  overtime?: number;

  /**
   *
   * @default 0
   */
  createAt: number;

  /**
   *
   */
  version: number;

  data: T;
};

type ILocalStorageDataItemNotParsed = {
  /**
   *  ， ，
   *  timeout,
   */
  overtime?: number;

  /**
   *
   * @default 0
   */
  createAt: number;

  /**
   *
   */
  version: number;

  rawData: string;
};
const TAG = '[LocalStorage]';
type ILocalStorageDataItem<T> =
  | ILocalStorageDataItemNotParsed
  | ILocalStorageDataItemParsed<T>;
export interface IStorageItemOperators<T> {
  getItem: (options?: ILocalStorageItemOption) => T;
  setItem: (
    value: T,
    options?: ILocalStorageItemOption
  ) => boolean | Promise<boolean>;
  setItemSync: (value: T, options?: ILocalStorageItemOption) => boolean;
  setItemAsync: (
    value: T,
    options?: ILocalStorageItemOption
  ) => Promise<boolean>;
  removeItem: () => void;
}

/**
 *
 */
export default class LocalStorage {
  /**
   * cache
   */
  private options: ILocalStorageOption;

  /**
   *
   * @param prefix cache
   */
  constructor(options: Partial<ILocalStorageOption>) {
    this.options = {
      prefix: options.prefix || 'VD1_',
      version: options.version || 0,
      timeout: options.timeout || 0,
      async: !!options.async,
    };
  }

  private __convertKey(key: string) {
    return `${this.options.prefix}${key}`;
  }

  private __convertItemOption(options?: ILocalStorageItemOption) {
    const baseOpt = this.options;
    const res: ILocalStorageItemOption = {
      version: baseOpt.version,
      timeout: baseOpt.timeout,
    };
    if (options) {
      for (const key in res) {
        const newV = options[key as keyof ILocalStorageItemOption];
        if (newV != null) {
          res[key as keyof ILocalStorageItemOption] = newV;
        }
      }
    }
    return res;
  }

  /**
   *
   * @param k string
   * @param v string
   * @returns true: |false
   */
  private _setItem(k: string, v: string, async: boolean) {
    if (async) {
      return Promise.resolve(true).then(() => {
        return setItemSync(k, v);
      });
    } else {
      return setItemSync(k, v);
    }

    function setItemSync(k: string, v: string) {
      try {
        localStorage.setItem(k, v);
        return true;
      } catch (ex) {
        return false;
      }
    }
  }

  /**
   *  （ ，overtime,version）
   * @param key
   * @param options
   * @returns
   */
  getItemRaw(key: string, options?: ILocalStorageItemOption) {
    const k = this.__convertKey(key);
    function getItem(k: string) {
      try {
        return localStorage.getItem(k);
      } catch (ex) {}
    }
    const itemStr = getItem(k);
    if (!itemStr) {
      return;
    } else {
      const { timeout, version } = this.__convertItemOption(options);
      const itemJson = parseStoreItem(itemStr, version);
      if (!itemJson) {
        //  ， ，
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(TAG, 'version missed to remove', k, itemJson);
        }
        localStorage.removeItem(k);
        return;
      }
      const dtNow = safePerformanceTimeNow();
      if (itemJson.overtime && dtNow > itemJson.overtime) {
        //  ，
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(TAG, 'overtime missed to remove', k, itemJson);
        }
        localStorage.removeItem(k);
        return;
      }
      // get
      if (timeout && dtNow > itemJson.createAt + timeout) {
        // get ， timeout
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(TAG, 'timeout missed', k, itemJson, timeout);
        }
        // localStorage.removeItem(k)
        return;
      }
      return itemJson;
    }
  }

  /**
   *  （ parse json ）
   * @param key
   * @param options
   * @returns
   */
  getItemRawParsed<T>(key: string, options?: ILocalStorageItemOption) {
    const itemJson = this.getItemRaw(key, options);
    if (!itemJson) {
      return;
    }
    try {
      const { rawData, ...rest } = itemJson;
      return {
        ...rest,
        data: JSON.parse(rawData) as T,
      } as ILocalStorageDataItemParsed<T>;
    } catch (ex) {
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        console.log(TAG, 'JsonParseError', key, itemJson, ex);
      }
      return;
    }
  }

  /**
   *
   * @param key
   * @param options
   * @returns undefined | T
   */
  getItem<T>(key: string, options?: ILocalStorageItemOption) {
    const raw = this.getItemRawParsed<T>(key, options);
    if (raw) {
      return raw.data;
    }
  }

  /**
   *  ( options.async )
   * @param key
   * @param value
   * @param options  timeout,
   * @returns
   */
  setItem<T>(key: string, value: T, options?: ILocalStorageItemOption) {
    return this.setItemAuto(key, value, this.options.async, options);
    // return item
  }
  setItemAsync<T>(key: string, value: T, options?: ILocalStorageItemOption) {
    return this.setItemAuto(key, value, true, options) as Promise<boolean>;
  }
  setItemSync<T>(key: string, value: T, options?: ILocalStorageItemOption) {
    return this.setItemAuto(key, value, false, options) as boolean;
  }

  private setItemAuto<T>(
    key: string,
    value: T,
    async: boolean,
    options?: ILocalStorageItemOption
  ) {
    const { timeout, version } = this.__convertItemOption(options);
    const k = this.__convertKey(key);
    const dtNow = safePerformanceTimeNow();
    const item: ILocalStorageDataItem<T> = {
      createAt: dtNow,
      data: value,
      version: version,
      overtime: timeout ? dtNow + timeout : undefined,
    };
    return this._setItem(k, stringifyStoreItem(item), async);
  }

  removeItem(key: string) {
    const k = this.__convertKey(key);
    try {
      localStorage.removeItem(k);
      return true;
    } catch (ex) {
      return false;
    }
  }

  createStorageItemOperators<T>(
    key: string,
    defaultOptions?: ILocalStorageItemOption
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const res: IStorageItemOperators<T> = {
      getItem(options?: ILocalStorageItemOption) {
        return that.getItem(key, options || defaultOptions);
      },
      setItem(v: T, options?: ILocalStorageItemOption) {
        return that.setItem(key, v, options || defaultOptions);
      },
      setItemSync(v: T, options?: ILocalStorageItemOption) {
        return that.setItemSync(key, v, options || defaultOptions);
      },
      setItemAsync(v: T, options?: ILocalStorageItemOption) {
        return that.setItemAsync(key, v, options || defaultOptions);
      },
      removeItem() {
        that.removeItem(key);
      },
    };
    return res;
  }
}

/**
 * json ，（version ， ）
 * @param str
 * @param version
 * @returns
 */
function parseStoreItem(str: string, version: number) {
  const toVStr = version + '';
  if (str.substring(0, toVStr.length) !== toVStr) {
    return; //
  }
  const [_versionStr, overtimeStr, createAtStr, dataJsonStr] =
    splitStrIntoParts(str, '|', 4);
  // const version = parseInt(versionStr, 10);

  const overtime = overtimeStr ? parseInt(overtimeStr, 10) : undefined;
  const createAt = parseInt(createAtStr, 10);
  return {
    createAt,
    version,
    overtime,
    rawData: dataJsonStr,
    // data: JSON.parse(dataJsonStr) as T
  } as ILocalStorageDataItemNotParsed;
}
function stringifyStoreItem<T>(item: ILocalStorageDataItemParsed<T>) {
  const { createAt, data, version, overtime } = item;
  return `${version}|${overtime || ''}|${createAt}|${JSON.stringify(data)}`;
  // return JSON.stringify(item);
}
