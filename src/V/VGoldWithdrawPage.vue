<template>
  <div
    class="h-screen flex flex-col z-0 relative"
    :style="{ background: 'linear-gradient(180deg, #F9F7FB 0%, #F1EDF6 100%)' }"
  >
    <div
      class="fixed -z-10 w-[360px]"
      :style="
        $ss.getters.designPxsObjToReal({
          height: 165,
          background:
            'linear-gradient(180deg, #9755CC 0%, rgba(151,85,204,0.69) 73%, rgba(151,85,204,0) 100%)',
        })
      "
    ></div>
    <HeaderTop
      bar-background="transparent"
      left-icon="icon-back"
      skin="dark"
    ></HeaderTop>
    <nav
      class="shrink-0 flex items-center text-white text-center text-base font-semibold relative mb-3"
    >
      <div
        v-for="item in tabList"
        :key="item.name"
        @click="onTabItemClick(item)"
        class="flex-1 relative py-2"
        :class="{ 'opacity-60': item.idx !== curTabIdx }"
      >
        {{ item.text }}
      </div>
      <div
        class="absolute w-1/2 left-0 bottom-0 flex justify-center transition-transform"
        :style="{
          transform: 'translateX(' + curTabIdx * 100 + '%)',
        }"
      >
        <div class="h-[3px] rounded-full w-16 bg-white"></div>
      </div>
    </nav>
    <main class="flex-1 pt-0 pb-3 overflow-y-auto">
      <VGoldWithdraw
        @withdrawSuccess="onWithdrawHistoryUpdate"
        @withdrawCancel="onWithdrawHistoryUpdate"
        class="px-3"
        ref="withdraw"
        :is-active="curTabIdx === 0"
      ></VGoldWithdraw>

      <VWithdrawHistory
        ref="history"
        class="w-full h-full"
        v-show="curTabIdx === 1"
      ></VWithdrawHistory>
      <VTaskLogicGlobal></VTaskLogicGlobal>
    </main>
  </div>
</template>

<script lang="ts">
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjWithdrawHistory } from '@/locales/Page/VPrj/VWH/init';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import { getFirstString } from '@/utils/string';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import HeaderTop from '@/components/HeaderTop/index.vue';
import VGoldWithdraw from '@/modules/VGoldWithdraw/VGoldWithdraw.vue';
import VWithdrawHistory from '@/modules/VGoldWithdraw/VWithdrawHistory.vue';
import VTaskLogicGlobal from '@/modules/VTask/VTaskLogicGlobal.vue';
import { waitUserIsLoginedAuth } from '../store/modules/user.utils';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { BannerOpType } from '@/constants/BannerOpType';
import {
  ROUTENAME_INAPP_V_GOLDWITHDRAW,
  ROUTEPATH_V_GOLDWITHDRAW,
} from '../constants/localRoutePath';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjWithdrawHistory();
@Component({
  components: { HeaderTop, VGoldWithdraw, VWithdrawHistory, VTaskLogicGlobal },
})
export default class VGoldWithdrawPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  $refs: {
    withdraw: VGoldWithdraw;
    history: VWithdrawHistory;
  };
  statusBarColor = '#9755CC';
  useInited() {
    if (this.queryTab === 'history') {
      this.curTabIdx = 1;
      this.$nextTick(() => {
        if (this.$refs.history) {
          this.$refs.history.resetLoad();
          this.$refs.history.onLoad('init');
        }
      });
    }
    return () => {
      //    destroy
    };
  }
  /**
   *      or
   */
  get queryTab() {
    // 'invite-list'
    return (
      (getFirstString(this.$route.query.tab) as 'history' | 'history') ||
      'withdraw'
    );
  }

  //#region Tab

  curTabIdx = 0;
  get tabList() {
    return [
      {
        text: this.$t('VGW.withdraw'),
        name: 'withdraw',
      },
      {
        text: this.$t('VWH.withdrawalRecord'),
        name: 'withdrawHistory',
      },
    ].map((item, idx) => {
      return {
        ...item,
        idx,
      };
    });
  }
  async onTabItemClick(item: typeof VGoldWithdrawPage.prototype.tabList[0]) {
    if (item.idx === 1) {
      const isLogined = await waitUserIsLoginedAuth();
      if (!isLogined) {
        navigation_login_bridge(ROUTENAME_INAPP_V_GOLDWITHDRAW, {
          opType: BannerOpType.AppLink,
          to: ROUTEPATH_V_GOLDWITHDRAW + '?tab=history',
        });
        return;
      }
      this.$tracev('click_game_tarikdana_list');
      if (this.$refs.history) {
        this.$refs.history.resetLoad();
        this.$refs.history.onLoad();
      }
    }
    this.curTabIdx = item.idx;
  }
  //#endregion

  onWithdrawHistoryUpdate() {
    // if (this.$refs.history) {
    //   this.$refs.history.resetLoad();
    //   this.$refs.history.onLoad();
    // }
  }
}
</script>
