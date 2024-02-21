<template>
  <portal to="modal">
    <GameTaskNoviceDlg
      v-model="isDlgShow"
      @close="onDlgClose"
    ></GameTaskNoviceDlg>
  </portal>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import Component, { mixins } from 'vue-class-component';
import type { IActivityType } from '../VHallActivitysBar/activity-logic.config';
import GameTaskNoviceDlg from './GameTaskNoviceDlg.vue';
import type { IActivityEntryFrom } from '../VHallActivitysBar/activity-logic.config';
import { VGameTaskNoviceMixin } from './GameTaskNovice.state';
import { listActivitiesManagementController } from '@/vservices/client/ActivitiesManagementController';
@Component({
  components: { GameTaskNoviceDlg },
})
export default class VGameTaskNoviceEntryLogic extends mixins(
  VGameTaskNoviceMixin
) {
  isDlgShow = false;

  async onButtonClick(_from?: IActivityEntryFrom) {
    if (!ButtonLockController.Instance.tryGetLock('task', 1)) {
      return;
    }
    this.tryOpenDlg(_from, true);
  }

  async tryOpenDlg(_from?: string | IActivityEntryFrom, dontCheck?: boolean) {
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('click_mission', {
      is_logined: isLogined,
      activity_type: _from,
    });
    if (!isLogined) {
      navigation_login_bridge('gamehall_tasknovice');
      return false;
    }

    if (!dontCheck) {
      const res = await listActivitiesManagementController({
        types: ['NOVICE_FIVE_DAYS'],
      });
      if (!(res.success && res.data && res.data.length > 0)) {
        if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log('[NOVICE_FIVE_DAYS] no novice_five_days ignore');
        }
        return false;
      }
    }
    this.isDlgShow = true;
    return true;
  }
  onDlgClose(needUpdate: boolean) {
    if (needUpdate) {
      //
      this.$emit('updateActivity', {
        type: 'NOVICE_FIVE_DAYS' as IActivityType,
      });
    }
  }

  closeAll() {
    this.isDlgShow = false;
  }
}
</script>
