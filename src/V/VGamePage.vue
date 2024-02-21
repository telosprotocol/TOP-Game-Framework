<template>
  <div
    id="gamePage"
    class="w-[360px] flex flex-col min-h-screen bg-cover bg-top relative"
    :style="
      $ss.getters.normalizeCss(
        { paddingTop: 36 },
        require('@/assets/gameHall/bg.png?webp'),
        true
      )
    "
  >
    <header class="shrink-0 px-2.5 pb-1 flex items-center justify-between">
      <VGameUserInfo class="flex-1 mr-1" ref="userInfo"> </VGameUserInfo>
      <VGameMoreButton ref="more"></VGameMoreButton>
    </header>
    <div class="h-5 mx-3 mb-2">
      <VGameNoticeAsync></VGameNoticeAsync>
    </div>
    <portal-target name="gameMain" multiple></portal-target>
    <VGameBanner class="mb-1 shrink-0 relative"></VGameBanner>
    <main class="relative flex flex-col pb-4">
      <div
        class="shrink-0 px-[5px] mb-[5px]"
        :style="$ss.getters.normalizeCss({ minHeight: 69 })"
      >
        <VHallActivitysBar
          ref="acbar"
          :is-higgs-client-show="isHiggsClientOpen"
        ></VHallActivitysBar>
      </div>
      <VGameListBlock
        ref="gameList"
        @gameOpened="isGameGuideShow = false"
        :show-new-guide="isGameGuideShow"
        :game-menu-list="GameList"
      >
        <AsyncStatus
          color="rgba(255,255,255,0.8)"
          :status="gameStatus"
          :no-data-text="$t('VG.gameIsEmpty')"
          :err-text="$t('VG.gameLoadError')"
        >
          <template slot="retry-btn">
            <button
              class="vbutton vbutton--green font-rubik mx-auto h-10 active:scale-95 mb-3 w-52"
              @click="onGameRefresh"
            >
              <ib class="iconfont icon-refresh mr-1 text-xl"></ib>
              <div>{{ $t('Base.Refresh') }}</div>
            </button>
          </template>
        </AsyncStatus>
      </VGameListBlock>
    </main>
    <VGameGuideLogic
      :get-recomend-game-info="getRecomendGameInfo"
      ref="gameGuide"
      @gameGuide="onGameGuideOpen"
      @gameGuideClosed="isGameGuideShow = false"
    ></VGameGuideLogic>
    <VTaskLogicGlobal></VTaskLogicGlobal>
    <EarnCashSideEntryOnlyForVd></EarnCashSideEntryOnlyForVd>
    <portal to="modal">
      <VFrozenDlg v-model="isFrozenDlgOpen" :info="frozenInfo"></VFrozenDlg>
      <VGetPropsDlg
        v-model="isGlobalGetPropsDlgShow"
        ref="propDlg"
        :on-dlg-close-callback="onGlobalGetPropsCallback"
        :list="globalPropList"
      ></VGetPropsDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { Component, Watch } from 'vue-property-decorator';
