<template>
  <div
    class="w-[360px] h-screen bg-[#FFF7D9] font-rubik"
    :style="{
      background:
        'linear-gradient(180deg,#FF2D5F 0%, #FF2D5F ' +
        $ss.getters.designPxToReal(topBannerDHeight) +
        'px,#FFF7D9 90.95%, #FFF7D9 100%)',
    }"
  >
    <HeaderTopBanner
      left-icon="icon-back"
      :style="$ss.getters.designPxsObjToReal({ height: topBannerDHeight })"
      class="z-10"
      :bg-linner="'transparent'"
      :bottom-threshold="0.05"
      left-icon-event="earn_entrance_invite_landingpage_back"
      skin="dark"
    >
      <!-- refer list -->
      <div
        slot="title"
        class="relative w-[280px] bg-[#EE3360] px-2 rounded-full h-5 flex items-center justify-center text-white text-xs"
      >
        <VUserRedeemNoticeBar></VUserRedeemNoticeBar>
      </div>
      <div
        :style="
          $ss.getters.designPxsObjToReal({
            width: 360,
            height: topBannerDHeight,
            background:
              'linear-gradient(180deg,#FF2D5F 0%, #FAA7AA 62%,#FE4869 90.95%, #FF506E 100%)',
          })
        "
        class="pt-14"
      >
        <section class="text-center font-bold">
          <div class="text-3xl text-white">{{ $t('VRM.iniviteBonus') }}</div>
          <div class="text-5xl text-[#FFFA78]">
            {{ $t('Base.xRp', { n: $ss.getters.formatFloat(3000000) }) }}
          </div>
        </section>
        <div
          class="bg-contain bg-center bg-no-repeat mx-auto"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 335,
                height: 180,
              },
              bannerImage,
              true
            )
          "
        ></div>
        <!-- BtnBlock -->
        <div class="mx-8 mb-4 -mt-9 relative">
          <div
            class="absolute h-11 w-full translate-y-1.5 rounded-full bg-[#FF9E2D] shadow-md shadow-[#EE3360]"
          ></div>
          <button
            class="bg-gradient-to-b w-full relative z-0 from-[#FFFCBE] to-[#FFD600] h-11 rounded-full font-rubik font-bold text-xl text-[#B21207] flex items-center justify-center active:scale-95"
            @click="onInviteClicked"
          >
            {{ $t('VRM.referNow') }}
            <VHandGuide
              :img="require('@/assets/referMoney/btn_hand_red.png')"
              :style="
                $ss.getters.designPxsObjToReal({
                  right: 4,
                  top: 16,
                  transform: 'scale(0.8)',
                })
              "
              circle-class-name="-left-2 -top-3"
            ></VHandGuide>
          </button>
        </div>
        <div class="flex justify-center mb-2">
          <div
            class="text-center mx-auto rounded-md pl-2 pr-4 h-5 text-[#FFCE4F] bg-[#B42535] text-sm"
            @click="onCopyLink"
          >
            <ib class="iconfont icon-copy2 scale-90"></ib>
            {{ $t('Base.CopyLink') }}
          </div>
        </div>
        <div
          class="mx-3 h-5 bg-[#EE3360] flex items-center justify-center rounded-md overflow-hidden"
        >
          <i18n
            tag="div"
            path="VRM.totalGiven"
            class="text-[#23030B] robot text-xs scale-90 flex-1 whitespace-nowrap"
          >
            <span class="inline-block robot-medium ml-0.5 text-[#FFFA8B]">
              Rp {{ txtDeliverNum }}
            </span>
          </i18n>
        </div>
      </div>
    </HeaderTopBanner>
    <main
      class="pt-[56px] -mt-[56px] flex flex-col relative z-0 bg-gradient-to-b from-[#FF506E] to-[#FFF7D9] px-3"
      :style="{
        background:
          'linear-gradient(180deg, #FF4366 0%, #FF4366 3.5rem, #FFF7D9 100%)',
      }"
    >
      <VReferMoneyRewardClaimBlock
        class="mb-1.5"
        @invite="onInviteClicked"
      ></VReferMoneyRewardClaimBlock>
      <!-- Tabs -->
      <div class="shrink-0 flex items-center">
        <div
          class="flex-1 h-9 flex items-center justify-center font-rubik rounded-t-[10px] relative overflow-hidden"
          v-for="tabItem in tabList"
          @click="selectTabItem(tabItem)"
          :class="{
            'text-[#23030B] text-xs bg-[#EE3360]': tabItem.idx !== curTabIdx,
            'text-[#881631]  text-sm font-medium bg-gradient-to-b from-[#FFF06B] to-[#FFE3C1]':
              tabItem.idx === curTabIdx,
          }"
          :key="tabItem.idx"
        >
          {{ tabItem.title }}
        </div>
      </div>
      <div class="mb-3">
        <section
          class="rounded-b-[10px] bg-gradient-to-b from-[#FFE3C1] to-[#FFFCF0] text-[#853D14] overflow-auto"
          :style="$ss.getters.normalizeCss({ height: 410 })"
        >
          <VReferMoneyInviteTab
            ref="inviteTab"
            v-show="curTabName === 'invite'"
          ></VReferMoneyInviteTab>
          <VReferMoneyTeamTab
            v-show="curTabName === 'team'"
            @openInviteTipDlg="openInviteTipDlg"
          ></VReferMoneyTeamTab>
          <template v-if="isTabInited['record']">
            <VReferMoneyRecordTab
              v-show="curTabName === 'record'"
            ></VReferMoneyRecordTab
          ></template>
        </section>
      </div>
      <div class="shrink-0 pb-4">
        <div
          class="border-[2px] border-solid border-[#FFDBBB] text-[#E19F7A] text-center rounded-full font-rubik text-xs robot-medium py-2 active:scale-95 flex items-center justify-center"
          @click="onBecomeGameAgent"
        >
          <div class="mr-1 leading-none">
            {{ $t('VRM.becomeGameAgent') }}
          </div>
          <div
            class="inline-block bg-contain bg-center"
            :style="
              $ss.getters.normalizeCss(
                { width: 18, height: 18 },
                require('@/assets/referMoney/directionRight.png')
              )
            "
          ></div>
        </div>
      </div>
      <VReferShareImageTool ref="posterTool"></VReferShareImageTool>
    </main>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component, { mixins } from 'vue-class-component';
