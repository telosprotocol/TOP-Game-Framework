import GBridgeBase, { ICallMsgBase } from './GBridgeBase';
type IConfig = {
  language?: string;
  country?: string;
  region?: string;

  /**
   *  ，
   */
  gameName?: string;
};

const DEFAULT_GAMENAME = 'unkowngame';

export default class GBridgeClient extends GBridgeBase {
  protected logName = '[GBridge-Client]';
  protected debug = true;
  private static _Instance: GBridgeClient;
  static get Instance() {
    if (!GBridgeClient._Instance) {
      GBridgeClient._Instance = new GBridgeClient();
    }
    return GBridgeClient._Instance;
  }

  constructor() {
    super();
    if (typeof document !== 'undefined') {
      const loadScript = document.getElementById('__GBRIDGE_SCRIPT');
      if (loadScript) {
        const mode = loadScript.getAttribute('data-mode');
        if (mode == 'auto') {
          this.init();
          if (this._config.gameName === DEFAULT_GAMENAME) {
            const gameName = loadScript.getAttribute('data-gname');
            if (gameName) {
              this._config.gameName = gameName;
            }
          }
        }
      }
    }
  }

  private _config: Partial<IConfig> = {};

  getConfig() {
    return this._config;
  }

  /**
   *
   * @param config  ， url query
   */
  init(config?: Partial<IConfig>) {
    //
    super.init();
    //
    const { l, c, r, ...rest } = GetRequest();
    this._config = {
      language: l,
      country: c,
      region: r,

      ...rest,
      ...config,
    };
    if (!this._config.gameName) {
      this._config.gameName = DEFAULT_GAMENAME;
    }
    function GetRequest() {
      const search = location.search; // url "?"
      const query: { [key: string]: string } = {};
      if (search.indexOf('?') != -1) {
        const str = search.substr(1);
        const strPairs = str.split('&');
        for (let i = 0; i < strPairs.length; i++) {
          const strPair = strPairs[i];
          if (!strPair) {
            continue;
          }
          const [itemName, itemValue] = strPair.split('=');
          if (itemValue != null) {
            query[itemName] = decodeURIComponent(itemValue);
          }
        }
      }
      return query;
    }

    if (this.debug) {
      console.log(this.logName, 'init', { ...this._config });
    }
    this.onGameProcess('gbridgeInited', true);
  }

  /**
   * iframe call container
   * @param msg
   * @param _win  win
   */
  callContainer<TInput, TReturnData>(msg: ICallMsgBase<TInput, TReturnData>) {
    return this.callMethod(msg, [window.top]);
  }

  //#region Bridge
  /**
   *
   */
  trace(
    eventName: string,
    data: { [key: string]: string | number },
    labelValue?: { label: string; value: number | string }
  ) {
    this.callContainer({
      methodName: 'trace',
      data: {
        eventName,
        props: data,
        labelValue,
      },
    });
  }

  /**
   *  app
   */
  setStatusColor(options: { color: string; isDark: boolean }) {
    return this.callContainer<typeof options, boolean>({
      methodName: 'setStatusColor',
      data: options,
    });
  }

  /**
   * close current webview
   */
  close() {
    this.callContainer({
      methodName: 'closeActivity',
      data: {},
    });
  }

  //#endregion

  //#region Loading for loadingscene

  showLoading() {
    this.callContainer({
      methodName: 'showLoading',
      data: null,
    });
  }
  hideLoading() {
    this.callContainer({
      methodName: 'hideLoading',
      data: null,
    });
  }
  //#endregion

  //#region

  /**
   *  ， app
   */
  pushGameData(data: { score?: number; level?: number }) {
    this.callContainer({
      methodName: 'pushGameData',
      data: {
        ...data,
        gameName: this.getConfig().gameName,
      },
    });
  }

  /**
   *   ( )
   * 0.gbridgeInited: GBridge
   * 1.loadingframe:
   *  -error
   * 2.loadedframe:
   *  -error
   * 2.loadedscene:
   *  -error
   */
  onGameProcess(stage: string, isOk: boolean) {
    this.callContainer({
      methodName: 'onGameProcess',
      data: {
        stage,
        gameName: this.getConfig().gameName,
        isOk,
      },
    });
  }
  //#endregion

  //#region localStorage
  private _localStorage?: GameLocalStorage = undefined;

  /**
   * LocalStorage
   */
  get localStorage() {
    if (!this._localStorage) {
      this._localStorage = new GameLocalStorage(
        'gm_' + this._config.gameName + '_'
      );
    }
    return this._localStorage;
  }
  //#endregion
}

class GameLocalStorage {
  private _prefix: string;
  constructor(prefix: string) {
    this._prefix = prefix;
  }
  private convertLsKey(key: string) {
    return `${this._prefix}${key}`;
  }
  getItem(key: string) {
    return window.localStorage.getItem(this.convertLsKey(key));
  }

  setItem(key: string, value: string) {
    window.localStorage.setItem(this.convertLsKey(key), value);
  }
  removeItem(key: string) {
    window.localStorage.removeItem(this.convertLsKey(key));
  }
}
