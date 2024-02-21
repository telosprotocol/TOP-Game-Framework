<template>
  <button
    class="rounded-2.5 w-16 px-[1px] h-14 py-[1px] text-[11px] robot-medium flex items-center justify-center flex-col leading-none active:scale-95"
    @click="onGoToExchange"
  >
    <div
      class="w-6 h-6 shrink-0 bg-contain bg-center bg-no-repeat mb-1"
      v-webp="require('../imgs/rightButton/WithdrawUn.png?webp')"
    ></div>
    <div class="text-[#DFD5EF] font-rubik font-[500]">
      {{ $t('VRW.withdraw') }}
    </div>
  </button>
</template>

<script lang="ts">
import { Toast } from 'vant';
import Vue from 'vue';
import Component from 'vue-class-component';
/**
 *   
 */
@Component({})
export default class VRightButtonWithdraw extends Vue {
  // isExchangeDlgOpened = false;
  /**
   *  
   */
  onGoToExchange() {
    this.$trace('click_me_wallet_dst_tarikdana');
    Toast(this.$t('VRW.withdrawComingSoon'));
    // this.isExchangeDlgOpened = true;
  }
}
</script>
