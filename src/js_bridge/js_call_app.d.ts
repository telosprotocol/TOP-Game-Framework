import { RouterNameInappType } from '@/constants/localRoutePath';
import type { GBusEventName, IGBusEventPayloadMap } from '@/utils/GBus-type';

export type IBridgeOpenSimpleWebBridgeOptions = {
  /**
   *
   *   :false
   */
  isShowNativeBar: boolean;
  /**
   *
   *   :true
   */
  isShowStatusBar: boolean;

  /**
   *   Inject  Bridge
   *   :false
   */
  isLoadCompleteJs: boolean;
};
export interface IBridgeModelConfig {
  lang: string;
  region: string;
  countryCode: string;
}

export interface IBridgeResult<T> {
  Result: number;
  ErrCode?: number;
  status?: number;
  Reason?: string;
  data?: T;

  /**
   *     cache
   */
  __fromCache?: boolean;
}
export interface IBridgeResultStatus {
  Result: number;
}

export interface IBridgeModelDeviceInfo {
  clientInfo: string;
  deviceId: string;
  model: {
    /**
     * e.g CN
     */
    country: string;
    deviceBrand: string;
    deviceIP: string;
    deviceMac: string;
    deviceModel: string;
    deviceName: string;
    deviceOS: string;
    /**
     * e.g:10
     */
    deviceOSVersion: string;
    deviceUniqId: string;
    isEmulator: boolean;
    /**
     * e.g: en
     */
    language: string;
    serial: string;
    /**
     * "Asia/Shanghai"
     */
    timeZone: string;
  };
}
export interface IUserInfoBase {
  avatar: string;
  /**
   * ID
   */
  countryCode: string;
  nickName: string;
  userId: string;

  // /**
  //  *
  //  */
  // point: number;
  // /**
  //  *
  //  */
  // realInviteCount: number;

  // /**
  //  *
  //  * @deprecated
  //  */
  // signInCount?: number;

  // canFreeRedeem: boolean;

  //   /**
  //  * '1234567890'
  //  * @deprecated
  //  */
  //    paytmAcc?: string
}

export interface IBridgeModelUserInfo extends IUserInfoBase {
  auth: string;

  // avatar: '',
  /**
   * [Despreted]
   */
  userGrade: number;

  /**
   *
   */
  autoIG: boolean;
  /**
   *
   */
  email: string;
}
export interface IBridgeModelAppInfo {
  /**
   *    ,e.g: 2001
   */
  appType: string;

  /**
   *
   * e.g:1.4.2
   */
  versionName: string;

  /**
   * e.g:4718
   */
  buildNum: string;

  /**
   *    ,e.g: 15
   */
  versionCode: number;

  // clientInfo: string
}
export interface IBridgeModelAdInfo {
  androidId: string;
  gaid: string;
  imei: string;
  mac: string;
  udid: string;
}
export interface ITaskItem {
  mainCategory: number;
  subCategory: number;
  taskVerifyStatus: number;

  isAutoGet?: boolean;
  amount?: number;
  taskId?: number;
  taskType?: number;
  isFreeRedeem?: boolean;
}

type GBusModel<TEventName extends GBusEventName> = {
  eventName: TEventName;
  detail: IGBusEventPayloadMap[TEventName];
};
export interface IPenetrateDataModel {
  // /**
  //  *   webview   ID
  //  *
  //  */
  // wid: string;

  /**
   *   to  ，    to
   *
   */
  to?: RouterNameInappType;

  /**
   *    commit
   */
  commitInfo?: ICommitInfoItem[];

  /**
   *    dispatch
   */
  dispatchInfo?: ICommitInfoItem[];

  gBus?: GBusModel<GBusEventName>[];
}

export interface ICommitInfoItem {
  //    commitInfo
  type: string;
  payload: any;
}
