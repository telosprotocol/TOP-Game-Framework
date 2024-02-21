import { getStore } from '@/store/util';
import {
  INODEJS_SHARE_NUMBER_TYPE,
  SHARE_PLATFORM,
  TYPE_TP_SHARE_TYPES,
} from '@/constants/invite';
import InviteUrlCtrl from '@/controller/InviteUrlCtrl';
import {
  IAppShareOption,
  preBuildApkWithKey,
  preDownloadPic,
  share_bridge,
} from '@/js_bridge/js_call_app_base';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { safePerformanceTimeNow } from '@/utils/datetime';
import { tryTraceEvent } from '../utils/trace';
import { hideDelayLoading, showDelayLoading } from '@/utils/loadingTool';
type IReferLinkOptions = Omit<
  IAppShareOption,
  'content' | 'url' | 'shareLink' | 'inviteCode'
> & {
  shareLinkConverter?: (info: {
    inviteCode: string;
    shareLink: string;
  }) => string;

  /**
   *  from （ ）
   */
  from?: string;
};
export type IShareInfoOrGetShareInfo =
  | IShareInfo
  | (() => Promise<IShareInfo | undefined>);
class ReferUtilsBase {
  /**
   * SHARE_TYPE
   */
  private tp: TYPE_TP_SHARE_TYPES;
  get shareType() {
    return this.tp;
  }

  inviteInfoRef: { current: { inviteCode: string; nodejsUrl: string } } = {
    current: { inviteCode: null, nodejsUrl: null },
  };
  constructor(tp: TYPE_TP_SHARE_TYPES) {
    this.tp = tp;
  }

