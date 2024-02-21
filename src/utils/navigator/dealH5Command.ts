import { navigation } from '@/js_bridge/js_call_app_base';
import { ROUTENAME_INAPP_VGAME } from '@/constants/localRoutePath';
import {
  INODEJS_SHARE_NUMBER_TYPE,
  NODEJS_SHARE_NUMBER_VGAME_FORVGAME_PKG,
  SHARE_PLATFORM,
} from './../../constants/invite';
import { openVGame } from '@/modules/GameHall/VGameList/openGame';

import type { IOpenGameSource } from '@/modules/GameHall/VGameList/openGame';
import { SHARE_TYPES_VGAME } from '@/constants/invite';
import { TransTool } from '@/init/i18n';
import {
  getVReferUtils,
  waitShareInfoForEarn,
  waitShareInfoForGame,
} from '@/modules/VInvite/vInvite';
import { gBusEmitAndPenetrate } from '@/js_bridge/jsCallApp/utilsPenetrate';
import type { IOpenGameHallDlgParam } from '../GBus-type';
import { APP_ROUTE_TAB_GAME } from '@/constants/APP_SCHEMA_URLS';
import { AppPkgName } from '@/constants/AppPkgName';

export async function dealH5Command(
  pathUrl: string,
  options?: {
    /**
     *
     */
    shareType?: string;
    /**
     *
     */
    share_initialfrom?: string;
  }
) {
  const firstQuerySignIdx = pathUrl.indexOf('?');
  let pathName = pathUrl;
  let queryStr = '';
  if (firstQuerySignIdx !== -1) {
    pathName = pathUrl.substring(0, firstQuerySignIdx);
    queryStr = pathUrl.substring(firstQuerySignIdx + 1);
  }
  const queryObj: Record<string, string> = {};
  queryStr
    .split('&')
    .filter((item) => !!item)
    .forEach((item) => {
      const [keyName, keyValue] = item.split('=');
      queryObj[keyName] = decodeURIComponent(keyValue);
    });
  const commandName = pathName.split('/')[2];
  if (commandName === 'openVGame') {
    // /h5command/openVGame
    //   V
    const isOk = await openVGame(
      queryObj.gameId,
      queryObj.orientation as 'HORIZONTAL' | 'VERTICAL',
      queryObj.from as IOpenGameSource
    );
    return {
      Result: 1,
      data: isOk,
    };
  } else if (commandName === 'share') {
    // /h5command/share
    const shareQueryObj = queryObj as {
      /**
       *
       */
      template: 'game' | 'earn';
      platform?: 'WHATSAPP' | 'FACEBOOK';
      shareNumber?: string;
      title?: string;
      subTitle?: string;
      pkgName?: string;
      shareType?: string;
      withApk?: 'true' | 'false';
    };
    const sharePlatform = SHARE_PLATFORM[shareQueryObj.platform];
    const SHARE_TEMPLATE_CONFIG = {
      game: {
        title: TransTool.Instance.$t('V.gameShareTitle') as string,
        subTitle: TransTool.Instance.$t('V.gameShareSlogan') as string,
        shareNumber: NODEJS_SHARE_NUMBER_VGAME_FORVGAME_PKG,
        withApk: true,
        pkgName: AppPkgName,
      },
    };
    const curConfig = {
      ...(SHARE_TEMPLATE_CONFIG.game || SHARE_TEMPLATE_CONFIG.game),
    };

    if (shareQueryObj.shareNumber) {
      const shareNumber = Number(shareQueryObj.shareNumber);
      if (!isNaN(shareNumber)) {
        curConfig.shareNumber = shareNumber;
      }
    }
    if (shareQueryObj.title) {
      curConfig.title = shareQueryObj.title;
    }
    const referUtil = getVReferUtils(SHARE_TYPES_VGAME);
    return await referUtil.onQuikReferLinkClick(
      curConfig.shareNumber as INODEJS_SHARE_NUMBER_TYPE,
      {
        shareType: SHARE_TYPES_VGAME,
        showShareDialog: sharePlatform ? false : true,
        sharePlatform,
        title: shareQueryObj.title || curConfig.title,
        subTitle: shareQueryObj.subTitle || curConfig.subTitle,
        traceParams: JSON.stringify({
          share_initialfrom: options?.share_initialfrom,
          pkg_name: shareQueryObj.pkgName || curConfig.pkgName,
          share_type: shareQueryObj.shareType || options?.share_initialfrom,
        }),
        withApk: shareQueryObj.withApk !== 'false',
      },
      shareQueryObj.template === 'earn'
        ? waitShareInfoForEarn
        : waitShareInfoForGame
    );
  } else if (commandName === 'openGameHallDlg') {
    //
    const openQueryObj = queryObj as IOpenGameHallDlgParam;

    gBusEmitAndPenetrate(
      'openGameHallDlg',
      openQueryObj,
      ROUTENAME_INAPP_VGAME
    );
    navigation({ url: APP_ROUTE_TAB_GAME });
    return {
      Result: 1,
      data: true,
    };
  }

  return {
    Result: 1,
    data: false,
  };
}
