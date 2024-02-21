interface IHttpResponse<T> {
  /**
   *  success
   */
  Result: number;

  /**
   *  message
   */
  Reason?: string; //message
  ErrCode?: number; //code

  /**
   *     ， Result
   */
  success: boolean;

  /**
   *  Reason
   */
  message?: string;
  code: number;

  // ErrCode?:number
  data?: T;
  /**
   *   response  status
   * @Despreted
   */
  status?: number;

  //#region V
  servertime: number;
  name?: string;
  logno?: string;

  /**
   * V
   */
  total?: number;
  //#endregion
}
interface IHttpVResponse<T> {
  /**
   *     ， Result
   */
  success: boolean;

  /**
   *  Reason
   */
  message?: string;
  code: number;

  // ErrCode?:number
  data?: T;
  //#region V
  servertime: number;
  name?: string;
  logno?: string;

  /**
   * V
   */
  total?: number;
  //#endregion
}

interface IHttpVResponseError {
  /**
   *     ， Result
   */
  success: false;

  /**
   *  Reason
   */
  message?: string;
  code: number;

  //#region V
  servertime: number;
  name?: string;
  logno?: string;

  /**
   * V
   */
  total?: number;
  //#endregion
}
interface IHttpResponseRawV<T> {
  code: number; //-->ErrCode
  data?: T; //-->data
  servertime: number;
  name: string;
  success: boolean; //--> Result:1|0
  message?: string; //-->Reason
  logno: string;
  /**
   * V
   */
  total?: number;
}

interface IHttpResponse2<T> {
  status?: number;
  Result: number;
  Reason?: string;
  data?: T;
}

/**
 * Number format as string
 */
type BigDecimalString = string;

/**
 * Number format for ao number
 */
type BigDecimalStringAO = string | number;