  /**
   *  （shareImage ，facebook meta ）
   * @param shareInfo
   */
  private preloadShareInfo(shareInfo: IShareInfo) {
    //  app
    if (shareInfo.shareImage) {
      preDownloadPic({
        url: shareInfo.shareImage,
      });
    }
    const nodejsShare =
      shareInfo.nodejsShare || ({} as Partial<IShareNodejsInfo>);
    const nodejsKey = nodejsShare.key || '';
    if (nodejsKey) {
      //  meta
      InviteUrlCtrl.Instance.preloadShareLinkForFacebook(
        nodejsShare.shareNumber,
        {
          id: nodejsKey,
          title:
            nodejsShare.title ||
            nodejsShare.description ||
            shareInfo.shareContent,
          description: nodejsShare.description || shareInfo.shareContent,
          iconUrl: nodejsShare.iconUrl || shareInfo.shareImage,
        }
      );
    }
  }
  private preloadShareUrlAndPrepack(
    needPrepackApk: boolean,
    shareNumberList: INODEJS_SHARE_NUMBER_TYPE[]
  ) {
    //
    waitUserIsLoginedAuth().then(() => {
      if (!getStore().getters['user/isRealLogined']) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('UserNotLogined');
        }
        return;
      }
      shareNumberList.map((shareNumber) => {
        this.getInviteUrlInfo(this.tp, shareNumber, null).then((res) => {
          if (res.inviteCode) {
            if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
              console.log('preBuildApkWithKey Before');
            }
            if (needPrepackApk) {
              //
              preBuildApkWithKey({
                platform: SHARE_PLATFORM.WHATSAPP,
                inviteCode: res.inviteCode,
                userId: getStore().state.user.userId,
                tp: this.tp,
              });
            }
          } else if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('preBuildApkWithKey Error ,load inviteCode Error', res);
          }
        });
      });
    });
  }
  private normalizeGetShareInfo(shareInfo?: IShareInfoOrGetShareInfo) {
    if (shareInfo) {
      return typeof shareInfo === 'function'
        ? shareInfo()
        : Promise.resolve(shareInfo);
    } else {
      return;
    }
  }
  /**
   * Refer ( )
   *  apk, ，
   */
  protected initReferRaw(
    options: {
      needPrepackApk: boolean;
      shareNumberList: INODEJS_SHARE_NUMBER_TYPE[];
    },
    /**
     *
     */
    shareInfoOrFunc?: IShareInfoOrGetShareInfo
  ) {
    const { needPrepackApk } = options;
    let timer: ReturnType<typeof setTimeout> = null;
    if (shareInfoOrFunc) {
      timer = setTimeout(async () => {
        const shareInfo = await this.normalizeGetShareInfo(shareInfoOrFunc);
        if (!shareInfo) {
          return;
        }
        this.preloadShareInfo(shareInfo);
      }, 10);
    }
    //   TODO:shareNumberList
    this.preloadShareUrlAndPrepack(needPrepackApk, options.shareNumberList);
    return () => {
      if (timer != null) {
        clearTimeout(timer);
      }
    };
  }

  private _isRefering = false;

  private setIsRefering() {
    this._isRefering = true;
  }

  private get isRefering() {
    return this._isRefering;
  }

  private resetIsRefering() {
    this._isRefering = false;
  }

  private async getInviteUrlInfo(
    tp: TYPE_TP_SHARE_TYPES,
    shareNumber: INODEJS_SHARE_NUMBER_TYPE,
    sharePlatform: SHARE_PLATFORM | null,
    /**
     *
     */
    from?: string
  ) {
    const res = await InviteUrlCtrl.Instance.getInviteUrlInfo(
      tp,
      shareNumber,
      sharePlatform,
      from
    );

    if (res.inviteCode) {
      this.inviteInfoRef.current.inviteCode = res.inviteCode;
    }

    if (res.nodejsUrl) {
      this.inviteInfoRef.current.nodejsUrl = res.nodejsUrl;
    }

    return res;
  }

  private async _referLinkBefore(
    type: string,
    shareNumber: INODEJS_SHARE_NUMBER_TYPE,
    sharePlatform: SHARE_PLATFORM,
    /**
     *
     */
    from?: string
  ) {
    const dtStart = safePerformanceTimeNow();
    showDelayLoading(true);
    const { url, inviteCode } = await this.getInviteUrlInfo(
      this.tp,
      shareNumber,
      sharePlatform,
      from
    );
    hideDelayLoading();
    const dtEnd = safePerformanceTimeNow();
    const spanMS = dtEnd - dtStart;
    if (!url) {
      tryTraceEvent('activity_referlink_fail', {
        type: 'refer-' + type,
        spanMS,
        inviteCode,
      });
      // Toast({
      //   message: this.$t('Base.NETWORK_ERROR') as string,
      // })
      return {};
    }
    return {
      shareLink: url,
      spanMS,
      inviteCode,
      sharePlatform,
    };
  }

  /**
   *  refer
   * ErrCode=4:
   */
  protected async onReferLinkClickRaw(
    shareNumber: INODEJS_SHARE_NUMBER_TYPE,
    options: IReferLinkOptions,
    shareInfoOrFunc: IShareInfo | (() => Promise<IShareInfo | undefined>)
  ) {
    if (this.isRefering) {
      return {
        Result: 0,
        ErrCode: 6,
        status: 1,
        Reason: 'Too frequency',
      };
    }
    const {
      sharePlatform = null,
      showShareDialog,
      platforms: rawPlatforms,
      withApk,
      shareLinkConverter,
      firebaseShortLinkHost,
      from,
      ...rest
    } = options;
    const platforms = showShareDialog
      ? rawPlatforms || [
          SHARE_PLATFORM.WHATSAPP,
          SHARE_PLATFORM.FACEBOOK,
          SHARE_PLATFORM.MESSAGER,
          // SHARE_PLATFORM.INSTAGRAM,
          SHARE_PLATFORM.SYSTEMSHARE,
        ]
      : undefined;
    this.setIsRefering();
    // pf  share
    await waitUserIsLoginedAuth();
    if (!getStore().getters['user/isRealLogined']) {
      this.resetIsRefering();
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('UserNotLogined');
      }
      return {
        Result: 0,
        ErrCode: 4,
        status: 1,
        Reason: 'NotLogin',
      };
    }
    const shareInfo = await this.normalizeGetShareInfo(shareInfoOrFunc);
    if (!shareInfo) {
      this.resetIsRefering();
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('cant get shareinfo');
      }
      return {
        Result: 0,
        ErrCode: 2,
        status: 1,
        Reason: 'Base.UnknownError',
      };
    }

    const { inviteCode, shareLink } = await this._referLinkBefore(
      'refer',
      shareNumber,
      sharePlatform,
      from
    );
    this.resetIsRefering();
    if (!shareLink) {
      console.log('cant get referLink');
      // Toast(this.$t('Base.UnknownError'))
      return {
        Result: 0,
        ErrCode: 1,
        status: 1,
        Reason: 'Base.NETWORK_ERROR',
      };
    }
    const nodejsShare =
      shareInfo.nodejsShare || ({} as Partial<IShareNodejsInfo>);
    const nodejsKey = nodejsShare.key || '';

    let shareLinkWithNodejsMeta = shareLink + (nodejsKey ? '&id=' : nodejsKey);
    if (shareLinkConverter) {
      shareLinkWithNodejsMeta = shareLinkConverter({
        inviteCode,
        shareLink: shareLinkWithNodejsMeta,
      });
    }
    //params
    let shareContent = shareInfo.shareContent;
    if (shareContent) {
      //
      shareContent = replaceInviteCode(shareContent, inviteCode);
    }
    const shareRes = await share_bridge({
      ...rest,
      shareType: options.shareType == null ? this.shareType : options.shareType,
      showShareDialog,
      inviteCode,
      url: shareInfo.shareImage,
      shareLink: shareLinkWithNodejsMeta,
      sharePlatform,
      content: shareContent,
      platforms,
      withApk: withApk ?? shareInfo.withApk ?? true,
      firebaseShortLinkHost:
        firebaseShortLinkHost ?? shareInfo.firebaseShortLinkHost,

      // silent: options.silent,
      // title: options.title,
      // subTitle: options.subTitle,
      // isShowPoster: options.isShowPoster,
      // subCategory: options.subCategory,
      // traceParams: options.traceParams,
    });
    return {
      ...shareRes,
      inviteCode,
    };
  }
}

