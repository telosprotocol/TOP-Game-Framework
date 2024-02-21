export enum HeaderTopBannerStatus {
  /**
   *
   * bannerOpacity=1
   */
  All = 0,
  /**
   * Banner
   * 0<bannerOpacity<1
   */
  StartFade = 1,
  /**
   * Banner    (             )
   * （  ，  bannner   （0-HeaderTop  ）
   * bannerOpacity=0
   */
  Hidden = 2,

  // /**
  //  * Banner
  //  */
  // None = 3,
}
export const HeaderTopBannerEvents = {
  /**
   *           （  Banner       HeaderTop   ）
   */
  bannerStatusChanged: 'status-changed',
};
