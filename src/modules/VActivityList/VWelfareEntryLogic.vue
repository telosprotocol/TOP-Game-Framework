<template>
  <portal to="modal">
    <VWelfareDlg
      v-model="isDlgShow"
      @close="onDlgClose"
      @activityClick="onActivityClick"
    ></VWelfareDlg>
  </portal>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import Vue from 'vue';
import Component from 'vue-class-component';
import type {
  IActivityEntryFrom,
  IActivityType,
} from '@/modules/VHallActivitysBar/activity-logic.config';
import VWelfareDlg from './VWelfareDlg.vue';
import { stateItemVActivityHallList } from './activity-hall.state';

@Component({
  components: {
    VWelfareDlg,
  },
})
export default class VWelfareEntryLogic extends Vue {
  async onActivityClick(type: IActivityType, from: IActivityEntryFrom) {
    this.$emit('activityClick', type, from);
  }
  async onButtonClick(_from?: IActivityEntryFrom) {
    if (!ButtonLockController.Instance.tryGetLock('activity', 1)) {
      return;
    }
    this.tryOpenDlg(_from);
  }

  async tryOpenDlg(_from?: IActivityEntryFrom | string) {
    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      navigation_login_bridge('gameHall_welfare');
      return false;
    }
    this.$tracev('click_gamehall_activity', {
      activity_type: _from,
    });
    stateItemVActivityHallList.tryUpdate(200);
    this.isDlgShow = true;
  }
  isDlgShow = false;

  closeAll() {
    this.isDlgShow = false;
  }

  onDlgClose(_needUpdate: boolean) {
    // if (needUpdate) {
    //   //
    //   this.$emit('updateActivity', {
    //     type: 'HIGGS' as IActivityType,
    //   });
    // }
  }
}
</script>