export function replaceInviteCode(url: string, inviteCode: string) {
  if (url) {
    //
    return url.replace(/{inviteCode}/g, inviteCode);
  }
  return url;
}
/**
 *  :waitShareInfo
 * useInited(){this.initRefer()}
 * async waitShareInfo(){return {shareImage:'',shareContent:""}}
 *
 * onButtonClick(){this.onReferLinkClick}
 */
export class ReferUtils extends ReferUtilsBase {
  /**
   * Refer ( )
   *  apk, ，
   */
  initRefer(
    options: {
      needPrepackApk: boolean;
      shareNumberList: INODEJS_SHARE_NUMBER_TYPE[];
    },
    shareInfoOrFunc?: IShareInfoOrGetShareInfo
  ) {
    return this.initReferRaw(options, shareInfoOrFunc || this.waitShareInfo);
  }

  /**
   *
   * @returns
   */
  async waitShareInfo(): Promise<IShareInfo | undefined> {
    throw new Error('NotImp');
  }

  /**
   *  refer
   * ErrCode=4:
   */
  async onReferLinkClick(
    shareNumber: INODEJS_SHARE_NUMBER_TYPE,
    options: IReferLinkOptions,
    shareInfoOrFunc?: IShareInfoOrGetShareInfo
  ) {
    return this.onReferLinkClickRaw(
      shareNumber,
      options,
      shareInfoOrFunc || this.waitShareInfo
    );
  }

  /**
   *  Refer  TODO
   * @params shareInfo
   */
  async onQuikReferLinkClick(
    shareNumber: INODEJS_SHARE_NUMBER_TYPE,
    options: IReferLinkOptions,
    shareInfoOrFunc?: IShareInfoOrGetShareInfo
  ) {
    return this.onReferLinkClickRaw(
      shareNumber,
      {
        ...options,
        isShowPoster: true,
      },
      shareInfoOrFunc || this.waitShareInfo
    );
  }
}

export interface IShareNodejsInfo {
  /**
   * ( key )
   *  ， key ，
   */
  key: string;

  /**
   *  ， ， shareImage
   */
  iconUrl?: string;

  /**
   *  , nodejsShare.description,shareContent
   */
  title?: string;

  /**
   *  ， shareContent
   */
  description?: string;

  /**
   *  ！！！
   */
  shareNumber: number;
}
export interface IShareInfo {
  /**
   *  ，
   */
  shareImage: string;
  shareContent: string;
  /**
   * node title,desc,iconUrl
   *  ， key ，
   */
  nodejsShare?: IShareNodejsInfo;

  /**
   *  withApk ， withApk or true
   */
  withApk?: boolean;
  /**
   * firebase ， app
   */
  firebaseShortLinkHost?: string;
}

export interface IWaitShareInfoInput {
  inviteCode?: string;
  shareLink?: string;
}
