<template>
  <button
    class="rounded-2.5 w-16 px-[1px] h-14 py-[1px] text-[11px] robot-medium flex items-center justify-center flex-col leading-none bg-gradient-to-b from-[#FBF6FF] to-[#FEFCFF] active:scale-95"
    @click="onGoToExchange"
  >
    <div
      class="w-6 h-6 shrink-0 bg-contain bg-center bg-no-repeat mb-1"
      v-webp="require('../imgs/rightButton/Exchange.png?webp')"
    ></div>
    <div class="text-[#913FC0] font-rubik font-[500]">
      {{ $t('VRW.exchange') }}
    </div>
  </button>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';

import Component from 'vue-class-component';
import VRightNeedBindDlg from './VRightNeedBindDlg.vue';

import { mixins } from 'vue-class-component';
import VRightUserBindDlg from '@/modules/VMobileBind/VRightUserBindDlg.vue';
import { ROUTEPATH_V_RIGHT_DSTEXCHANGE } from '@/constants/localRoutePath';
import { VRightWalletInfoMixin } from '../RightWallet.state';

/**
 *   
 */
@Component({
  components: {
    VRightNeedBindDlg,
    VRightUserBindDlg,
  },
})
export default class VRightButtonExchange extends mixins(
  VRightWalletInfoMixin
) {
  /**
   *  
   */
  async onGoToExchange() {
    if (!ButtonLockController.Instance.tryGetLock('exchange')) {
      return;
    }
    this.$trace('click_me_wallet_exchange');
    this.$router.push({
      path: ROUTEPATH_V_RIGHT_DSTEXCHANGE,
      query: {
        backMode: 'back',
      },
    });
  }
}
</script>
