/**
 *     ，  head
 */
(function () {
  function getAppInfo() {
    const ua = navigator.userAgent || '';
    const vidIdx = ua.toLowerCase().indexOf('vid/');
    let appVersion = '';
    let isInApp = vidIdx > -1;
    const pathname = (location.pathname || '').toLowerCase();
    const hash = (location.hash || '').toLowerCase();
    const hashQueryIdx = hash.indexOf('?');
    let hashPath = hash;
    if (hashQueryIdx > 0) {
      hashPath = hash.substr(0, hashQueryIdx);
    }
    const pathnameNoExt = pathname.split('.')[0].substr(1); //index,mix,remote,dialog
    //   html
    const entryHtmlName = pathnameNoExt || 'index';

    const isWalletPage = pathname === '/' || pathname === '/index.html';
    const isCenter = isWalletPage && hashPath === '#/v/right';

    let packageName = '';
    let pkgChannelName = '';
    let pkgEnv = '';
    if (isInApp) {
      const vidStr = ua.substr(vidIdx);
      const vidSplitList = vidStr.split('/');
      appVersion = vidSplitList[1] ? vidSplitList[1].split(' ')[0] : '';
      packageName = vidSplitList[2] ? vidSplitList[2].split(' ')[0] : '';
      pkgChannelName = vidSplitList[3] ? vidSplitList[3] : '';
      pkgEnv = vidSplitList[4] ? vidSplitList[4] : '';
    }

    const mainActivityTab = (function () {
      if (isCenter) {
        return 'wallet';
      } else if (isWalletPage && hashPath === '#/v/game') {
        return 'bounds';
      }
    })();
    return {
      entryHtmlName,
      isInApp: isInApp,
      // isWallet: isWallet,
      isCenter,
      mainActivityTab,
      appVersion: appVersion,
      packageName,
      pkgChannelName,
      pkgEnv,
    };
  }
  const appInfo = getAppInfo();
  //   GC
  if (window.GC) {
    window.GC.appVersion = appInfo.appVersion;
    window.GC.isInApp = appInfo.isInApp;
    window.GC.entryHtmlName = appInfo.entryHtmlName;
    // if (window.GC.isWallet == null) {
    //   window.GC.isWallet = appInfo.isWallet;
    // }
    window.GC.isCenter = appInfo.isCenter;
    window.GC.mainActivityTab = appInfo.mainActivityTab;
    window.GC.packageName = appInfo.packageName;
    window.GC.pkgChannelName = appInfo.pkgChannelName;
    window.GC.pkgEnv = appInfo.pkgEnv;
  }
})();