import HeaderTopBanner from '@/components/HeaderTopBanner/index.vue';
import { tryMergeLocalesForVReferMoney } from '@/locales/Page/VPrj/VRM/init';
import VUserRedeemNoticeBar from '@/modules/ReferMoney/VUserRedeemNoticeBar.vue';
import VReferMoneyInviteTab from '@/modules/ReferMoney/VReferMoneyInviteTab.vue';
import ButtonLockController from '@/controller/ButtonLockController';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import {
  dismissLoading_bridge,
  navigation_login_bridge,
  showLoading_bridge,
} from '@/js_bridge/js_call_app_base';
import {
  ROUTENAME_INAPP_V_REFER_MONEY,
  ROUTEPATH_V_PROMOTE_INCOME,
  ROUTEPATH_V_PROMOTE_INCOME_NEWBIE,
} from '@/constants/localRoutePath';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import { VInviteMixin } from '@/modules/VInvite/VInviteMixin';
import VReferMoneyTeamTab from '@/modules/ReferMoney/VReferMoneyTeamTab.vue';
import VReferMoneyRecordTab from '@/modules/ReferMoney/VReferMoneyRecordTab.vue';
import {
  NODEJS_SHARE_NUMBER_REFERMONEY,
  SHARE_PLATFORM,
} from '@/constants/invite';
import { pasteStr } from '@/js_bridge/js_call_app_base';
import { Toast } from 'vant';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { waitShareInfoForEarn } from '@/modules/VInvite/vInvite';
import { MS_SECOND } from '@/constants/time';
import { totalDeliveredUserFissionController } from '@/vservices/restful/UserFissionController';
import { recordGameInviteController } from '@/vservices/client/GameInviteController';
import VHandGuide from '@/components/VHandGuide.vue';
import VReferShareImageTool from '@/modules/ReferMoney/VReferShareImageTool.vue';
import { isFileExists } from '../js_bridge/js_call_app_base';
import { checkMinVersionName } from '../store/modules/app/checkMinVersionName';
import {
  getReferMoneyPosterLs,
  removeReferMoneyPosterLs,
  setReferMoneyPosterLs,
} from '@/controller/CommonLocalStorage';
import { getFirstString } from '@/utils/string';
import VReferMoneyRewardClaimBlock from '@/modules/ReferMoney/VReferMoneyRewardClaimBlock.vue';
import { AppPkgName } from '@/constants/AppPkgName';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVReferMoney();

