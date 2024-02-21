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
      {{ $t('VG.withdraw') }}
    </div>
  </button>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import Vue from 'vue';
import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';
import { goToGoldWithdraw } from '@/modules/vRedirect';
@Component({
  components: {},
})
export default class VWithdrawButton extends Vue {
  get iconStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/more/Withdraw.png?webp'),
      true
    );
  }
  onButtonClick() {
    if (!ButtonLockController.Instance.tryGetLock('withdraw', 1)) {
      return;
    }
    this.$trace('click_gamehall_withdraw');
    this.$emit('close', {});
    goToGoldWithdraw('game_hall', true);
  }
}
</script>
