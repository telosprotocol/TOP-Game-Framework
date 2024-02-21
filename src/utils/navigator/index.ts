import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { isNative } from '@/js_bridge/isNative';

import { BannerOpType } from '@/constants/BannerOpType';

import {
  openExternalBrowser,
  openSimpleWebBridge,
} from '@/js_bridge/js_call_app';
import { startsWith } from 'lodash-es';
import {
  INavigationLoginFromType,
  navigation_login_bridge,
  openDownloadBrowser,
} from '../../js_bridge/js_call_app_base';

import { openAppH5LinkPreferLocal } from './openAppH5LinkPreferLocal';

import { replaceDeviceInfoHolderForListAsync } from './replaceDeviceInfoHolderForList';
import { normalizeUrlOrPath } from './baseUtils';
import type { IOpenWebviewOptions } from './IOpenWebviewOptions';
import { checkCanUseNavigation } from './checkCanUseNavigation';
import { OFFISIAL_SITE_DOMAIN } from '@/constants/Domains';
export { openAppH5LinkPreferLocal } from './openAppH5LinkPreferLocal';
export { normalizeUrlOrPath, normalizeUrlWithQuery } from './baseUtils';
//#region bannerNavigation
const OKRESULT = {
  Result: 1,
  data: true,
};
/**
 * banner
 * @param options
 * @returns
 */
export async function bannerNavigation(
  options: {
    /**
     *       （              ）
     * @example /   ，
     * @example http.... ,
     * @example vv://.... ,
     */
    url: string;

    /**
     * opType   ，  url
     * @type OuterLink,       (url)
     * @type   ：   url
     */
    opType?: BannerOpType;

    /**
     *    url，          ，      url
     * openDownloadBrowser
     */
    containInstructionUrl?: string;

    /**
     *     （for        ）
     */
    from?: INavigationLoginFromType;

    // /**
    //  *
    //  */
    // epNum?: string;
  } & Pick<IOpenWebviewOptions, 'commandOptions'>
) {
  const { url, opType, containInstructionUrl } = options;
  if (!url) {
    return {
      Result: 0,
      message: 'Invalid url',
      data: false,
    };
  }
  let [toUrl] = await replaceDeviceInfoHolderForListAsync([url]);
  //
  if (/[?&]checkLogin=true/.test(toUrl)) {
    //
    const isLogined = await waitUserIsLoginedAuth();
    if (!isLogined) {
      navigation_login_bridge((options.from || toUrl) as any, {
        opType,
        to: toUrl,
      });
      return OKRESULT;
    }
  }
  if (opType === BannerOpType.OuterLink) {
    openExternalBrowser(toUrl);
    return OKRESULT;
  }
  if (
    opType === BannerOpType.DownloadWebviewLink ||
    opType === BannerOpType.DownloadWebviewLinkNoDownloadIcon
  ) {
    openDownloadBrowser(
      toUrl,
      {
        isDisableDownloader:
          opType === BannerOpType.DownloadWebviewLink ? false : true,
      },
      containInstructionUrl
    );
    return OKRESULT;
  }
  if (checkCanUseNavigation(toUrl)) {
    if (startsWith(toUrl.toLowerCase(), '/dialog/vgametask')) {
      //         ，   v2854
      return openAppH5LinkPreferLocal(
        '/h5command/openGameHallDlg?type=NOVICE_FIVE_DAYS',
        {
          commandOptions: options.commandOptions,
        }
      );
    }
    return openAppH5LinkPreferLocal(toUrl, {
      commandOptions: options.commandOptions,
    });
  } else {
    toUrl = normalizeUrlOrPath(toUrl);
    return openSimpleWebBridge(toUrl, {
      isShowStatusBar: true,
      isShowNativeBar: true,
      isLoadCompleteJs: false,
    });
  }
}
//#endregion

//#region tryOpenSimpleWebview(  app      )
/**
 *     (   APP  )
 * @param url
 */
export function tryOpenSimpleWebview(url: string) {
  const bNative = isNative();
  const url2 = normalizeUrlOrPath(url);
  if (bNative) {
    openSimpleWebBridge(url2, {
      isShowNativeBar: true,
      isShowStatusBar: true,
      isLoadCompleteJs: false,
    });
  } else {
    location.href = url2;
  }
}
//#region

// export function tryOpenBonus(options?: IOpenWebviewOptions) {
//   const path = ROUTEPATH_BONUS
//   openAppH5LinkPreferLocal(path, {
//     checkLogin: {
//       traceEvent: RouterNameInapp.Bonus + '_login'
//     },
//     getNavLocker: true,
//     ...(options || {})
//   })
// }

//#endregion

// #region

export const OFFICIAL_SITE_UPDATEVERSION = OFFISIAL_SITE_DOMAIN;
export function tryOpenOfficialSiteUpdateVersion() {
  openExternalBrowser(OFFICIAL_SITE_UPDATEVERSION);
}
// #endregion
