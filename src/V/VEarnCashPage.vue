<template>
  <div class="bg-[#FFF2C3] min-h-screen relative z-0">
    <div
      class="absolute top-0 left-0 right-0 -z-10 bg-contain bg-center"
      :style="
        $ss.getters.normalizeCss(
          {
            width: 360,
            height: 320,
          },
          require('@/assets/earncash/bg.png?webp'),
          true
        )
      "
    ></div>
    <HeaderTop
      left-icon="icon-left"
      left-icon-event="earn_entrance_landingpage_back"
      :bar-background="statusBarColor"
      skin="dark"
    >
      <div slot="default" class="text-center w-full">
        {{ $t('VEC.MyCash') }}
      </div>
      <div
        slot="beforeInner"
        class="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[length:100%_auto] bg-top bg-no-repeat"
      >
        <div
          class="bg-contain bg-center"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 360,
                height: 320,
              },
              require('@/assets/earncash/bg.png?webp'),
              true
            )
          "
        ></div>
      </div>
      <button slot="right">
        <ib
          class="iconfont icon-question-outline scale-90 text-white"
          @click="openEarnCashDlg"
        ></ib>
      </button>
    </HeaderTop>
    <main class="px-3 py-4 flex-1 overflow-y-auto relative">
      <div class="flex flex-col items-center text-white mb-5">
        <div class="font-robot-bold font-bold text-4xl text-white">
          {{ txtUserRp }}
        </div>
      </div>
      <div class="mb-7 flex items-center justify-center">
        <button
          class="text-sm rounded-full h-9 text-center truncate active:scale-95 px-5 inline-block bg-[#FFE761] text-[#B02620] font-robot-bold font-bold"
          @click="onWithdrawClick"
        >
          {{ withdrawBtnText }}
        </button>
      </div>
      <div
        @click="onReferMoneyClick"
        class="bg-center bg-[length:100%_auto] bg-no-repeat relative mb-7"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 336,
              height: 228,
            },
            $ss.getters.translateImage({
              en: require('@/assets/earncash/invitebanner.png?webp'),
              id: require('@/assets/earncash/invitebanner-id.png?webp'),
            }),
            true
          )
        "
      >
        <RibbonTitleUI class="absolute -top-3 left-0 mt-0.5">
          {{ $t('VEC.referTitle') }}
        </RibbonTitleUI>

        <div class="absolute bottom-5 -translate-x-1/2 left-1/2">
          <button
            class="h-9 rounded-full bg-gradient-to-b from-[#FBFCC2] via-[#FDDF03] to-[#FED507] text-[#B21207] font-robot-bold font-bold px-4 flex items-center justify-center animate-infinite whitespace-nowrap breathe animated"
            :style="{
              boxShadow:
                '0px -3px 0px 0px #FF9C0A inset,  0 4px 6px -1px rgba(153,0,255,0.25), 0 2px 4px -2px  rgba(153,0,255,0.25)',
              textShadow: '0px 1px 0px #fffcbe',
            }"
          >
            {{ $t('VEC.inviteToEarnNow') }}
          </button>
        </div>
      </div>
      <EarnCashMiniGame class="mb-7 relative">
        <RibbonTitleUI class="absolute -top-3 left-0 z-[1]">
          {{ $t('VEC.Game') }}
        </RibbonTitleUI>
      </EarnCashMiniGame>
      <div class="mb-7 relative">
        <RibbonTitleUI class="absolute -top-3 left-0">
          {{ $t('VEC.dailyRewards') }}
        </RibbonTitleUI>
        <div
          @click="onCheckinClick"
          class="bg-contain bg-center bg-no-repeat"
          :style="
            $ss.getters.normalizeCss(
              { width: 336, height: 574 / 2 },
              $ss.getters.translateImage({
                id: require('@/assets/earncash/weekcard-id.png'),
                en: require('@/assets/earncash/weekcard-en.png'),
              }),
              false
            )
          "
        ></div>
      </div>
      <div class="mb-7 relative">
        <RibbonTitleUI class="absolute -top-3 left-0">
          {{ $t('VEC.growTitle') }}
        </RibbonTitleUI>
        <div
          @click="onGrowPlanClick"
          class="bg-contain bg-center bg-no-repeat"
          :style="
            $ss.getters.normalizeCss(
              { width: 336, height: 200 },
              $ss.getters.translateImage({
                id: require('@/assets/earncash/growbanner-id.png'),
                en: require('@/assets/earncash/growbanner-en.png'),
              }),
              false
            )
          "
        ></div>
      </div>
      <EarnMission class="mb-3"></EarnMission>
      <portal to="modal">
        <EarnCashTipDlg v-model="isEarnCashTipShow"></EarnCashTipDlg>
        <EarnCashSmallWithdrawTip
          v-model="isSmallWithdrawTipShow"
          :txt-money="smallWithdrawTxt"
        ></EarnCashSmallWithdrawTip>
      </portal>
      <VTaskLogicGlobal v-model="isSmallWithdrawTipShow"></VTaskLogicGlobal>
    </main>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';

