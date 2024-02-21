<template>
  <div class="w-screen min-h-screen">
    <HeaderTop
      skin="dark"
      left-icon="icon-back"
      :bar-background="statusBarColor"
      :title="$t('VPE.title')"
    >
    </HeaderTop>
    <main
      class="relative z-[1] flex-1 overflow-auto p-4 pt-4 bg-gradient-to-b from-[#9262D0] to-[#B193DE]"
    >
      <VPlayEarnBlockUI class="mb-7">
        <div slot="title">{{ $t('VPE.totalDST') }}</div>
        <div class="bg-[#FFF8E1] rounded-2xl">
          <div
            class="relative z-0 bg-[length:100%_100%] bg-center bg-no-repeat pt-5"
            :style="
              $ss.getters.convertBgImageStyle(
                '/online/playToEarn/Light.png?webp',
                true,
                $ss.getters.designPxsObjToReal({
                  width: 294,
                  height: 138,
                })
              )
            "
          >
            <!-- MainContent -->
            <div class="flex items-center justify-between">
              <div class="flex flex-1 items-center justify-center mr-2">
                <div
                  class="shrink-0 w-8 h-8 box-content bg-contain bg-center bg-no-repeat mr-1"
                  v-webp="require('@/assets/vcommon/CoinVToken.png?webp')"
                ></div>
                <div
                  @click="onGoToDetails"
                  class="italic font-rubik font-bold text-4xl vshadow-stroke-1.5 shadow-[#000000] bg-clip-text"
                  :style="{
                    webkitTextStroke: '1px #4f4f4f',
                    backgroundImage:
                      'linear-gradient(to bottom, #f1da7f, #fac756)',
                    color: '#fac756',
                    textShadow: '0 2px 2px #000',
                  }"
                  v-html="playGameStatInfo.txtDstTotalAmount || '&nbsp;'"
                ></div>
              </div>
              <div
                class="shrink-0 w-6 h-6 box-content bg-contain bg-center bg-no-repeat mr-4"
                @click="onGoToDetails"
                v-webp="'/online/playToEarn/iconRight.png?webp'"
              ></div>
            </div>
            <div
              class="robot-bold italic text-xs text-[#805A1D] text-center mb-[22px]"
            >
              ≈Rp {{ playGameStatInfo.txtDstToRpTotalAmount || '' }}
            </div>

            <button
              class="bg-[length:100%_100%] mx-auto bg-no-repeat text-white font-rubik font-bold relative flex items-center justify-center text-sm active:scale-95 text-center"
              @click="goToExchange"
              :style="
                $ss.getters.convertBgImageStyle(
                  '/online/common/btnRedMid.png?webp',
                  true,
                  $ss.getters.designPxsObjToReal({
                    width: 151,
                    height: 32,
                    paddingLeft: 16,
                  })
                )
              "
            >
              <div
                class="absolute top-1 left-1 w-6 h-6 box-content bg-contain bg-center bg-no-repeat"
                v-webp="require('@/assets/vcommon/CoinGold.png?webp')"
              ></div>
              {{ $t('VPE.goToExchange') }}
            </button>
          </div>
        </div>
      </VPlayEarnBlockUI>
      <VPlayToEarnWeekRankList class="mb-4"></VPlayToEarnWeekRankList>
      <VPlayEarnBanner></VPlayEarnBanner>
    </main>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjPlayToEarn } from '@/locales/Page/VPrj/VPE/init';
import { VCoinPriceInfoMixin } from '@/modules/VAssetInfo/VCoinPriceInfo.state';
import { getDSTDetailUrl } from '@/modules/vRedirect';
import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import { ROUTEPATH_V_RIGHT_DSTEXCHANGE } from '@/constants/localRoutePath';
import VPlayToEarnWeekRankList from '@/modules/PlayToEarn/VPlayToEarnWeekRankList.vue';

import { Toast } from 'vant';
import { formatVRp, formatVToken2 } from '@/modules/vFormatter';
import VPlayEarnBlockUI from '@/modules/PlayToEarn/VPlayEarnBlockUI.vue';
import { VPlayEarnWeekRankMixin } from '@/modules/PlayToEarn/VPlayEarnRank.state';
import VPlayEarnBanner from '@/modules/PlayToEarn/VPlayEarnBanner.vue';
import { userPlayGameStatForuneCenterController } from '@/vservices/client/ForuneCenterController';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjPlayToEarn();
@Component({
  components: {
    HeaderTop,
    VPlayToEarnWeekRankList,
    VPlayEarnBlockUI,
    VPlayEarnBanner,
  },
})
export default class VPlayToEarnPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  VCoinPriceInfoMixin,
  VPlayEarnWeekRankMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#9262D0';
  useInited() {
    this.refreshVCoinPriceInfo();
    userPlayGameStatForuneCenterController().then((res) => {
      if (res.success) {
        this.playGameStat = res.data;
      } else {
        Toast(res.message);
      }
    });
    this.refreshVPlayEarnWeekRank();
    return () => {};
  }

  playGameStat: API.UserPlayGameStatVO = null;

  get playGameStatInfo() {
    const playGameStat = this.playGameStat;
    if (!playGameStat) {
      return {};
    }
    return {
      txtDstToRpTotalAmount: formatVRp(Number(playGameStat.dstToRpTotalAmount)),
      txtDstTotalAmount: formatVToken2(Number(playGameStat.dstTotalAmount)),
    };
  }
  onGoToDetails() {
    this.$router.push({
      path: getDSTDetailUrl('play_game'),
      query: {
        backMode: 'back',
      },
    });
    this.$trace('click_player_invest_center_income');
  }

  goToExchange() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_player_invest_center_exchange');
    openAppH5LinkPreferLocal(ROUTEPATH_V_RIGHT_DSTEXCHANGE, {});
  }
}
</script>
