import { BannerOpType } from '@/constants/BannerOpType';
import ButtonLockController from '@/controller/ButtonLockController';
import {
  navigation_login_bridge,
  showWebviewDialog,
} from '@/js_bridge/js_call_app';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import { startsWith } from 'lodash-es';
import { INavigationData, navigation } from '../../js_bridge/js_call_app_base';
import { normalizeUrlOrPath } from './baseUtils';
import { dealH5Command } from './dealH5Command';
import type { IOpenWebviewOptions } from './IOpenWebviewOptions';
import { Toast } from 'vant';
import type { IBridgeResult } from '@/js_bridge/js_call_app.d';

/**
 *          webview
 * (        ，        ，   bannerNavigation)
 * @param vv        （  bridge)
 * @notice        app
 * @return Result=0: ErrCode=1,
 * @return Result=0: ErrCode=2,
 *
 */
export async function openAppH5LinkPreferLocal(
  pathnameOrUrl: string,
  options: IOpenWebviewOptions & { navData?: INavigationData }
) {
  const { checkLogin, getNavLocker, entryName, navData } = options;
  if (getNavLocker) {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return {
        Result: 0,
        ErrCode: 1,
      } as IBridgeResult<boolean>;
    }
  }
  if (checkLogin) {
    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      if (checkLogin.openAfterLogin) {
        navigation_login_bridge(checkLogin.traceEvent, {
          to: pathnameOrUrl,
          opType: BannerOpType.AppLink,
        });
      } else {
        navigation_login_bridge(checkLogin.traceEvent);
      }
      return {
        Result: 0,
        ErrCode: 2,
      } as IBridgeResult<boolean>;
    }
  }
  const pathnameOrUrlLower = (pathnameOrUrl || '').toLowerCase();
  if (startsWith(pathnameOrUrlLower, '/dialog/')) {
    //
    return showWebviewDialog({ path: pathnameOrUrl });
  }
  if (startsWith(pathnameOrUrlLower, '/h5command')) {
    if (window.GC.isInApp) {
      return dealH5Command(pathnameOrUrl, options?.commandOptions);
    } else {
      Toast('NotSupport');
      return {
        Result: 0,
        data: false,
      } as IBridgeResult<boolean>;
    }
  }
  const url = normalizeUrlOrPath(pathnameOrUrl, entryName);
  return navigation({ url, data: navData });
}
