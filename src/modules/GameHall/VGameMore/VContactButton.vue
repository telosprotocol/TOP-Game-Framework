<template>
  <button
    class="flex items-center flex-col justify-center active:scale-95 relative w-[64px]"
    @click="onButtonClick"
  >
    <div
      class="w-8 h-8 bg-contain bg-center bg-no-repeat"
      :style="iconStyle"
    ></div>
    <div
      class="pt-1 leading-none text-[#A6340C] font-rubik font-[600] text-xs"
      style="text-shadow: 0px 0.5px 0px #ffe1b2"
    >
      {{ $t('VG.contact') }}
    </div>
  </button>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import Vue from 'vue';
import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import { ROUTEPATH_V_CS } from '@/constants/localRoutePath';
@Component({
  components: {},
})
export default class VContactButton extends Vue {
  get iconStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/more/CS.png?webp'),
      true
    );
  }
  onButtonClick() {
    if (!ButtonLockController.Instance.tryGetLock('contact', 1)) {
      return;
    }
    this.$tracev('click_gamehall_service');
    this.$emit('close', {});
    openAppH5LinkPreferLocal(ROUTEPATH_V_CS + '?tab=feedback', {});
  }
}
</script>
