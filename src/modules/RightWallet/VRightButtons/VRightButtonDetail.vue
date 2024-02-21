<template>
  <button
    class="rounded-2.5 w-16 px-[1px] h-14 py-[1px] text-[11px] robot-medium flex items-center justify-center flex-col leading-none bg-gradient-to-b from-[#F0F6FE] to-[#F5FAFF] active:scale-95"
    @click="onGoToDetail"
  >
    <div
      class="w-6 h-6 shrink-0 bg-contain bg-center bg-no-repeat mb-1"
      v-webp="require('../imgs/rightButton/Detail.png?webp')"
    ></div>
    <div class="text-[#1B57DE] font-rubik font-[500]">
      {{ $t('VRW.details') }}
    </div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import { getDSTDetailUrl } from '@/modules/vRedirect';
@Component({
  components: {},
})
export default class VRightButtonDetail extends Vue {
  onGoToDetail() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_me_wallet_exchange_detail');
    openAppH5LinkPreferLocal(getDSTDetailUrl(), {});
  }
}
</script>