import VGameUserInfo from '@/modules/GameHall/VGameUserInfo/VGameUserInfo.vue';
import VGameListBlock from '@/modules/GameHall/VGameList/VGameListBlock.vue';
import { mixins } from 'vue-class-component';
import { AsyncStateErrorEvent } from '@/controller/AsyncStateItem';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import stateItemVGameList, {
  VGameListMixin,
} from '@/modules/GameHall/VGameList/GameList.state';
import { onGBus } from '@/utils/GBus';
import { tryMergeLocalesForVPrjGameTab } from '@/locales/Page/VPrj/VG/init';
import { VRightStatMixin } from '@/modules/VAssetInfo/RightStat.state';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import ButtonLockController from '@/controller/ButtonLockController';
import VGameBanner from '@/modules/GameHall/VGameBanner.vue';
import VFrozenDlg from '@/modules/GameHall/VFrozenDlg/VFrozenDlg.vue';
import {
  dismissLoading_bridge,
  getCurTopPageName,
  notifyGameSettlement,
  getIsInGame,
} from '@/js_bridge/js_call_app_base';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import { tryTraceEvent } from '@/utils/trace';
import { H5Version } from '@/config/version';
import { VMessageStatusMixin } from '@/modules/VGameMessage/message-status.state';
import VGameGuideLogic from '@/modules/GameHall/VGameGuide/VGameGuideLogic.vue';
import { VHiggsIsOpenMixin } from '@/modules/Higgs/higgs-isopen.state';
import { VActivityHallListMixin } from '@/modules/VActivityList/activity-hall.state';
import VTaskLogicGlobal from '@/modules/VTask/VTaskLogicGlobal.vue';
import createGameToast from '@/modules/UI/createGameToast';
import {
  getBankRuptcyPayUrl,
  getGiftRecoveryPayUrl,
  getSpecialPayUrl,
} from '@/constants/APP_SCHEMA_URLS';
import type { IUserPropRewardItemBase } from '@/modules/VRewardProps/controller/prop.model';
import stateItemVGamePayGift from '@/modules/GameHall/VTopupFirstDiscount/VGamePayGift.state';
import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import { initGlobalAudio } from '@/controller/audio/initGlobalAudio';
import {
  tryInitPayActivityEnd,
  waitNextPayActivityEndPromise,
} from '@/js_bridge/appCallJs/onPayActivityEnd';
import { getGoldWithdrawUrl } from '@/modules/vRedirect';
import { GlobalDlgStack } from '@/components/Modal/GlobalDlgStack';
import { overideOnWebviewBack } from '@/js_bridge/appCallJs/onWebviewBack';
import {
  MIN_VERSION_SUPPORT_NATIVE_USERGUIDE,
  MIN_VERSION_SUPPORT_SEQ,
} from '@/constants/FEATURE_VERSIONS';
import { wait } from '@/utils/wait';
import { BannerMixinForGameHome } from '@/modules/VBannerBase/vbanner-gamehome.state';
import { tryInitRollMessage } from '@/js_bridge/appCallJs/onRollMessage';
import type { IOpenGameHallDlgParam } from '@/utils/GBus-type';
import {
  GameGuideEndInfo,
  onAppGameGuideFinish,
} from '@/js_bridge/appCallJs/onAppGameGuideFinish';
import {
  checkLastGameHallAutoOpenTimeCanOpen,
  setGameHallLastAutoDlgOpenTime,
} from '@/controller/PersistentLocalStorage';
import { EmptyPlaceComp } from '@/components/EmptyPlaceComp/index';
import type VGameMoreButton from '@/modules/GameHall/VGameMore/VGameMoreButton.vue';
import type VHallActivitysBar from '@/modules/VHallActivitysBar/VHallActivitysBar.vue';
import type VGetPropsDlg from '@/modules/VRewardProps/VGetPropsDlg.vue';
import { getGameSettlementInfo } from '@/modules/GameHall/VGameList/Game.utils';
import { MS_SECOND } from '@/constants/time';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjGameTab();

if (process.env.VUE_APP_ENV_SERVER !== 'production') {
  import('@/modules/GameHall/VCatDebug').then((debugTool) => {
    console.log('beforeShowDebugTool');
    debugTool.showDebugTool();
  });
}
//

tryInitPayActivityEnd();
tryInitRollMessage();
tryTraceEvent('game_tab_info', {
  browser_ua: navigator.userAgent,
  win_width: window.innerWidth + '',
  win_height: window.innerHeight + '',
  pkg_mode: window.GC.appName || 'unkown',
  h5_version: H5Version,
  app_version: window.GC.appVersion,
});
if (window.GC.appName !== 'wallet') {
  //
  tryTraceEvent('game_tab_offline_error', {
    pkg_mode: window.GC.appName || 'unkown',
    h5_version: H5Version,
    app_version: window.GC.appVersion,
  });
}
const dtGameJsLoaded = new Date().getTime();

