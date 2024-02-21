import { MS_MINUTES_30 } from '@/constants/time';
import {
  INODEJS_SHARE_NUMBER_TYPE,
  SHARE_PLATFORM,
  SHARE_TYPES_VGAME,
  TYPE_TP_SHARE_TYPES,
} from '@/constants/invite';
import Vue from 'vue';
import Component from 'vue-class-component';
import { getVReferUtils } from './vInvite';
import InviteUrlCtrl from '@/controller/InviteUrlCtrl';

import type { IInvitePageSourceType } from '@/modules/vRedirect';
import type AsyncStateItem from '@/controller/AsyncStateItem';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import type { IShareInfoOrGetShareInfo } from '@/controller/ReferUtils';
import { getStore } from '@/store/util';

const stateItemInviteCode =
  InviteUrlCtrl.Instance.getStateItemInviteCodeByInviteType('common');

const URL_TIMEOUT = MS_MINUTES_30;
/**
 * V
 */
@Component({})
export class VInviteMixin extends Vue {
  //#region
  /**
   *
   * @param shareInfoOrFunc        （     ），       SHARE_TYPES_VGAME
   * @returns
   */
  initInviteByTp(
    nodejsShareNumberList: INODEJS_SHARE_NUMBER_TYPE[],
    shareInfoOrFunc?: IShareInfoOrGetShareInfo
  ) {
    nodejsShareNumberList.forEach((nodejsShareNumber) => {
      this.$set(
        this.inviteUrlStateRefMap,
        nodejsShareNumber,
        InviteUrlCtrl.Instance.getStateItemForNodeJsInviteUrl(nodejsShareNumber)
          .ref
      );
    });
    const referUtil = getVReferUtils(SHARE_TYPES_VGAME);
    return referUtil.initRefer(
      {
        needPrepackApk: true,
        shareNumberList: nodejsShareNumberList,
      },
      shareInfoOrFunc
    );
  }

  //#endregion

  //#region
  stateItemInviteCodeRef = stateItemInviteCode.ref;

  /**
   *
   */
  get InviteCode() {
    return this.stateItemInviteCodeRef.current;
  }
  //#endregion

  //#region

  protected inviteUrlStateRefMap: Partial<{
    [nodejsShareNumber: number]: AsyncStateItem<
      string,
      undefined,
      IHttpResponse<string>
    >;
  }> = {
    // [SHARE_TYPES_VRIGHT]: null,
    // [SHARE_TYPES_VGAME]: null,
  };

  /**
   *   reactive url
   * @param shareNumber
   * @param pkgName
   * @returns
   */
  protected _createTpInviteUrl(
    shareNumber: INODEJS_SHARE_NUMBER_TYPE,
    pkgName?: string,
    from?: string
  ) {
    const inviteCode = this.InviteCode; // must declare before if to be reactive!!
    const nodejsUrl =
      InviteUrlCtrl.Instance.getStateItemForNodeJsInviteUrl(shareNumber).ref
        .current;
    if (!nodejsUrl) {
      return null;
    }
    if (!inviteCode) {
      return null;
    }
    return InviteUrlCtrl.Instance.combineInviteUrl(
      {
        pkgName,
        tp: SHARE_TYPES_VGAME,
        nodejsUrl,
        inviteCode: inviteCode,
        by: getStore().state.user.nickName,
      },
      null,
      from
    );
  }
  //
  // @Watch('$ss.state.user.userId')
  // onUserIdChanged(userId: string, oldUserId: string) {
  //   if (oldUserId && userId && oldUserId !== userId) {
  //     //
  //     stateItemInviteCode.clearResult();
  //   }
  // }
  /**
   *         ，
   * @param shareNumber
   * @param pkgName
   * @returns url
   * @throws none
   */
  protected async getTpInviteUrlAsync(
    shareNumber: INODEJS_SHARE_NUMBER_TYPE,
    pkgName?: string,
    from?: string
  ) {
    const isLogined = await waitUserIsLoginedAuth();
    if (!isLogined) {
      return null;
    }
    await Promise.all([
      InviteUrlCtrl.Instance.getStateItemForNodeJsInviteUrl(
        shareNumber
      ).tryUpdate(URL_TIMEOUT),
      stateItemInviteCode.tryUpdate(URL_TIMEOUT),
    ]);

    return this._createTpInviteUrl(shareNumber, pkgName, from);
  }

  //#endregion

  /**
   *   app      (    )
   */
  async onShareClick(
    isQuickShare: boolean,
    options: IShareOption,
    shareInfoOrFunc?: IShareInfoOrGetShareInfo
  ) {
    const {
      shareNumber,
      tp = SHARE_TYPES_VGAME,
      traceParams,
      title,
      subTitle,
      from,
      platforms,
      ...rest
    } = options;
    // if (!ButtonLockController.Instance.tryGetNavLock()) {
    //   return;
    // }
    const referUtil = getVReferUtils(tp);

    return await referUtil[
      isQuickShare ? 'onQuikReferLinkClick' : 'onReferLinkClick'
    ](
      shareNumber,
      {
        platforms,
        shareType: tp as TYPE_TP_SHARE_TYPES,
        // content: '', //share to WHATSAPP
        showShareDialog: true,
        withApk: true,
        from: from || traceParams.share_type,
        // subCategory: tp === SHARE_TYPES_VGAME ? 7 : undefined,
        title: title || (this.$t('V.gameShareTitle') as string),
        subTitle: subTitle || (this.$t('V.gameShareSlogan') as string),
        traceParams: traceParams ? JSON.stringify(traceParams) : undefined,
        ...rest,
      },
      shareInfoOrFunc
    );
  }
  onQuickShareClick(
    options: IShareOption,
    shareInfoOrFunc?: IShareInfoOrGetShareInfo
  ) {
    return this.onShareClick(true, options, shareInfoOrFunc);
  }
}

type IShareOption = {
  shareNumber: INODEJS_SHARE_NUMBER_TYPE;
  traceParams?: {
    share_initialfrom: string;
    pkg_name?: string;
    /**
     *   ：game，    ：agent_core
      ：invest_passcard
     */
    share_type:
      | 'winbonus_invite' //winBonus
      | 'income_share'
      // | 'gamehall_noinviteicon' //  Tab,
      | 'higgs_share'
      | IInvitePageSourceType;
  };
  /**
   * showShareDialog
   */
  platforms?: SHARE_PLATFORM[];
  /**
   *   SHARE_TYPES_VGAME
   */
  tp?: typeof SHARE_TYPES_VGAME;
  /**
   *    V.gameShareTitle(Come and play games with me!)
   */
  title?: string;
  /**
   *   slogan
   *    V.gameShareSlogan(Build your gaming team and win  together!)
   */
  subTitle?: string;
  /**
   *     traceParams.share_type
   */
  from?: string;

  contentPlatformsMap?: Record<number, string>;

  picPlatformsMap?: Record<number, string>;
};