@Component({
  components: {
    HeaderTopBanner,
    VUserRedeemNoticeBar,
    VReferMoneyInviteTab,
    VReferMoneyTeamTab,
    VReferMoneyRecordTab,
    VHandGuide,
    VReferShareImageTool,
    VReferMoneyRewardClaimBlock,
  },
})
export default class VReferMoneyPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  VInviteMixin
) {
  $refs: { posterTool: VReferShareImageTool; inviteTab: VReferMoneyInviteTab };
  statusBarColor = '#FF2D5F';

  get queryFrom() {
    return getFirstString(this.$route.query.from) || '';
  }
  useInited() {
    this.$trace(
      'earn_entrance_invite_landingpage_exposure',
      this.commonTraceParams
    );
    totalDeliveredUserFissionController().then((res) => {
      if (res.success) {
        this.deliverNum = Number(res.data);
      } else {
        this.deliverNum = null;
      }
    });
    const interval = setInterval(() => {
      if (this.deliverNum != null) {
        this.deliverNum += 300;
      }
    }, MS_SECOND * 10);
    const clearInvite = this.initInviteByTp(
      [NODEJS_SHARE_NUMBER_REFERMONEY]
      // waitShareInfoForEarn
    );
    if (this.supportInsPoster) {
      setTimeout(() => {
        this.saveSharePoster('init');
      }, 100);
    }
    //
    return () => {
      clearInterval(interval);
      clearInvite();
    };
  }

  get bannerImage() {
    return require('@/assets/referMoney/bgInvite-vgame.png?webp');
  }

  deliverNum: number = null;

  get txtDeliverNum() {
    const deliverNum = this.deliverNum;
    if (!deliverNum) {
      return '-';
    }
    return this.$ss.getters.formatFloat(this.deliverNum);
  }
  openInviteTipDlg() {
    this.$refs.inviteTab.showTipDlg = true;
  }
  get topBannerDHeight() {
    return 398;
  }

  // #region tabList
  curTabIdx = 0;
  isTabInited = { invite: true, team: false, record: false };
  get tabList() {
    return [
      {
        title: this.$t('VRM.invite'),
        name: 'invite',
        idx: 0,
        eventName: 'click_earn_entrance_invite_landingpage_invite',
      },
      {
        title: this.$t('VRM.team'),
        name: 'team',
        idx: 1,
        eventName: 'click_earn_entrance_invite_landingpage_team',
      },
      {
        title: this.$t('VRM.record'),
        name: 'record',
        idx: 2,
        eventName: 'click_earn_entrance_invite_landingpage_record',
      },
    ];
  }
  get curTabName() {
    return this.tabList[this.curTabIdx].name as 'record' | 'team' | 'invite';
  }

  selectTabItem(tabItem: typeof VReferMoneyPage.prototype.tabList[0]) {
    this.curTabIdx = tabItem.idx;
    this.isTabInited[this.curTabName] = true;
    this.$trace(tabItem.eventName, this.commonTraceParams);
  }
  //#endregion

  //#region

  _lastSavePosterPromise: ReturnType<
    typeof VReferShareImageTool.prototype.trySaveImage
  >;
  /**
   *        2852
   * @param _from
   */
  async saveSharePoster(_from: 'init' | 'click') {
    const url = await this.getTpInviteUrlAsync(
      NODEJS_SHARE_NUMBER_REFERMONEY,
      null,
      'EarnP'
    );
    const cacheInfo = getReferMoneyPosterLs();
    if (cacheInfo) {
      if (cacheInfo.url === url) {
        const fileExist = await isFileExists(cacheInfo.picUrl);
        if (fileExist && fileExist.Result === 1 && fileExist.data) {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('[Poster] use cache poster (last pv)', cacheInfo);
          }
          return { Result: 1, data: { picUrl: cacheInfo.picUrl } };
        } else if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log(
            '[Poster] cache poster not exist (last pv) ,reCreate',
            cacheInfo,
            fileExist
          );
        }
      } else {
        removeReferMoneyPosterLs();
      }
    }
    //

    if (this._lastSavePosterPromise) {
      let saveImageResCache = await this._lastSavePosterPromise;
      if (saveImageResCache && saveImageResCache.Result === 1) {
        const fileExist = await isFileExists(saveImageResCache.data.picUrl);
        if (fileExist && fileExist.Result === 1 && fileExist.data) {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('[Poster] use cache poster ', saveImageResCache);
          }
          return saveImageResCache;
        } else if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log(
            '[Poster] cache poster not exist ,reCreate',
            saveImageResCache,
            fileExist
          );
        }
      }
    }
    const saveImagePromise = (this._lastSavePosterPromise =
      this.$refs.posterTool.trySaveImage(url));
    const saveImageRes = await saveImagePromise;
    if (saveImageRes.Result === 0) {
      this._lastSavePosterPromise = null;
    } else if (saveImageRes.data && saveImageRes.data.picUrl) {
      setReferMoneyPosterLs({
        url,
        picUrl: saveImageRes.data.picUrl,
      });
    }
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      if (saveImageRes.Result === 1 && saveImageRes.data.picUrl) {
        const picUrl = saveImageRes.data.picUrl;
        console.log('[Poster] save poster success & save to ls', picUrl);
      } else {
        console.log('[Poster] save poster fail ', saveImageRes);
      }
    }
    return saveImageRes;
  }

  get supportInsPoster() {
    return checkMinVersionName('2.8.5.2'); //     ins
  }

  get commonTraceParams() {
    return {
      open_source: this.queryFrom,
    };
  }

  async onInviteClicked() {
    if (!ButtonLockController.Instance.tryGetNormalLock()) {
      return;
    }
    this.$trace(
      'click_earn_entrance_invite_landingpage_togo',
      this.commonTraceParams
    );
    showLoading_bridge();
    const rawShareInfo = await waitShareInfoForEarn();
    const supportInsPoster = this.supportInsPoster;

    let insPicUrl: string;
    if (supportInsPoster) {
      try {
        let savePosterRes = await this.saveSharePoster('click');
        if (savePosterRes.Result === 1 && savePosterRes.data.picUrl) {
          insPicUrl = savePosterRes.data.picUrl;
        }
      } catch (ex) {
        console.warn('Error', ex);
      }
    }
    dismissLoading_bridge();
    //
    this.onShareClick(
      false,
      {
        shareNumber: NODEJS_SHARE_NUMBER_REFERMONEY,
        traceParams: {
          share_type: ROUTENAME_INAPP_V_REFER_MONEY,
          share_initialfrom: 'invite',
          pkg_name: 'OnlineEarn',
        },
        platforms: supportInsPoster
          ? [
              SHARE_PLATFORM.WHATSAPP,
              SHARE_PLATFORM.FACEBOOK,
              SHARE_PLATFORM.MESSAGER,
              SHARE_PLATFORM.TELEGRAM,
              SHARE_PLATFORM.TWITTER,
              SHARE_PLATFORM.INSTAGRAM,
              // SHARE_PLATFORM.SYSTEMSHARE,
            ]
          : undefined,
        picPlatformsMap: {
          [SHARE_PLATFORM.INSTAGRAM]: insPicUrl,
        },
        contentPlatformsMap: {
          [SHARE_PLATFORM.TWITTER]: this.$t('V.gameShareContent') as string,
        },
      },
      rawShareInfo
    );
  }

  async onCopyLink() {
    if (!ButtonLockController.Instance.tryGetLock('copy', 0.5)) {
      return;
    }
    const url = await this.getTpInviteUrlAsync(
      NODEJS_SHARE_NUMBER_REFERMONEY,
      AppPkgName,
      ROUTENAME_INAPP_V_REFER_MONEY
    );
    this.$trace('click_earn_entrance_invite_landingpage_copy', {
      invite_url: url,
      ...this.commonTraceParams,
    });
    if (!url) {
      Toast(this.$t('Base.RequestError'));
      return;
    }
    pasteStr({ content: url });
    Toast(this.$t('Base.CopySucceeded'));
  }
  //#endregion

  //#region
  async onBecomeGameAgent() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    //      -      （          ，       A  ，      B  ）；

    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      navigation_login_bridge(ROUTENAME_INAPP_V_REFER_MONEY);
      return;
    }
    this.$tracev(
      'click_earn_entrance_invite_landingpage_moreinvite',
      this.commonTraceParams
    );

    const res = await recordGameInviteController();
    const url =
      res.success && res.data === true
        ? ROUTEPATH_V_PROMOTE_INCOME + '?from=refermoney'
        : ROUTEPATH_V_PROMOTE_INCOME_NEWBIE + '?from=refermoney';
    openAppH5LinkPreferLocal(url, {});
  }
  //#endregion
}
</script>
