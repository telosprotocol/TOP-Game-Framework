import { stringShield } from '@/utils/string';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { getCurrentLang } from '@/init/i18n';
import AsyncStateItem, {
  createHttpAsyncStateItem,
} from '@/controller/AsyncStateItem';
import {
  INODEJS_SHARE_NUMBER_TYPE,
  NODEJS_SHARE_CAMPAIGNPID,
  SHARE_PLATFORM,
  TYPE_TP_SHARE_TYPES,
} from '@/constants/invite';
import { MS_MINUTES_30 } from '../constants/time';
import {
  getAndPreloadShareLinkExt,
  getNodeShareLink,
  getReferInviteCode,
} from '../http/api/invite';
import { normalizeUrlOrPath } from '../utils/navigator/baseUtils';
import LocalStorage from './LocalStorage';
import { getStore } from '../store/util';

type CODETYPE = 'common'; //'dc' |

const stateItemInviteCodeReferA = createHttpAsyncStateItem(
  () => {
    return getReferInviteCode();
  },
  null,
  'InviteCode'
);
// const stateItemInviteCodeDC = createHttpAsyncStateItem(
//   () => {
//     return getDCInviteCode();
//   },
//   null,
//   'DC'
// );
const GETCODE_MAP: { [type in CODETYPE]: typeof stateItemInviteCodeReferA } = {
  // //
  // dc: stateItemInviteCodeDC,
  //  A
  common: stateItemInviteCodeReferA,
};

/**
 *  （ throttle）
 */
export default class InviteUrlCtrl {
  static _Instance: InviteUrlCtrl;
  static get Instance() {
    if (!InviteUrlCtrl._Instance) {
      InviteUrlCtrl._Instance = new InviteUrlCtrl();
    }
    return InviteUrlCtrl._Instance;
  }

  private _ls: LocalStorage;
  private constructor() {
    this._ls = new LocalStorage({
      prefix: 'VD1SL_',
      version: 2,
      timeout: MS_MINUTES_30,
    });
  }

  //#region nodejs

  private _nodejsStateItemCache: {
    [key: string]: AsyncStateItem<string, undefined, IHttpResponse<string>>;
  } = {};

  /**
   *  nodejs url( NODEJS_SHARENUMBER_MAP ， ， A meta )
   */
  async getNodeJsInviteUrlByShareNumber(
    shareNumber: INODEJS_SHARE_NUMBER_TYPE
  ) {
    const stateItem = this.getStateItemForNodeJsInviteUrl(shareNumber);
    return stateItem.tryUpdate(MS_MINUTES_30).then((res) => {
      if (res.ok) {
        return res.result;
      }
      return null;
    });
  }
  /**
   *  nodejs url( NODEJS_SHARENUMBER_MAP ， ， A meta )
   */
  getStateItemForNodeJsInviteUrl(
    customShareNumber?: INODEJS_SHARE_NUMBER_TYPE
  ) {
    const shareNumber = customShareNumber;
    const lang = getCurrentLang();
    const query = {
      campaignPid: NODEJS_SHARE_CAMPAIGNPID,
      shareNumber,
      l: lang,
    };
    const cacheKey = `nodeshare_${query.campaignPid}|${query.shareNumber}|${lang}`;
    const cacheUrl = this._ls.getItem<string>(cacheKey, {
      timeout: MS_MINUTES_30,
    });

    let stateItem = this._nodejsStateItemCache[cacheKey];
    //  stateItem
    if (!stateItem) {
      stateItem = createHttpAsyncStateItem(
        () => {
          return getNodeShareLink(query).then((res) => {
            if (res.success && res.data) {
              this._ls.setItem<string>(cacheKey, res.data);
            }
            return res;
          });
        },
        cacheUrl,
        'NodeShare'
      );
      if (cacheUrl) {
        stateItem.setSuccessResult(cacheUrl);
      }
      this._nodejsStateItemCache[cacheKey] = stateItem;
    }
    return stateItem;
  }

