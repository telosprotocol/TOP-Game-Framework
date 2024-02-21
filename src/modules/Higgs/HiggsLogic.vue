<template>
  <portal to="modal">
    <HiggsDlg v-model="isHiggsDlgShow" @close="onDlgClose"></HiggsDlg>
  </portal>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import Vue from 'vue';
import Component from 'vue-class-component';
import type { IActivityType } from '@/modules/VHallActivitysBar/activity-logic.config';
import HiggsDlg from './HiggsDlg.vue';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';

@Component({
  components: {
    HiggsDlg,
  },
})
export default class HiggsLogic extends Vue {
  async onButtonClick(_from?: string) {
    if (!ButtonLockController.Instance.tryGetLock('higgs', 1)) {
      return;
    }
    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      navigation_login_bridge('gamehall_higgs');
      return;
    }
    this.$tracev('click_gamehall_higgs_coin', {
      activity_type: _from,
    });
    this.isHiggsDlgShow = true;
  }
  isHiggsDlgShow = false;

  closeAll() {
    this.isHiggsDlgShow = false;
  }

  onDlgClose(needUpdate: boolean) {
    if (needUpdate) {
      //
      this.$emit('updateActivity', {
        type: 'HIGGS' as IActivityType,
      });
    }
    //
    updateRewardsByPropTypes('GOLD');
  }
}
</script>