initGlobalAudio();
@Component({
  components: {
    VGameUserInfo,
    VGameListBlock,
    AsyncStatus,
    VGameBanner,
    VGameGuideLogic,
    VTaskLogicGlobal,
    VGameMoreButton: () => {
      return import(
        /* webpackChunkName: "vgame-async" */ '@/modules/GameHall/VGameMore/VGameMoreButton.vue'
      );
    },
    EarnCashSideEntryOnlyForVd: EmptyPlaceComp,
    VGameNoticeAsync: () => {
      return import(
        /* webpackChunkName: "vgame-async" */ '@/modules/GameHall/GameNotice/VGameNotice.vue'
      );
    },
    VGetPropsDlg: () => {
      return import(
        /* webpackChunkName: "vgame-async" */ '@/modules/VRewardProps/VGetPropsDlg.vue'
      );
    },
    VHallActivitysBar: () => {
      return import(
        /* webpackChunkName: "vgame-async" */ '@/modules/VHallActivitysBar/VHallActivitysBar.vue'
      );
    },
    VFrozenDlg,
  },
})
export default class VGamePage extends mixins(
  BindEventMixinDefault,
  VGameListMixin,
  VRightStatMixin,
  VUserAccountMixin,
  VMessageStatusMixin,
  VHiggsIsOpenMixin,
  VActivityHallListMixin,
  BannerMixinForGameHome
) {
  $refs!: {
    userInfo: VGameUserInfo;
    gameList: VGameListBlock;
    more: VGameMoreButton;
    acbar: VHallActivitysBar;
    gameGuide: VGameGuideLogic;
    propDlg: VGetPropsDlg;
  };
  useInited() {
    //#region perf
    const dtGameMounted = new Date().getTime();
    const vGamePerfObj =
      window.pagePerfObj || ({} as typeof window.pagePerfObj);
    this.$nextTick(() => {
      vGamePerfObj.pageTick0 = new Date().getTime() - dtGameMounted;
    });
    setTimeout(() => {
      vGamePerfObj.pageTimer0 = new Date().getTime() - dtGameMounted;
      if (vGamePerfObj.noPerf) {
        delete vGamePerfObj.noPerf;
        tryTraceEvent('vd-perf', vGamePerfObj);
        console.log(
          '[DEBUG] Guide vd-perf Game',
          vGamePerfObj,
          performance?.now && performance.now(),
          Date.now()
        );
      }
    }, 0);
    vGamePerfObj.jsLoad2Mounted = dtGameMounted - dtGameJsLoaded;
    vGamePerfObj.pageMountedPerf = performance?.now && performance.now();
    //#endregion
    if (checkMinVersionName(MIN_VERSION_SUPPORT_NATIVE_USERGUIDE)) {
      onAppGameGuideFinish((info) => {
        console.log('[onAppGameGuideFinish]', info);
        this.nextAppGameGuideInfo = info;
        this.onTabActiveDlgCheck('appGuideEnd');
      });
    } else {
      this.onTabActiveDlgCheck('init'); // for
    }
    onGBus('onWalletTabChecked', (info) => {
      if (info.name === 'bounds') {
        this.onTabActiveDlgCheck('tabChange');
      }
    });
    GlobalDlgStack.Instance.enableStack();
    // const tab =
    //   getFirstString(this.$route.query.tab) === 'task' ? 'task' : 'game';
    // this.tabName = tab;
    this.refreshData();
    const unMountedList: (() => void)[] = [];
    //
    const listener1 = stateItemVGameList.on2(AsyncStateErrorEvent, (err) => {
      createGameToast(err.Reason || this.$t('Base.RequestError'));
    });
    unMountedList.push(() => {
      stateItemVGameList.off(AsyncStateErrorEvent, listener1);
    });

    overideOnWebviewBack(() => {
      const nextDlg = GlobalDlgStack.Instance.getNextPopDlg();
      if (nextDlg && nextDlg.cantReturn) {
        return false;
      }
      const dlg = GlobalDlgStack.Instance.pop();
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[DEBUG] onWebViewBack', dlg);
        if (!dlg) {
          console.log('[DEBUG] onWebViewBack', GlobalDlgStack.Instance._stack);
        }
      }
      if (dlg) {
        dlg.emitDlgVisible(false);
        return false;
      } else {
        return true;
      }
    });

    // if (process.env.VUE_APP_ENV_SIM) {
    //   setTimeout(() => {
    //     emitGBus('onGameNoviceGuideClose', null);
    //   }, 2000);
    // }

    //
    onGBus('onWebGameClosed', async (json) => {
      const dt2 = Date.now();
      const perf = json.perf
        ? ({
            ...json.perf,
            penetrate_sapn: dt2 - (json.perf.start_penetrate_dt as number),
          } as Record<string, number>)
        : null;
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('GameSettle-onWebGameClosed start');
      }
      const isLogined = await waitUserIsLoginedAuth();
      if (!isLogined) {
        return;
      }
      if (perf) {
        perf.logincheck_span = Date.now() - dt2;
      }
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.time('GameSettle-UserAccount');
      }
      // //
      // await this.refreshVUserAccount(0);
      // if (this.isFrozenDlgOpen) {
      //   return;
      // }
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.timeEnd('GameSettle-UserAccount');
      }
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.time('GameSettle-getSettlement');
      }
      const dt3 = Date.now();
      //
      const settleInfo = await getGameSettlementInfo(json.openId);
      if (perf) {
        perf.settleinfo_span = Date.now() - dt3;
        const perfMap = {} as Record<string, string>;
        for (let key in perf) {
          perfMap[key] = perf[key] + '';
        }
        perfMap['settle_info_logno'] = settleInfo.logno;
        perfMap['settle_info_code'] = settleInfo.code + '';
        tryTraceEvent('api_span_settlement_detail', perfMap);
      }

      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.timeEnd('GameSettle-getSettlement');
      }

      //   Game  account  (For:       )

      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        console.log('[Game] lastSettleInfo', settleInfo);
      }
      // tryOpenUnreadMsg
      if (settleInfo.success && settleInfo.data) {
        const { productType } = settleInfo.data;
        notifyGameSettlement(settleInfo.data);
        if (productType !== 'GENERAL' && checkMinVersionName('2.8.8.1')) {
          //
          this.refreshVActivityList(0);
          if (
            productType === 'BANKRUPTCY' ||
            productType === 'SPECIAL' ||
            productType === 'RECOVERY'
          ) {
            if (productType === 'BANKRUPTCY' || productType === 'SPECIAL') {
              stateItemVGamePayGift.tryUpdate(0);
            }
            const res = await getIsInGame();
            if (res.Result === 1 && res.data) {
              if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
                console.log(
                  'GameSettle ignore dlg of in game',
                  productType,
                  settleInfo,
                  ''
                );
              }
              return;
            }
            openAppH5LinkPreferLocal(
              productType === 'BANKRUPTCY'
                ? getBankRuptcyPayUrl('gameSettle')
                : productType === 'RECOVERY'
                ? getGiftRecoveryPayUrl('gameSettle')
                : getSpecialPayUrl('gameSettle'),
              {}
            );
            if (
              checkLastGameHallAutoOpenTimeCanOpen('Withdraw') &&
              checkMinVersionName(MIN_VERSION_SUPPORT_SEQ)
            ) {
              const isInGame2 = await getIsInGame();
              if (isInGame2.Result === 1 && isInGame2.data) {
                if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
                  console.log(
                    'GameSettle ignore dlg of in game',
                    productType,
                    settleInfo,
                    ''
                  );
                }
                return;
              }
              const payEndRes = await waitNextPayActivityEndPromise();
              if (
                payEndRes.type !== 'Canceled' &&
                !payEndRes.isRechargeTriggered
              ) {
                setGameHallLastAutoDlgOpenTime(
                  'Withdraw',
                  new Date().getTime()
                );
                openAppH5LinkPreferLocal(
                  getGoldWithdrawUrl('VGame_pay_seq'),
                  {}
                );
                this.ignoreNextOnViewResume = true;
              }
            }
          }
        }
      } else {
        console.log('GameSettleError', settleInfo);
      }
    });

    //
    onGBus('openGameHallDlg', async (payload) => {
      if (this.isAutoDlgChecking) {
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(
            '[GAME]-DEBUG openGameHallDlg  wait next isLoginDlgChecking'
          );
        }
        this.nextOpenGameHallCommand = payload;
        return; //
      }
      if (this.isInNewGuideOrFreeze) {
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(
            '[GAME]-DEBUG openGameHallDlg  ignore isInNewGuideOrFreeze'
          );
        }
        return;
      }
      const isCurBounds = await this.getIsCurTabActive();
      if (!isCurBounds || this.isAutoDlgChecking) {
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(
            '[GAME]-DEBUG openGameHallDlg wait next',
            'isCurBounds',
            isCurBounds,
            'appTabName',
            this.$ss.state.bridge.appTabName,
            'isLoginDlgChecking',
            this.isAutoDlgChecking
          );
        }
        //  onViewResume
        this.nextOpenGameHallCommand = payload;
      } else {
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(
            '[GAME]-DEBUG openGameHallDlg open immediately',
            this.$ss.state.bridge.appTabName
          );
        }
        this.onOpenGameHallDlg(payload);
      }
    });

    this.initGlobalGetPropsDlg();
    return () => {
      unMountedList.map((item) => {
        if (item) {
          item();
        }
      });
    };
  }

  async onOpenGameHallDlg(payload: IOpenGameHallDlgParam) {
    this.nextOpenGameHallCommand = null;
    const traceFrom = payload.from || 'h5command';
    if (payload.type === 'TURNTABLE') {
      const turntableLogic = this.$refs.acbar?.$refs.logic?.$refs['TURNTABLE'];
      turntableLogic?.openTurntable(payload.tabType, traceFrom);
    } else if (payload.type === 'MESSAGE') {
      const logic = this.$refs.more?.$refs.message;
      logic?.tryOpenMessageDlg(traceFrom);
    } else if (payload.type === 'NOVICE_FIVE_DAYS') {
      const logic = this.$refs.acbar?.$refs.logic?.$refs['NOVICE_FIVE_DAYS'];
      const isOpened = await logic.tryOpenDlg(traceFrom);
      if (!isOpened && this.isLogined) {
        // open welfare
        const welfareLogic =
          this.$refs.acbar?.$refs.logic?.$refs['WELFARE_ENTRY'];
        if (welfareLogic) {
          welfareLogic.tryOpenDlg(traceFrom || 'no_novice_days');
        }
      }
    } else if (payload.type === 'WEEK_RECHARGE') {
      const logic = this.$refs.acbar?.$refs.logic?.$refs['WEEK_RECHARGE'];
      logic.tryOpenDlg(traceFrom);
    } else if (payload.type === 'TOMORROW_GIFT') {
      //
      const logic = this.$refs.acbar?.$refs.logic?.$refs['TOMORROW_GIFT'];
      logic.tryOpenDlg(traceFrom);
    } else if (payload.type === 'closeAll') {
      this.closeAll();
    } else if (payload.type === 'GROWTH_PLAN') {
      const payEntryLogic = this.$refs.acbar?.$refs.logic?.$refs.PAY_ENTRY;
      if (payEntryLogic) {
        payEntryLogic.tryOpenGrowthPlanDlg(traceFrom as 'h5command');
      }
    } else if (payload.type === 'PAY') {
      const payEntryLogic = this.$refs.acbar?.$refs.logic?.$refs.PAY_ENTRY;
      if (payEntryLogic) {
        payEntryLogic.tryOpenTopupTaskDlg(traceFrom as 'h5command');
      }
    }
  }

  //#region
  isGlobalGetPropsDlgShow = false;
  globalPropList: IUserPropRewardItemBase[] = [];

  onGlobalGetPropsCallback?: () => void = null;
  initGlobalGetPropsDlg() {
    //
    onGBus('openGameHallGetPropDlg', async (json) => {
      this.isGlobalGetPropsDlgShow = true;
      this.globalPropList = json.propList;
      this.onGlobalGetPropsCallback = json.onPropClosed || null;
    });
  }

  //#endregion

  isGameGuideShow = false;
  onGameGuideOpen() {
    // openGameGuide
    this.isGameGuideShow = true;
  }

  @Watch('$ss.getters.statusBarHeight', { immediate: true })
  onStatusBarHeightChange(statusBarHeight: number) {
    if (document.body) {
      document.body.style.setProperty(
        '--status-bar-height',
        (statusBarHeight || 0) + 'px'
      );
    }
  }
  //#region

  async getIsCurTabActive() {
    const res = await getCurTopPageName();
    if (!(res.Result === 1 && res.data === 'bounds')) {
      return false;
    } else {
      if (this.$ss.state.bridge.appTabName !== 'bounds') {
        this.$ss.state.bridge.appTabName = 'bounds'; //   bounds
      }
      return true;
    }
  }

  get hasAutoDlgOpened() {
    return this.isFrozenDlgOpen;
  }

  get isInNewGuideOrFreeze() {
    return this.isFrozenDlgOpen || this.$refs.gameGuide?.isInNewbieGuide;
  }
  /**
   *
   */
  isAutoDlgChecking: boolean;

  _autoDlgCheckingFrom: string;
  /**
   *      OnViewResume
   * (  ：           ，       openGameHallDlg      )
   */
  ignoreNextOnViewResume: boolean;
  /**
   *        app
   */
  nextAppGameGuideInfo?: GameGuideEndInfo;

  /**
   *        openGameHall
   */
  nextOpenGameHallCommand?: IOpenGameHallDlgParam;

  /**
   *
   * @returns: true:      ，false,  ，
   */
  async tryOpenAppGuideContinue() {
    //
    const nextAppGameGuideInfo = this.nextAppGameGuideInfo;
    this.nextAppGameGuideInfo = null;
    if (nextAppGameGuideInfo && nextAppGameGuideInfo.type === 1) {
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        console.log(
          '[Game]-DEBUG StartNewUserGuide',
          this.nextOpenGameHallCommand
        );
      }
      this.refreshVRightStat(0);
      await this.$refs.gameGuide.tryOpenNewbieGuideNext();
      this.nextOpenGameHallCommand = null;
      return true;
    }
    return false;
  }
  /**
   * @param _from init|logined    2920
   * 2920: tabChange,appGuideEnd,viewResume
   *    : init,tabChange,viewResume,logined
   */
  async onTabActiveDlgCheck(
    _from: 'tabChange' | 'viewResume' | 'appGuideEnd' | 'init' | 'logined'
  ) {
    let realFrom = _from;
    if (_from !== 'appGuideEnd' && this.nextAppGameGuideInfo) {
      realFrom = 'appGuideEnd';
    }
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[Game]-DEBUG onTabActiveDlgCheck',
        this.isAutoDlgChecking,
        _from,
        realFrom
      );
    }
    if (this.isAutoDlgChecking) {
      if (
        _from === 'appGuideEnd' &&
        this._autoDlgCheckingFrom !== 'appGuideEnd'
      ) {
        this.tryOpenAppGuideContinue();
      }
      return;
    }
    this.isAutoDlgChecking = true;
    this._autoDlgCheckingFrom = realFrom;
    waitUserIsLoginedAuth()
      .then(async (isLogined) => {
        const ignoreNextOnViewResume = this.ignoreNextOnViewResume;
        this.ignoreNextOnViewResume = false;
        if (isLogined) {
          //1.
          await this.refreshVUserAccount();
          if (process.env.VUE_APP_ENV_SERVER === 'development') {
            console.log('[GAME]-DEBUG StartCheckFrozen', this.isFrozenDlgOpen);
          }
          if (this.isFrozenDlgOpen) {
            return true;
          }
        }
        if (
          realFrom !== 'tabChange' &&
          realFrom !== 'init' &&
          realFrom !== 'appGuideEnd'
        ) {
          const isCurBounds = await this.getIsCurTabActive();
          if (!isCurBounds) {
            return false;
          }
        }

        //2.
        if (true === (await this.tryOpenAppGuideContinue())) {
          return true;
        }

        // 3. openGameHall
        if (this.nextOpenGameHallCommand) {
          if (process.env.VUE_APP_ENV_SERVER === 'development') {
            console.log('[Game]-DEBUG HasOpenGameHall ignore next');
          }
          this.onOpenGameHallDlg(this.nextOpenGameHallCommand);
          return;
        }
        if (!isLogined) {
          return false;
        }
        if (realFrom === 'viewResume') {
          //viewResume    openGameHallCommand
          return;
        }
        if (ignoreNextOnViewResume) {
          return;
        }

        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(
            '[Game]-DEBUG onTabActiveDlgCheck tryOpenTopupSeqDlg',
            _from,
            realFrom
          );
        }
        const hasTopupDlg = await this.tryOpenTopupSeqDlg();
        if (hasTopupDlg) {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('[Game] TopupSeq opened ignore next');
          }
          return true;
        }
        // tryOpenUnreadMsg
        const msgBtn = this.$refs.more?.$refs.message;
        if (msgBtn) {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('[Game] before tryOpen unreadedMsg');
          }
          const hasUnreadMsg = await msgBtn.tryOpenUnreadedMsg('hall_init');
          if (hasUnreadMsg === true) {
            return true;
          }
        }

        return false;
      })
      .then(() => {
        this.isAutoDlgChecking = false;
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log('[Game]-DEBUG onTabActiveDlgCheck End', _from, realFrom);
        }
      });
  }

  //#endregion

  async tryOpenTopupSeqDlg() {
    if (!checkMinVersionName(MIN_VERSION_SUPPORT_SEQ)) {
      return false;
    }
    await this.refreshVActivityList();
    const VActivityMap: Partial<
      Record<API.ActivitiesManagementVO['type'], boolean>
    > = {};
    this.VActivityList.map((item) => {
      VActivityMap[item.type] = true;
    });
    let hasDlg = false;
    const dtNow = new Date().getTime();
    const ActivitySeqList = (
      ['SPECIAL_RECHARGE', 'FIRST_CHARGE', 'PAY_ENTRY'] as const
    ).filter((item) => {
      if (!VActivityMap[item]) {
        return false;
      }
      return checkLastGameHallAutoOpenTimeCanOpen(item);
    });
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[Game] SEQ', ActivitySeqList, VActivityMap);
    }
    for (let i = 0; i < ActivitySeqList.length; i++) {
      const curSeq = ActivitySeqList[i];
      const isLast = i === ActivitySeqList.length - 1;
      const isInGame = await getIsInGame();
      if (isInGame.Result === 1 && isInGame.data) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log(
            '[Game] SEQ SPECIAL_RECHARGE ignore,user in game',
            i,
            curSeq
          );
        }
        return false;
      }
      if (curSeq === 'SPECIAL_RECHARGE') {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[Game] SEQ SPECIAL_RECHARGE open');
        }
        openAppH5LinkPreferLocal(getSpecialPayUrl('game_pay_seq'), {});
        setGameHallLastAutoDlgOpenTime(curSeq, dtNow);
        hasDlg = true;
        if (!isLast) {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('[Game] SEQ SPECIAL_RECHARGE wait pay end');
          }
          const payEnd = await waitNextPayActivityEndPromise();
          if (payEnd.type !== 'SPECIAL') {
            if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
              console.log(
                '[Game] SEQ SPECIAL_RECHARGE pay end not special exit'
              );
            }
            // special ,
            return true;
          }
          if (payEnd.type === 'SPECIAL' && payEnd.isRechargeTriggered) {
            if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
              console.log(
                '[Game] SEQ SPECIAL_RECHARGE pay triggered ,ignore  next dlg'
              );
            }
            //
            return true;
          }
        }
      } else if (curSeq === 'FIRST_CHARGE') {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[Game] SEQ FirstCharge try open start');
        }
        const isOpenedMode =
          await this.$refs.acbar?.$refs.logic?.$refs.FIRST_CHARGE?.tryOpenDlg(
            'VGame_pay_seq'
          );
        if (isOpenedMode) {
          setGameHallLastAutoDlgOpenTime(curSeq, dtNow);
          hasDlg = true;
          if (!isLast && isOpenedMode === 'payopened') {
            const payEnd = await waitNextPayActivityEndPromise();
            if (payEnd.type !== 'PromotionPay') {
              // special ,
              return true;
            }
            if (payEnd.type === 'PromotionPay' && payEnd.isRechargeTriggered) {
              //
              return true;
            }
          }
        }
      } else {
        //
        const isOpened =
          await this.$refs.acbar?.$refs.logic?.$refs.PAY_ENTRY?.tryOpenDlg(
            'VGame_pay_seq'
          );
        if (isOpened) {
          setGameHallLastAutoDlgOpenTime(curSeq, dtNow);
          hasDlg = true;
        }
      }
    }
    return hasDlg;
  }
  /**
   *
   */
  closeAll() {
    this.$refs.userInfo?.closeAll();
    this.$refs.more?.closeAll();
    this.$refs.acbar?.closeAll();
    this.$refs.gameGuide?.closeAll();
    dismissLoading_bridge();
    // this.isUpdateDlgShow = false;
  }

  //#region

  get isLogined() {
    return this.$ss.getters['user/isRealLogined'];
  }

  isStartWatchIsLogined: boolean;
  @Watch('isLogined')
  onLoginded() {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[Refresh] isLogined update',
        this.isLogined,
        this.$ss.state.user.userId
      );
    }
    if (this.isStartWatchIsLogined) {
      this.throttleForceRefreshData();
    }

    if (!this.isLogined) {
      //      ，
      this.closeAll();
    } else {
      if (!checkMinVersionName(MIN_VERSION_SUPPORT_NATIVE_USERGUIDE)) {
        this.onTabActiveDlgCheck('logined');
      }
    }
  }

  @Watch('$ss.state.user.userId')
  onUserIdChanged(userId: string, oldUserId: string) {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[Refresh] userId update',
        this.isLogined,
        this.$ss.state.user.userId
      );
    }
    if (oldUserId && userId && oldUserId !== userId) {
      //      ，
      this.closeAll();
    }
    if (this.isStartWatchIsLogined) {
      this.throttleForceRefreshData();
    }
  }

  tTimer: ReturnType<typeof setTimeout>;
  throttleForceRefreshData() {
    if (this.tTimer) {
      clearTimeout(this.tTimer);
    }
    this.tTimer = setTimeout(() => {
      this.refreshData(0);
    }, 200);
  }

  tTimer2: ReturnType<typeof setTimeout>;
  throttleRefreshData() {
    if (this.tTimer2) {
      clearTimeout(this.tTimer2);
    }
    this.tTimer2 = setTimeout(() => {
      this.refreshData();
    }, 100);
  }

  @Watch('$ss.state.bridge.appTabName', {
    immediate: true,
  })
  onAppTabNameChange(appTabName: string, fromTabName: string) {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[Refresh] onAppTabNameChange tryUpdate',
        this.isLogined,
        this.$ss.state.user.userId,
        appTabName,
        fromTabName
      );
    }
    if (appTabName === 'bounds') {
      this.$tracev('gamehall_exposure');
      this.throttleRefreshData(); //
      // this.onTabActiveDlgCheck('tabChange');
    }
  }

  @Watch('$ss.state.bridge.webviewResumeFlag')
  async onViewResume() {
    if (this.nextOpenGameHallCommand) {
      //   command
      const isTabBounds = await this.getIsCurTabActive();
      if (isTabBounds) {
        //
        this.onTabActiveDlgCheck('viewResume');
      }
    }
    this.throttleRefreshData();
  }

  get isHiggsClientOpen() {
    return this.VHiggsIsOpen === true;
  }

  async refreshData(timeout?: number) {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log('RefreshData', timeout);
    }
    const isLogined = await waitUserIsLoginedAuth();
    const promiseList: Promise<any>[] = [];
    promiseList.push(this.refreshVGameList(timeout));
    promiseList.push(this.refreshVBannerList(timeout));
    const waitFirstPriority = wait(500);

    this.isStartWatchIsLogined = true;
    if (isLogined) {
      promiseList.push(this.refreshVRightStat(timeout));
      promiseList.push(
        this.refreshVActivityList(timeout === 0 ? 0 : MS_SECOND)
      );
      promiseList.push(this.refreshVHiggsIsOpen(timeout));
      // account    （        ）
      promiseList.push(this.refreshVUserAccount(timeout === 0 ? 0 : 300));
      promiseList.push(
        waitFirstPriority.then(() => {
          return this.refreshVMessageStatus(timeout);
        })
      );
      // promiseList.push(this.refreshVCheckinStatus(timeout));
      // promiseList.push(this.refreshVTurntableList(timeout));
    } else {
      //
      if (this.stateItemVUserAccountRef.current) {
        this.stateItemVUserAccountRef.current = null;
      }

      if (this.stateItemVRightStatRef.current) {
        this.stateItemVRightStatRef.current = null;
      }
    }
    await Promise.all(promiseList);
    this.isPullRefreshLoading = false;
  }

  //#region PullRefresh
  isPullRefreshLoading = false;
  // onPullRefreshLoading() {
  //   console.log('[Debug]-onPullRefresh', this.isPullRefreshLoading);
  //   this.isPullRefreshLoading = true;
  //   this.refreshData(0);
  // }
  //#endregion

  //#endregion

  //#region

  get gameStatus() {
    if (this.GameList) {
      if (this.GameList.length === 0) {
        return 'nodata';
      } else {
        return 'ok';
      }
    } else {
      return this.stateItemVGameListRef.status;
    }
  }

  onGameRefresh() {
    if (!ButtonLockController.Instance.tryGetLock('refreshGame', 0.5)) {
      return;
    }
    this.refreshVGameList(0);
  }
  //#endregion

  //#region frozen
  isFrozenDlgOpen = false;

  get frozenInfo() {
    const UserAccount = this.UserAccount;
    if (!UserAccount || !UserAccount.freeze) {
      return null;
    }
    return {
      freezeDuration: Number(UserAccount.freezeDuration),
      customerEmail: UserAccount.customerEmail,
    };
  }

  @Watch('frozenInfo')
  onWatchFrozenInfo() {
    const frozenInfo = this.frozenInfo;
    if (frozenInfo) {
      this.isFrozenDlgOpen = true;
    } else {
      this.isFrozenDlgOpen = false;
    }
  }
  //#endregion

  // #region
  async getRecomendGameInfo() {
    if (!this.GameList) {
      await this.refreshVGameList();
      await this.$nextTick();
    }
    return this.$refs.gameList.getRecomendGameInfo();
  }
  // #endregion

  // /**
  //  *
  //  */
  // get hasTopupFdButton() {
  //   return (
  //     this.isLogined &&
  //     this.IsGameFirstRechargedInfo?.firstRecharge === false &&
  //     !!this.FirstGameTopupDlgImage
  //   );
  // }
}
</script>
