interface GBridgeClient {
  /**
   *  ,
   *  <script src="/game/common/GBridge.js" data-mode="auto" id="__GBRIDGE_SCRIPT"></script> ， （ ）
   * @param _option
   */
  init(_option?: { gameName?: string }): void;

  /**
   *
   */
  getConfig(): {
    language?: string;
    country?: string;
    region?: string;

    /**
     *  ，
     */
    gameName?: string;
  };

  /**
   *
   * @param eventName
   * @param data
   * @param labelValue label/value
   */
  trace(
    eventName: string,
    data: { [key: string]: string | number },
    labelValue?: { label: string; value: number | string }
  ): void;

  /**
   *  app
   */
  setStatusColor(options: { color: string; isDark: boolean }): void;

  /**
   * close current webview
   */
  close(): void;

  showLoading(): void;
  hideLoading(): void;

  /**
   *  ， app
   * @param data
   */
  pushGameData(data: { score?: number; level?: number }): void;

  /**
   *
   * @param stage
   * @param isOk
   * 0.gbridgeInited: GBridge （ GBridge init ）
   * 1.loadingframe:
   *  -error
   * 2.loadedframe:
   *  -error
   * 2.loadedscene:
   *  -error
   */
  onGameProcess(stage: string, isOk: boolean): void;

  localStorage: {
    getItem(key: string): string;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
  };
}
interface Window {
  GBridge: GBridgeClient;
}
