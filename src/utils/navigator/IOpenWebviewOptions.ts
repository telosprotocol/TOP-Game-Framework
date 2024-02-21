import type { INavigationLoginFromType } from '../../js_bridge/js_call_app_base';

//#endregion
//#region
export type IOpenWebviewOptions = {
  /**
   *        checkLogin
   */
  checkLogin?: {
    //    ，      (              )
    traceEvent: INavigationLoginFromType;

    //    ，   param
    traceParamStr?: string;

    openAfterLogin?: boolean;
  };
  //
  getNavLocker?: boolean;

  /**
   *        ,index|remote|mix|dialog
   *  ：     ，
   *    remote index,
   */
  entryName?: IEntryHtmlName;
  onIsLoginCheck?: (status: 'before' | 'end', isLogined?: boolean) => void;

  /**
   *
   */
  commandOptions?: {
    /**
     *
     */
    shareType?: string;
    /**
     *
     */
    share_initialfrom?: string;
  };
};
