<template>
  <portal to="modal">
    <GameTaskDlg v-model="isDlgShow" @close="onDlgClose"></GameTaskDlg>
  </portal>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import Vue from 'vue';
import Component from 'vue-class-component';
import GameTaskDlg from './GameTaskDlg.vue';
@Component({
  components: { GameTaskDlg },
})
export default class VGameTaskEntryLogic extends Vue {
  isDlgShow = false;

  /**
   *  Spin
   */
  async onButtonClick(_from?: string) {
    if (!ButtonLockController.Instance.tryGetLock('task', 1)) {
      return;
    }
    this.tryOpenDlg(_from);
  }

  async tryOpenDlg(_from?: string) {
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('click_mission', {
      is_logined: isLogined,
      activity_type: _from,
    });
    if (!isLogined) {
      navigation_login_bridge('gamehall_task');
      return false;
    }
    this.isDlgShow = true;
    return true;
  }
  onDlgClose(needUpdate: boolean) {
    if (needUpdate) {
      // //
      // this.$emit('updateActivity', {
      //   type: 'GAME_HALL_TASK' as IActivityType,
      // });
    }
  }
}
</script>