  //#endregion

  /**
   *  （ 30min)
   * @param inviteType ( tp/ /shareNumber)
   * @param pf
   * @returns
   */
  async getInviteUrlInfo(
    tp: TYPE_TP_SHARE_TYPES,
    shareNumber: INODEJS_SHARE_NUMBER_TYPE,
    pf?: SHARE_PLATFORM | null,
    /**
     *
     */
    from?: string
  ) {
    await waitUserIsLoginedAuth();
    return Promise.all([
      this.getNodeJsInviteUrlByShareNumber(shareNumber),
      this.getInviteCodeByInviteType(tp),
    ]).then(([nodeJsUrlRes, inviteCodeRes]) => {
      let url: string = null;
      const inviteCode = inviteCodeRes.Result === 1 ? inviteCodeRes.data : null;

      if (nodeJsUrlRes && inviteCode) {
        url = this.combineInviteUrl(
          {
            tp,
            nodejsUrl: nodeJsUrlRes,
            inviteCode: inviteCode,
            by: getStore().state.user.nickName,
          },
          pf,
          from
        );
      }
      return {
        url,
        inviteCode,
        nodejsUrl: nodeJsUrlRes,
        sharePlatform: pf,
      };
    });
  }

  // /**
  //  *  ，
  //  * @param lang
  //  */
  // async getInviteUrl(
  //   tp: TYPE_TP_SHARE_TYPES,
  //   shareNumber: INODEJS_SHARE_NUMBER_TYPE,
  //   pf: SHARE_PLATFORM | null
  // ) {
  //   return this.getInviteUrlInfo(tp, shareNumber, pf).then((res) => {
  //     return res.url;
  //   });
  // }

  /**
   *  url
   * @param inviteType
   * @param nodejsUrl
   * @param inviteCode
   * @param pf
   * @returns
   */
  combineInviteUrl(
    data: {
      tp: TYPE_TP_SHARE_TYPES;
      nodejsUrl: string;
      inviteCode: string;
      by: string;

      pkgName?: string;
    },
    pf?: SHARE_PLATFORM | null,
    /**
     *
     */ from?: string
  ) {
    const { tp, nodejsUrl, inviteCode, by, pkgName } = data;
    let url = `${nodejsUrl}?tp=${tp}&ik=${inviteCode}`;
    [
      ['pf', pf],
      ['pkgName', pkgName],
      ['by', stringShield(by, true)],
      ['from', from],
    ].forEach(([k, v]) => {
      if (v != null) {
        url += `&${k}=${encodeURIComponent(v)}`;
      }
    });
    return normalizeUrlOrPath(url);
  }

  //#region  --
  /**
   *  （ 30 ），
   *  : DC,CarveUp,Other(Refer)
   * @param tp
   * @returns
   */
  async getInviteCodeByInviteType(_tp: TYPE_TP_SHARE_TYPES) {
    const getCodeType: CODETYPE = 'common'; // tp === SHARE_TYPES_INVITE_DC ? 'dc' :

    const stateItem = this.getStateItemInviteCodeByInviteType(getCodeType);
    return stateItem.tryUpdate(MS_MINUTES_30).then((res) => {
      return {
        Result: res.ok ? 1 : 0,
        data: res.result,
      };
    });
  }

  getStateItemInviteCodeByInviteType(getCodeType: CODETYPE) {
    const stateItem = GETCODE_MAP[getCodeType];
    return stateItem;
  }
  //#endregion

  //#region  facebook
  async preloadShareLinkForFacebook(
    shareNumber: number,
    data: {
      /**
       *
       */
      id: string;
      title?: string;
      description?: string;
      iconUrl: string;
    }
  ) {
    // const shareNumber = this.getNodeJsShareNumByInviteType(tp);
    return getAndPreloadShareLinkExt({
      campaignPid: NODEJS_SHARE_CAMPAIGNPID,
      shareNumber,
      ...data,
    });
  }
  //#endregion
}
