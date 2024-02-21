<template>
  <div class="p-4 text-base">
    <div class="text-sm mb-2">
      <div v-if="versionWarning" class="text-red-500 text-base">
        {{ versionWarning }}
      </div>
      <div class="flex justify-between items-center">
        <div><b>Logined?:</b> {{ isLogined }}</div>
        <div>
          <b>UserId:</b> {{ $ss.state.user.userId }}
          <button
            class="tz-btn tz-btn-primary m-1"
            v-if="$ss.state.user.userId"
            @click="onCopyUid()"
          ></button>
        </div>
      </div>
      <div class="flex overflow-hidden items-center">
        <b class="mr-1"> :</b>
        <div class="flex-1 overflow-auto">
          {{ authSimple }}
        </div>
        <button
          class="tz-btn tz-btn-primary m-1"
          @click="onCopyAuth()"
        ></button>
      </div>
      <div class="flex items-center">
        <div class="flex-[2]">dn Debug</div>
        <button class="tz-btn tz-btn-primary flex-1" @click="onOpenDebug">
          Debug
        </button>
      </div>
    </div>
    <section class="mb-3">
      <h3 class="robot-bold text-sm"></h3>
      <div class="flex flex-wrap"></div>
      <h3 class="robot-bold text-sm"></h3>
      <div class="flex flex-wrap">
        <button @click="isRewardsShow = true" class="tz-btn tz-btn-primary m-2">
          RewardDlg
        </button>
        <portal to="modal">
          <VGettedRewardsDlg
            v-model="isRewardsShow"
            :rewards="[
              {
                coin: 'GOLD',
                num: 150001,
              },
            ]"
          ></VGettedRewardsDlg>
        </portal>
        <button
          @click="onOpenActivityWithdraw"
          class="tz-btn tz-btn-primary m-2"
        >
          WeekCardWithdraw
        </button>
        <portal to="modal">
          <HiggsDlg v-model="isHiggsOpen"></HiggsDlg>
          <CheckinActivityDlg v-model="isRookiePrizeOpen"></CheckinActivityDlg>
          <DebugQrCodeDlg
            v-model="isQrCodeShow"
            :content="qrCodeContent"
          ></DebugQrCodeDlg>
        </portal>
        <button class="tz-btn tz-btn-primary m-2" @click="onOpenFirstTopup">
          openAppFirstTopup
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="isHiggsOpen = true">
          HiggsDlg
        </button>
        <button
          class="tz-btn tz-btn-primary m-2"
          @click="isRookiePrizeOpen = true"
        >
          RookiePrize
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onReferMoneyOpen">
          ReferMoney
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onReferGameOpen">
          ReferGame
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onEarnCashOpen">
          EarnCash
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onOpenWithdrawPage">
          GoldWithdraw
        </button>
        <button
          class="tz-btn tz-btn-primary m-2"
          @click="onOpenWithdrawHistory"
        >
          GoldWithdrawHistory
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onOpenAcademyCenter">
          AcademyCenter
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onOpenTeamMembers">
          TeamMembers
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onOpenVPlayToEarn">
          VPlayToEarn
        </button>
        <button
          class="tz-btn tz-btn-primary m-2"
          @click="onOpenVPlayToEarnIntro"
        >
          VPlayToEarnIntro
        </button>
        <button
          class="tz-btn tz-btn-primary m-2"
          @click="onOpenVPromoteIncomeHistory"
        >
          VPromoteIncomeHistory
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onOpenVPromoteShare">
          VPromoteShare
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onOpenVPromoteIncome">
          VPromoteIncome
        </button>
        <button class="tz-btn tz-btn-primary m-2" @click="onOpenVPromoteEarn">
          VPromoteEarn
        </button>
      </div>
    </section>

    <div class="flex flex-wrap">
      <button
        class="tz-btn tz-btn-primary m-1"
        @click="onGameClick(0)"
      ></button>
      <button
        class="tz-btn tz-btn-primary m-1"
        @click="onGameClick(1)"
      ></button>

      <button
        class="tz-btn tz-btn-primary m-1"
        @click="isDlgTemplateOpen = true"
      ></button>

      <div>
        <button
          class="tz-btn tz-btn-primary m-1"
          @click="onTestOfflinePkg('/test/b/index.html')"
        >
          /test/b/index.html
        </button>
        <button
          class="tz-btn tz-btn-primary m-1"
          @click="onTestOfflinePkg('/test/b/index')"
        >
          /test/b/index
        </button>
        <button
          class="tz-btn tz-btn-primary m-1"
          @click="onTestOfflinePkg('/test/b')"
        >
          /test/b
        </button>
        <button
          class="tz-btn tz-btn-primary m-1"
          @click="onTestOfflinePkg('/test/a')"
        >
          /test/a
        </button>
        <button
          class="tz-btn tz-btn-primary m-1"
          @click="onTestOfflinePkg('/test/a.html')"
        >
          /test/a.html
        </button>
      </div>
      <DlgTemplate v-model="isDlgTemplateOpen"></DlgTemplate>
    </div>
    <VTaskLogicGlobal></VTaskLogicGlobal>
  </div>
