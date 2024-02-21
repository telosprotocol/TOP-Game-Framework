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
      {{ $t('VG.setting') }}
    </div>
    <!-- <portal to="modal">
      <VGameSettingDlg v-model="isSettingOpened"></VGameSettingDlg>
    </portal> -->
  </button>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import Vue from 'vue';
import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import { APP_ROUTE_OPEN_GAME_SETTING } from '@/constants/APP_SCHEMA_URLS';
// import VGameSettingDlg from './VGameSettingDlg.vue';
@Component({
  components: {},
})
export default class VSettingButton extends Vue {
  onButtonClick() {
    if (!ButtonLockController.Instance.tryGetLock('setting', 1)) {
      return;
    }
    this.$emit('close', { type: 'setting' });
    this.$tracev('click_more_setting_btn');
    // this.isSettingOpened = true;
    openAppH5LinkPreferLocal(APP_ROUTE_OPEN_GAME_SETTING, {});
  }
  get iconStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/more/setting.png?webp'),
      true
    );
  }
  // isSettingOpened = false;

  // openSettingDlg() {
  //   this.isSettingOpened = true;
  // }
}
</script>
@/constants/APP_SCHEMA_URLS
