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
      {{ $t('VG.exchangeCode') }}
    </div>
    <portal to="modal">
      <VExchangeCodeDlg
        v-model="isExchangeDlgOpened"
        @openGettedReward="onOpenGettedReward"
      ></VExchangeCodeDlg>
      <VGettedRewardsDlg
        v-model="isGetRewardDlgOpened"
        :rewards="rewardList"
        @close="onGetRewardDlgClose"
      ></VGettedRewardsDlg>
    </portal>
  </button>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import { convertBgImageStyle } from '@/utils/styles';
import Vue from 'vue';
import Component from 'vue-class-component';
import VGettedRewardsDlg, {
  IVGettedRewardDlgInfo,
} from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import VExchangeCodeDlg from './VExchangeCodeDlg.vue';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
@Component({
  components: {
    VGettedRewardsDlg,
    VExchangeCodeDlg,
  },
})
export default class VExchangeCodeButton extends Vue {
  get iconStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/more/ExchangeCode.png?webp'),
      true
    );
  }
  async onButtonClick() {
    if (!ButtonLockController.Instance.tryGetLock('exchange', 1)) {
      return;
    }
    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      navigation_login_bridge('gamehall_exchangecode');
      return;
    }

    this.$tracev('click_redemption_code');
    this.$emit('close', {});
    this.isExchangeDlgOpened = true;
  }

  isExchangeDlgOpened = false;

  isGetRewardDlgOpened = false;
  getRewardInfo: IVGettedRewardDlgInfo = null;

  get rewardList() {
    const rewardInfo = this.getRewardInfo;
    if (rewardInfo) {
      return [rewardInfo];
    }
    return [];
  }
  onOpenGettedReward(getRewardInfo: IVGettedRewardDlgInfo) {
    this.isGetRewardDlgOpened = true;
    this.getRewardInfo = getRewardInfo;
    this.$tracev('redemption_code_success_exposure', {
      redemption_coins: getRewardInfo.num,
    });
  }

  onGetRewardDlgClose() {
    this.$tracev('click_redemption_code_success', {
      redemption_coins: this.getRewardInfo?.num,
    });
  }
  closeAll() {
    this.isExchangeDlgOpened = false;
    this.isGetRewardDlgOpened = false;
  }
}
</script>
