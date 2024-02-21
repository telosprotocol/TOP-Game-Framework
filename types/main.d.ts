/**
 * we can add NODE_ENV、BASE_URL、VUE_APP_*
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    // readonly VUE_APP_ENV_NAME2: 'landing' | 'wallet' | 'sim'

    readonly BASE_URL: string;

    readonly VUE_APP_BASEURL_API: string;

    readonly VUE_APP_ENV_NAME2: 'sim' | 'landing' | 'wallet';

    readonly VUE_APP_ENV_SIM?: 'true';

    // /**
    //  *        ，      ，
    //  */
    // readonly VUE_APP_ONLY_LOCAL?: 'true';

    /**
     *       debug
     */
    readonly VUE_APP_ENV_LOCAL_DEBUG?: 'true';

    /**
     *    ，     vgame
     */
    readonly VUE_APP_PKG?: 'vgame' | 'xxx';
    /**
     * server  ,  or
     */
    readonly VUE_APP_ENV_SERVER?: 'development' | 'production';
  }
}
type IEntryHtmlName = 'index' | 'remote' | 'mix' | 'mix2' | 'dialog';
// ResizeObserver
interface Window {
  GC: {
    appName: 'landing' | 'wallet' | 'sim';
    h5Version: string;

    buildNum: string;
    /**
     * app   ( ua   )
     */
    appVersion: string;
    /**
     *    APP
     *   UA    wallet    ，   ua   ，
     */
    isInApp: boolean;

    // /**
    //  *           wallet
    //  */
    // isWallet: boolean;

    /**
     *               tab
     * V    ，wallet Center
     * V       ，right Center
     */
    isCenter: boolean;

    /**
     *        MainActivity
     *  ： wallet  v    wallet,v    right
     * bounds v    fission,v    game
     */
    mainActivityTab?: 'wallet' | 'bounds';
    /**
     *   dialog
     */
    isDialog: boolean;

    entryHtmlName: IEntryHtmlName;

    packageName: 'com.dt.vgame.test' | 'com.dt.vgame';

    pkgChannelName: 'CP_VGame' | 'CP_VGame_adjust' | 'vGame';

    //test/sit  /pro_debug/   uat/ pre /   pro_final
    pkgEnv: 'test' | 'sit' | 'pro' | 'uat' | 'pro_debug' | 'pre' | 'pro_final';
  };

  /**
   *
   */
  pagePerfObj?: {
    /**
     *
     */
    loadStTime: number;
    ua: string;
    pkg_mode: 'wallet' | 'landing' | 'unkown' | 'sim';
    tracename: 'load';
    /**
     *   mounted  timer
     */
    pageTimer0: number;
    /**
     *   mounted  tick
     */
    pageTick0: number;

    /**
     * jsLoad mount
     */
    jsLoad2Mounted: number;

    /**
     *   mount
     */
    pageMountedPerf: number;

    /**
     *
     */
    pvRouteName: string;

    /**
     * before route
     */
    pvPerf: number;

    /**
     *     isLogin
     */
    pvPerfBeforeSpan: number;
    [key: string]: number | string;
  };
}
