<template>
  <div class="bg-[#F1EDF6] min-h-screen">
    <div
      class="absolute z-0 left-0 right-0 h-60"
      :style="{
        top: $ss.getters.statusBarHeight + 'px',
        background:
          'linear-gradient(180deg, #9350CA 0%, #9350CA 51%, #F1ECF6 100%)',
      }"
    ></div>
    <HeaderTop
      left-icon="icon-back"
      :bar-background="statusBarColor"
      left-icon-event="close_me_wallet_now_exchange"
      :title="$t('VDE.tokenExchangeTitle')"
      skin="dark"
    >
    </HeaderTop>
    <main class="pt-4">
      <VDSTExchange class="mx-4"></VDSTExchange>
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
import VDSTExchange from '@/modules/DSTExchange/VDSTExchange.vue';

import { tryMergeLocalesForVPrjDSTExchange } from '@/locales/Page/VPrj/VDE/init';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjDSTExchange();
@Component({
  components: {
    HeaderTop,
    VDSTExchange,
  },
})
export default class VRightDSTExchange extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#9350CA';
  useInited() {
    this.$trace('dst_exchange_exposure');
    return () => {
      //    destroy
    };
  }

  isToken2CoinOpened = true;
}
</script>