</template>

<script lang="ts">
import {
  ROUTENAME_INAPP_VGAME,
  ROUTEPATH_V_ACADEMY_CENTER,
  ROUTEPATH_V_GOLDWITHDRAW,
  ROUTEPATH_V_PROMOTE_TEAM_MEMBERS,
  ROUTEPATH_V_PLAY_TO_EARN,
  ROUTEPATH_V_PLAY_TO_EARN_NEWBIE,
  ROUTEPATH_V_PROMOTE_INCOME,
  ROUTEPATH_V_PROMOTE_INCOME_NEWBIE,
  ROUTEPATH_V_PROMOTE_INCOME_HISTORY,
  ROUTEPATH_V_PROMOTE_SHARE,
  ROUTEPATH_V_REFER_MONEY,
} from '@/constants/localRoutePath';
import { pasteStr } from '@/js_bridge/js_call_app';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import Vue from 'vue';
import Component from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import DlgTemplate from './DlgTemplate.vue';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import {
  showLoading_bridge,
  dismissLoading_bridge,
} from '@/js_bridge/js_call_app_base';
import { requestVPostData } from '@/http/http';
import { Toast } from 'vant';
import { hideDelayLoading, showDelayLoading } from '@/utils/loadingTool';
import { getGoldWithdrawUrl, goToGoldWithdraw } from '@/modules/vRedirect';
import { BASE_64_TEST_IMG } from './VDebugBase64Image';
import {
  share_bridge,
  getIsAPKListInstalledBatch,
} from '@/js_bridge/js_call_app_base';
import { SHARE_PLATFORM } from '@/constants/invite';
import { saveShareImageBridge } from '@/js_bridge/AndroidBridge/index';
import { ROUTEPATH_V_EARN_CASH } from '@/constants/localRoutePath';
import { ROUTEPATH_V_REFER_GAME } from '@/constants/localRoutePath';
import HiggsDlg from '@/modules/Higgs/HiggsDlg.vue';
import CheckinActivityDlg from '@/modules/CheckinActivity/CheckinActivityDlg.vue';
import DebugQrCodeDlg from '@/components/Biz/DebugTool/DebugQrCodeDlg.vue';
import VTaskLogicGlobal from '@/modules/VTask/VTaskLogicGlobal.vue';
import { getActivityPayForMultiPrice } from '@/constants/APP_SCHEMA_URLS';
import VGettedRewardsDlg from '@/modules/VRewardProps/VGettedRewardsDlg.vue';

@Component({
  components: {
    DlgTemplate,
    HiggsDlg,
    CheckinActivityDlg,
    DebugQrCodeDlg,
    VTaskLogicGlobal,
    VGettedRewardsDlg,
  },
})
export default class VDebugBlock extends Vue {
  get txtVersion() {
    return `${window.GC.appName}-${window.GC.h5Version}-${window.GC.buildNum}`;
  }
  isRewardsShow = false;
  get versionWarning() {
    if (window.GC.appName !== 'wallet') {
      return `Warning:           ,       ！！！`;
    }
    return null;
  }
  get isLogined() {
    return this.$ss.getters['user/isRealLogined'];
  }
  get userAgent() {
    return navigator.userAgent;
  }

  get auth() {
    return this.$ss.state.user.auth;
  }
  isDlgTemplateOpen = false;

