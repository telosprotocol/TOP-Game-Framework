<template>
  <portal to="modal">
    <VCheckinDlg v-model="isShowDlg" @checkinOk="onCheckinOK"></VCheckinDlg>
    <VGettedRewardsDlg
      :rewards="rewardList"
      v-model="isRewardGettedShow"
      @close="onGetRewardClose"
    >
    </VGettedRewardsDlg>
  </portal>
</template>

<script lang="ts">
import { VCheckinStatusMixin } from './vcheckin-status.state';
import type { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import Component, { mixins } from 'vue-class-component';
import VCheckinDlg from './VCheckinDlg.vue';
import VGettedRewardsDlg, {
  IVGettedRewardDlgInfo,
} from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import { navigation_login_bridge } from '@/js_bridge/js_call_app';
import ButtonLockController from '@/controller/ButtonLockController';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import type { IActivityType } from '@/modules/VHallActivitysBar/activity-logic.config';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';
@Component({
  components: { VCheckinDlg, VGettedRewardsDlg },
})
export default class VCheckinLogic extends mixins(VCheckinStatusMixin) {
  isShowDlg = false;

  async onButtonClick(from?: string) {
    if (!ButtonLockController.Instance.tryGetLock('checkin', 1)) {
      return;
    }
    return this.openCheckin(from);
  }

  async openCheckin(from: string) {
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('click_gameuser_signin', {
      is_logined: isLogined,
      activity_type: from,
    });
    if (!isLogined) {
      navigation_login_bridge('gamehall_checkin');
      return false;
    }
    this.isShowDlg = true;
    return true;
  }

  //#region
  async onCheckinOK(checkedItem: API.CheckInDayVO) {
    //
    this.rewardInfo = {
      num: Number(checkedItem.rewardAmount),
      coin: checkedItem.rewardType as VCoinEnum,
      icon: checkedItem.rewardPic,
    };
    this.isRewardGettedShow = true;
    this.refreshVCheckinStatus(0);
    //
    this.$emit('updateActivity', { type: 'SIGN_IN' as IActivityType });
  }

  rewardInfo: IVGettedRewardDlgInfo = null;

  get rewardList() {
    const rewardInfo = this.rewardInfo;
    if (rewardInfo) {
      return [rewardInfo];
    }
    return [];
  }
  isRewardGettedShow = false;
  onGetRewardClose() {
    updateRewardsByPropTypes('GOLD');
  }
  //#endregion

  closeAll() {
    this.isShowDlg = false;
    this.isRewardGettedShow = false;
  }
}
</script>
