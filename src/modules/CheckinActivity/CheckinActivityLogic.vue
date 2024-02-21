<template>
  <portal to="modal">
    <CheckinActivityDlg
      v-model="isDlgShow"
      @close="onDlgClose"
    ></CheckinActivityDlg>
  </portal>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import Vue from 'vue';
import Component from 'vue-class-component';
import type { IActivityType } from '@/modules/VHallActivitysBar/activity-logic.config';
import CheckinActivityDlg from './CheckinActivityDlg.vue';
@Component({
  components: { CheckinActivityDlg },
})
export default class CheckinActivityLogic extends Vue {
  isDlgShow = false;

  /**
   *  Spin
   */
  async onButtonClick(_from?: string) {
    if (!ButtonLockController.Instance.tryGetLock('7day', 1)) {
      return;
    }
    this.tryOpenDlg(_from);
  }

  async tryOpenDlg(_from?: string) {
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('click_rookie_prize', {
      is_logined: isLogined,
      activity_type: _from,
    });
    if (!isLogined) {
      navigation_login_bridge('gamehall_checkinactivity');
      return false;
    }
    // this.$emit('close', { type: 'spin' });
    this.isDlgShow = true;
    return true;
  }
  onDlgClose(isCheckined: boolean) {
    if (isCheckined) {
      //
      this.$emit('updateActivity', {
        type: 'SEVEN_DAY_ACTIVITIES' as IActivityType,
      });
    }
  }
}
</script>