  onOpenFirstTopup() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(
      getActivityPayForMultiPrice('5003', 'test' as unknown as any, '50000'),
      {}
    );
  }
  async mounted() {
    await waitUserIsLoginedAuth();
  }
  onGameClick(idx: number) {
    const urlList = ['https://xx.xx.xx.com/', 'http://xxx.com/'];
    const url = urlList[idx];
    openAppH5LinkPreferLocal(`vv://webGame?url=${encodeURIComponent(url)}`, {
      checkLogin: {
        traceEvent: ROUTENAME_INAPP_VGAME,
      },
    });
  }

  async checkPkgInstalled() {
    if (!ButtonLockController.Instance.tryGetLock('pkg', 2)) {
      return;
    }

    const apkListRes = await getIsAPKListInstalledBatch([
      'com.neptune.domino',
      'com.higgs.domino',
    ]);
    if (apkListRes.Result == 1) {
      Toast(`YouHaveInstalled:${(apkListRes.data || []).join(',')}`);
    } else {
      Toast('GetInstall ApkError:' + apkListRes.Reason);
    }
  }

  async onSaveImage() {
    if (!ButtonLockController.Instance.tryGetLock('save', 2)) {
      return;
    }

    const byteCharacters = atob(BASE_64_TEST_IMG.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const res = await saveShareImageBridge(byteArray, 'test.png');
    if (res.Result === 1) {
      Toast(`        :-${JSON.stringify(res.data)}`);
    } else {
      Toast(`          :-${JSON.stringify(res)}`);
    }
    return res;
  }

  onSaveAndShareImage() {
    this.onSaveImage().then((res) => {
      if (res.Result === 1) {
        share_bridge({
          url: res.data?.picUrl,
          shareType: 79,
          inviteCode: 'rrrrZS',
          showShareDialog: false,
          shareLink:
            'http://share.xxx.xxx/s2hwn/hs8/shlgmm2/fd.html?tp=79&ik=rrrrZS&l=en&r=ID&c=ID',
          content: '      ',
          traceParams: JSON.stringify({
            test_param: '111',
          }),
          // subTitle: 'Build your gaming team and win  together!',
          // title: 'Come and play games with me!',
          sharePlatform: SHARE_PLATFORM.WHATSAPP,
          withApk: true,
        });
      }
    });
  }

  onOpenDebug() {
    if (ButtonLockController.Instance.tryGetNavLock()) {
      showDelayLoading(false);
      import('@/components/Biz/DebugTool/index').then((debugTool) => {
        hideDelayLoading();
        debugTool.showDebugTool();
      });
    }
  }
  isQrCodeShow = false;
  qrCodeContent = '';

  get authSimple() {
    return (this.auth || '').substring(0, 25) + '...';
  }
  async onCopyAuth() {
    const isOk = await pasteStr({ content: this.auth });
    if (isOk) {
      //
      Toast(this.$t('Auth    '));
      this.qrCodeContent = this.auth;
      this.isQrCodeShow = true;
    }
  }

  async onCopyUid() {
    const isOk = await pasteStr({ content: this.$ss.state.user.userId });
    if (isOk) {
      //
      Toast(this.$t('UserId    '));
      this.qrCodeContent = this.$ss.state.user.userId;
      this.isQrCodeShow = true;
    }
  }
  // onOpenFullScreenDlg(cancelAble: boolean) {
  //   if (!ButtonLockController.Instance.tryGetNavLock()) {
  //     return;
  //   }
  //   showWebviewDialog({
  //     path: '/Dialog/VTestFullScreen',
  //     cancelAble,
  //   });
  // }

  onTestOfflinePkg(path: string) {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(`${location.origin}${path}`, {});
  }

  testProductId = '1110896113696636928';

  async onCreatePayInTest() {
    if (!this.testProductId) {
      Toast('     id');
      return;
    }
    showLoading_bridge();
    const res = await requestVPostData({
      url: '/v1/pay/createPayInTest',
      data: {
        payChannel: 'EWALLET_DANA',
        productId: this.testProductId,
      },
    });
    dismissLoading_bridge();
    if (res.Result === 1) {
      Toast('    ');
    } else {
      Toast(res.Reason);
    }
  }

  onOpenWithdrawPage() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    goToGoldWithdraw('game_hall', false);
  }

  onOpenAcademyCenter() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_ACADEMY_CENTER, {});
  }

  onOpenWithdrawHistory() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_GOLDWITHDRAW + '?tab=history', {});
  }
  onOpenTeamMembers() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PROMOTE_TEAM_MEMBERS, {});
  }

  onOpenVPlayToEarn() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PLAY_TO_EARN, {});
  }
  onOpenVPlayToEarnIntro() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PLAY_TO_EARN_NEWBIE, {});
  }
  onOpenVPromoteIncome() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PROMOTE_INCOME, {});
  }
  onOpenVPromoteEarn() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PROMOTE_INCOME_NEWBIE, {});
  }
  onOpenVPromoteIncomeHistory() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PROMOTE_INCOME_HISTORY, {});
  }
  onOpenVPromoteShare() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PROMOTE_SHARE, {});
  }
  //#region
  isRookiePrizeOpen = false;
  isHiggsOpen = false;
  //#endregion

  onReferMoneyOpen() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_REFER_MONEY, {});
  }
  onEarnCashOpen() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_EARN_CASH, {});
  }
  onReferGameOpen() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_REFER_GAME, {});
  }

  onOpenActivityWithdraw() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(
      getGoldWithdrawUrl('gamehall_weekcard', 'WEEK_RECHARGE', '1'),
      {}
    );
  }
}
</script>
@/constants/APP_SCHEMA_URLS
