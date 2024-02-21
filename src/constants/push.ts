/**
 *  webview
 */
export const PUSH_TYPE_ALL = 'push_tag_all';

/**
 *
 */
export const PUSH_TYPE_NAV = 'push_tag_nav';

/**
 * APP
 */
export const PUSH_TYPE_OLD = 'push_nav_old';

export type IBridgePushEvent = {
  type: string;
  content: string;

  //   push_tag
  maps: IPushCommandMap;
};

export type IPushCommandBase = {
  /**
   * console name ，
   */
  _name: string;

  /**
   *
   */
  reportSubCategory: string;

  push_notify_only_background: string;
};

export type IPushCommondBeforeCheck = {
  //#region cmd
  /**
   *  （ ， navigation ）
   * @type  ：
   * @type  ， dispatch type
   *   store.dispatch(beforeCheckType,{})
   *  Result=1   checkDataError , navigation
   */
  beforeCheckType?: string;

  /**
   * json Payload(base64 )
   *  ， payload=null, JSON.parse(beforeCheckPayload)
   */
  beforeCheckPayload?: string;
  //#endregion
} & IPushCommandBase;
export type IPushCommandMap = IPushCommandNavigation;
// | IPushCommondRefresh
// | IPushCommandStore;

export type ILoginStrategyType = 'login-wait' | 'back' | 'wait' | 'none';

/**
 * type=PUSH_TYPE_NAV
 */
export type IPushCommandNavigation = {
  /**
   *
   */
  command: 'navigation';

  url: string;
  //#region  store
  afterType: 'store-dispatch' | 'store-commit';
  afterStoreType?: string;
  /**
   * payload Json  (base64 )
   */
  afterStorePayload?: string;
  //#endregion
} & IPushCommondBeforeCheck;

/**
 * Wallet
 */
export type IPushCommondRefresh = {
  command: 'refresh';
} & IPushCommandBase;

/**
 *  store
 */
export type IPushCommandStore = {
  command: 'store-dispatch' | 'store-commit';

  type: string;

  /**
   * payload
   * @default json  payload Json
   */
  payloadType: 'string' | 'json';

  /**
   * payload Json  (base64 )
   */
  payload?: string;
} & IPushCommandBase;
