<template>
  <div class="w-screen h-screen">
    <div
      class="absolute top-0 right-0 left-0 w-screen -z-10 overflow-hidden"
      :style="
        $ss.getters.designPxsObjToReal({
          height: 220,
        })
      "
    >
      <VPurpleCircleBgUI
        wrapper-class="from-[#4829A1] to-[#583AAA]"
      ></VPurpleCircleBgUI>
    </div>

    <HeaderTop
      skin="dark"
      left-icon="icon-back"
      :bar-background="'transparent'"
      :title="$t('VPEN.title')"
    >
      <div
        slot="beforeInner"
        class="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <VPurpleCircleBgUI
          wrapper-class="from-[#4829A1] to-[#583AAA]"
        ></VPurpleCircleBgUI>
      </div>
    </HeaderTop>
    <VPlayEarnNewbieBanner
      class="mx-auto bg-cover bg-no-repeat shrink-0 mb-4"
    ></VPlayEarnNewbieBanner>
    <main class="flex-1 overflow-auto bg-white rounded-[30px] p-4">
      <section class="mb-4">
        <h3
          class="font-rubik rubik-bold text-black leading-none text-[18px] mb-4"
        >
          {{ $t('VPEN.gameGuide') }}
        </h3>
        <div class="flex items-start justify-between">
          <div
            v-for="(item, idx) in gamePicList"
            :key="idx"
            class="bg-contain bg-no-repeat"
            :style="item.style"
          ></div>
        </div>
      </section>

      <section class="mb-4">
        <h3
          class="font-rubik rubik-bold text-black leading-none text-[18px] mb-4"
        >
          {{ $t('VPEN.dstValue') }}
        </h3>
        <div
          class="flex rounded-xl items-center bg-gradient-to-b from-[#DBDFFF] to-[#EDEFFF] p-2 text-[#666]"
        >
          <div
            class="bg-contain bg-no-repeat mr-2"
            :style="
              $ss.getters.convertBgImageStyle(
                '/online/playToEarn/dIcon.png?webp',
                true,
                $ss.getters.designPxsObjToReal({
                  width: 54,
                  height: 53,
                })
              )
            "
          ></div>
          <div class="flex-1">
            <p>1 {{ $t('V.DST') }} = Rp{{ rpText }}</p>
            <p>{{ $t('VPEN.dstP1') }}</p>
            <p>{{ $t('VPEN.dstP2') }}</p>
          </div>
        </div>
      </section>
      <button
        @click="onGoToPlayGame"
        class="vbutton font-rubik font-extrabold w-full h-12 active:scale-95 mb-3"
      >
        {{ $t('VPEN.goToDetailText') }}
      </button>
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
import { tryMergeLocalesForVPrjPlayToEarnNewbie } from '@/locales/Page/VPrj/VPEN/init';
import { VCoinPriceInfoMixin } from '@/modules/VAssetInfo/VCoinPriceInfo.state';
import { formatVRp } from '@/modules/vFormatter';
import { close_bridge } from '@/js_bridge/js_call_app_base';
import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import VPlayEarnNewbieBanner from '@/modules/PlayToEarn/VPlayEarnNewbieBanner.vue';
import VPurpleCircleBgUI from '@/components/VPurpleCircleBgUI.vue';
import { APP_ROUTE_TAB_GAME } from '@/constants/APP_SCHEMA_URLS';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjPlayToEarnNewbie();
@Component({
  components: { HeaderTop, VPlayEarnNewbieBanner, VPurpleCircleBgUI },
})
export default class VPlayToEarnNewbiePage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  VCoinPriceInfoMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#4728A0';
  useInited() {
    this.refreshVCoinPriceInfo();
    return () => {};
  }

  get gamePicList() {
    const sizeStyle = this.$ss.getters.designPxsObjToReal({
      width: 102,
      height: 215,
    });
    return [
      '/online/playToEarn/p1.png?webp',
      '/online/playToEarn/p2.png?webp',
      '/online/playToEarn/p3-2.png?webp',
    ].map((item) => {
      return {
        style: this.$ss.getters.convertBgImageStyle(item, true, sizeStyle),
      };
    });
  }
  get rpText() {
    const dst2Rp = this.CoinPriceInfo?.dstToRp;
    if (dst2Rp != null) {
      return formatVRp(Number(dst2Rp));
    }
    return '-';
  }

  onGoToPlayGame() {
    if (!ButtonLockController.Instance.tryGetLock('game', 0.4)) {
      return;
    }
    this.$trace('click_player_investcenter_game');
    openAppH5LinkPreferLocal(APP_ROUTE_TAB_GAME, {});
    setTimeout(() => {
      close_bridge();
    }, 100);
  }
}
</script>
@/constants/APP_SCHEMA_URLS
