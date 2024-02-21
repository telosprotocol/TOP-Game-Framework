<template>
  <div class="w-[360px] h-screen mx-auto bg-white">
    <div
      :style="{
        height: $ss.getters.statusBarHeight + 'px',
        background: '#4829A1',
      }"
    ></div>
    <!-- bgHead -->
    <PullRefresh
      class="relative z-[1]"
      head-class="text-[#999]"
      :value="isPullRefreshLoading"
      @refresh="onPullRefreshLoading"
    >
      <div
        class="bg-center bg-contain bg-no-repeat absolute left-0 top-0 right-0 -z-10"
        :style="bgHeadStyle"
      ></div>
      <main class="pb-3 h-full pt-1">
        <VRightAssetInfo class="mx-4 mb-4"></VRightAssetInfo>
        <VAssetCenterBlock class="mb-3"></VAssetCenterBlock>
        <VRightBottomBanner ref="banner"></VRightBottomBanner>
      </main>
    </PullRefresh>
    <portal to="modal"></portal>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';

import { tryRegisterBridgeForCenterTab } from '@/js_bridge/appCallJs/registerForWallet';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { initUserForWallet } from '@/store/modules/user';

import { startMaintainLocalStorageForWallet } from '@/controller/LocalStorageMng';
import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import { MinSupportAppVersion } from '@/config/version';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { tryMergeLocalesForVPrjRightTab } from '@/locales/Page/VPrj/VR/init';
import PullRefresh from '@/components/PullRefresh/index.vue';
import {
  onRightAssetInfoSync,
  VRightStatMixin,
} from '@/modules/VAssetInfo/RightStat.state';
// import { initOpenGameByOtherPageForWalletTab } from './controller/game/openGame';
import { convertBgImageStyle } from '@/utils/styles';
import { onStartListenVNavTaskCompleteForCenter } from '@/modules/VTask/task-nav.controller';
import VRightBottomBanner from '@/modules/RightIndex/VRightBottomBanner.vue';
import VAssetCenterBlock from '@/modules/RightIndex/VAssetCenterBlock.vue';
import VRightAssetInfo from '@/modules/RightIndex/VRightAssetInfo.vue';

//             ，    ，        common
tryRegisterBridgeForCenterTab();
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjRightTab();
@Component({
  // mixins: [StatusBarMixin],
  components: {
    PullRefresh,
    VRightAssetInfo,
    VAssetCenterBlock,
    VRightBottomBanner,
  },
})
export default class VRightPage extends Mixins(
  BindEventMixinDefault,
  VRightStatMixin
) {
  $refs!: {
    banner: VRightBottomBanner;
  };
  statusColor = '#9161CF';

  get bgHeadStyle() {
    return convertBgImageStyle(
      require('@/assets/rightIndex/bg_head.png?webp'),
      true,
      this.$ss.getters.designPxsObjToReal({
        width: 360,
        height: 294,
      })
    );
  }

  //#region Init
  useInited() {
    startMaintainLocalStorageForWallet();
    let unlistenList: (() => void)[] = [];
    unlistenList.push(...initUserForWallet());
    this.refreshData();
    // //
    // onExploreRightTaskForRightPage();
    // walletInfo
    unlistenList.push(onRightAssetInfoSync());
    // unlistenList.push(initOpenGameByOtherPageForWalletTab());
    unlistenList.push(onStartListenVNavTaskCompleteForCenter());
    return () => {
      for (let i = 0; i < unlistenList.length; i++) {
        const unListen = unlistenList[i];
        if (unListen) {
          unListen();
        }
      }
      unlistenList = [];
    };
  }
  //#endregion

  get bgStyle() {
    return {
      paddingTop: this.$ss.getters.statusBarHeight + 'px',
    };
    // return convertBgImageStyle(require('@/assets/gameHall/bg.jpg'), {
    //   paddingTop: this.$ss.getters.statusBarHeight + 'px',
    // });
  }
  //#region  APP
  /**
   * APP
   */
  get needUpdate() {
    const appVersionName = this.$ss.state.app.versionName;
    if (!appVersionName) {
      return false;
    }
    const isSupport = checkMinVersionName(MinSupportAppVersion);
    const needUpdate = !isSupport;
    return needUpdate;
  }
  // @Watch('needUpdate', {
  //   immediate: true,
  // })
  // onNeedUpdateChanged(needUpdate: boolean) {
  //   if (needUpdate) {
  //     this.isDark = false;
  //   }
  // }
  //#endregion

  // #region
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
  }

  @Watch('$ss.state.user.userId')
  onUserIdChanged() {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[Refresh] userId update',
        this.isLogined,
        this.$ss.state.user.userId
      );
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

  //#endregion

  // #region RefreshData
  async refreshData(timeout?: number) {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log('RefreshData', timeout);
    }
    const isLogined = await waitUserIsLoginedAuth();
    const promiseList: Promise<any>[] = [];
    //   pass
    if (isLogined) {
      promiseList.push(this.refreshVRightStat(timeout));
    } else {
      if (this.stateItemVRightStatRef.current) {
        this.stateItemVRightStatRef.current = null;
      }
    }
    promiseList.push(this.$refs.banner.refreshVBannerList(timeout));
    await Promise.all(promiseList);
    this.isPullRefreshLoading = false;
  }
  @Watch('$ss.state.bridge.appTabName', {
    immediate: false,
  })
  onAppTabNameChange(appTabName: string) {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[Refresh] onAppTabNameChange tryUpdate',
        this.isLogined,
        this.$ss.state.user.userId
      );
    }
    if (appTabName === 'wallet') {
      this.refreshData(); //
    }
  }
  //#endregion

  //#region PullRefresh
  isPullRefreshLoading = false;
  onPullRefreshLoading() {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log('[Debug]-onPullRefresh', this.isPullRefreshLoading);
    }
    this.isPullRefreshLoading = true;
    this.refreshData(0);
  }
  //#endregion
}
</script>