import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjEarningCash } from '@/locales/Page/VPrj/VEC/init';

import EarnMission from '@/modules/EarnCash/EarnMission.vue';

import HeaderTop from '@/components/HeaderTop/index.vue';
import VTaskLogicGlobal from '@/modules/VTask/VTaskLogicGlobal.vue';
import { VCoinPriceInfoMixin } from '@/modules/VAssetInfo/VCoinPriceInfo.state';
import { formatVRp } from '@/modules/vFormatter';
import ButtonLockController from '@/controller/ButtonLockController';
import { goToGoldWithdraw } from '@/modules/vRedirect';
import {
  ROUTENAME_INAPP_V_EARN_CASH,
  ROUTEPATH_V_REFER_MONEY,
} from '@/constants/localRoutePath';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import { VCheckinActivityMixin } from '@/modules/CheckinActivity/VCheckinActivity.state';
import { onGBus } from '@/utils/GBus';
import EarnCashTipDlg from '@/modules/EarnCash/EarnCashTipDlg.vue';
import { startsWith } from 'lodash-es';
import { VUserFissionStatMixin } from '@/modules/EarnCash/VUserFissionStat.state';
import { VFissionTaskMixin } from '@/modules/EarnCash/VFissionTask.state';
import EarnCashSmallWithdrawTip from '@/modules/EarnCash/EarnCashSmallWithdrawTip.vue';
import { getEarnCashSmallWithdrawDlgInfo } from '@/controller/PersistentLocalStorage';
import { setEarnCashSmallWithdrawDlgInfo } from '../controller/PersistentLocalStorage';
import RibbonTitleUI from '@/modules/EarnCash/RibbonTitleUI.vue';
import { waitUserIsLoginedAuth } from '../store/modules/user.utils';
import { navigation_login_bridge } from '../js_bridge/js_call_app_base';
import { Watch } from 'vue-property-decorator';
import { BannerOpType } from '@/constants/BannerOpType';
import { getGoldWithdrawUrl } from '../modules/vRedirect';
import { Toast } from 'vant';
import EarnCashMiniGame from '@/modules/EarnCash/EarnCashMiniGame.vue';
import { getFirstString } from '@/utils/string';
import { MS_SECOND } from '@/constants/time';
import { APP_ROUTE_TAB_GAME } from '@/constants/APP_SCHEMA_URLS';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjEarningCash();

