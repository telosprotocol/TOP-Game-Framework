/**
 * App H5 navigation
 */

export enum BannerOpType {
  /**
   *  (vv ，http ,H5 )
   * 1. ， navbar
   * 2. ， navbar( openSimpleWebBridge)
   */
  AppLink = 1,

  /**
   *
   */
  OuterLink = 2,

  /**
   *  ( )
   */
  DownloadWebviewLink = 4,
  /**
   *  ( )
   */
  DownloadWebviewLinkNoDownloadIcon = 5,
}

export enum NavigationOpType {
  // #region App H5 navigation bridge
  /**
   *
   */
  AppLink = 1,

  /**
   *  ( url )
   */
  OuterLink = 2,

  /**
   *  ， packageName ， openNativeApp. urlSchema, url
   */
  AppOuterLink = 3,

  // #endregion
}