@Component({
  components: {
    HeaderTop,
    EarnMission,
    VTaskLogicGlobal,
    EarnCashTipDlg,
    EarnCashSmallWithdrawTip,
    RibbonTitleUI,
    EarnCashMiniGame,
  },
})
export default class VEarnCashPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  VFissionTaskMixin,
  VUserFissionStatMixin,
  VCoinPriceInfoMixin,
  VCheckinActivityMixin
) {
  statusBarColor = '#FF5D54';
  useInited() {
    this.$trace('earn_entrance_landingpage_exposure', {
      open_source: getFirstString(this.$route.query.from) || '',
    });
    waitUserIsLoginedAuth().then(() => {
      this.isLoginedInited = true;
    });
    this.refreshVFissionTask();
    this.refreshVUserFissionStat().then((res) => {
      if (res.ok) {
        if (this.VUserFissionStat?.hasSmallWithdraw) {
          this.tryOpenSmallWithdrawTip();
        }
      }
      if (!res.ok && res.error?.message) {
        Toast(res.error.message);
      }
    });
    this.refreshVCheckinActivity();
    this.refreshVCoinPriceInfo();
    const cancel1 = onGBus('onVUserAssetInfoChanged', () => {
      this.refreshVUserFissionStat(10);
    });
    const cancel2 = onGBus('onVTaskUpdate', (payload) => {
      if (
        (payload.type === 'single' &&
          startsWith(payload.taskModuleType, 'EARN_CASH_')) ||
        payload.type === 'behavior'
      ) {
        if (payload.type === 'single' && payload.taskDealType === 'Claim') {
          this.refreshVUserFissionStat(10);
        }
        this.refreshVFissionTask(10);
      }
    });
    return () => {
      cancel1();
      cancel2();
    };
  }

  @Watch('$ss.state.bridge.webviewResumeFlag')
  onwebviewResumeFlag() {
    this.refreshVUserFissionStat(MS_SECOND);
  }

  isLoginedInited = false;
  @Watch('$ss.state.user.isLogined')
  onUserLogined(isLogined: boolean) {
    if (isLogined && this.isLoginedInited) {
      this.refreshVUserFissionStat();
      this.refreshVFissionTask();
      this.refreshVCheckinActivity();
    }
  }

  get isLogined() {
    return this.$ss.state.user.isLogined;
  }

  formatGold(gold: string | number) {
    const CoinPriceInfo = this.CoinPriceInfo;
    if (gold == null || !CoinPriceInfo) {
      return '-';
    }

    const rp = Number(gold) / Number(CoinPriceInfo.rpToGold);
    return 'Rp ' + formatVRp(rp);
  }

  get txtUserRp() {
    return this.formatGold(this.VUserFissionStat?.userGoldAmount);
  }

  //#region

  get withdrawBtnText() {
    return this.isLogined
      ? this.$t('VEC.withdrawNow')
      : this.$t('VEC.loginToWithdraw');
  }
  async onWithdrawClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    await waitUserIsLoginedAuth();
    if (!this.isLogined) {
      navigation_login_bridge(ROUTENAME_INAPP_V_EARN_CASH, {
        opType: BannerOpType.AppLink,
        to: getGoldWithdrawUrl(ROUTENAME_INAPP_V_EARN_CASH),
      });
      return;
    }
    this.$trace('click_earn_entrance_withdrawal');
    goToGoldWithdraw(ROUTENAME_INAPP_V_EARN_CASH, true);
  }
  //#endregion

  async onReferMoneyClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_earn_entrance_invite');
    openAppH5LinkPreferLocal(ROUTEPATH_V_REFER_MONEY, {
      checkLogin: {
        traceEvent: ROUTENAME_INAPP_V_EARN_CASH,
        openAfterLogin: true,
      },
    });
  }

  isEarnCashTipShow = false;
  openEarnCashDlg() {
    this.$trace('click_earn_entrance_makemoney');
    this.isEarnCashTipShow = true;
  }

  isSmallWithdrawTipShow = false;
  get smallWithdrawTxt() {
    const num = this.VUserFissionStat?.smallWithdrawAmountLimit;
    if (num != null) {
      return `Rp` + num;
    }
    return '';
  }

  tryOpenSmallWithdrawTip() {
    const res = getEarnCashSmallWithdrawDlgInfo();
    const curUserId = this.$ss.state.user.userId;
    if (res && res.userId == this.$ss.state.user.userId) {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[SmallWithdraw] hasShowed ignore');
      }

      return;
    } else if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[SmallWithdraw] showDlg');
    }
    setEarnCashSmallWithdrawDlgInfo({ userId: curUserId });
    this.isSmallWithdrawTipShow = true;
  }

  async onCheckinClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    const isLogined = await waitUserIsLoginedAuth();
    this.$trace('click_earn_entrance_week', {
      is_logined: isLogined ? '1' : '0',
    });
    if (!isLogined) {
      openAppH5LinkPreferLocal(APP_ROUTE_TAB_GAME, {});
      return;
    }
    openAppH5LinkPreferLocal(
      '/h5command/openGameHallDlg?type=WEEK_RECHARGE',
      {}
    );
  }

  async onGrowPlanClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_earn_entrance_growth_plan');
    openAppH5LinkPreferLocal(
      '/h5command/openGameHallDlg?type=GROWTH_PLAN&from=EARN_CASH',
      {}
    );
  }
}
</script>
@/constants/APP_SCHEMA_URLS
