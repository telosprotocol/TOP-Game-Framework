<template>
  <portal to="modal">
    <VGameTomorrowPackDlg
      @updateActivity="$emit('updateActivity', { type: 'TOMORROW_GIFT' })"
      :from="from"
      v-model="isDlgOpen"
    ></VGameTomorrowPackDlg>
  </portal>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import VGameTomorrowPackDlg from './VGameTomorrowPackDlg.vue';
import { VTomorrowPackTaskMixin } from './VTomorrowPackTask.state';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { Toast } from 'vant';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';

// TOMORROW_GIFT
@Component({
  components: { VGameTomorrowPackDlg },
})
export default class VGameTomorrowPackLogic extends mixins(
  VTomorrowPackTaskMixin,
  BindEventMixinDefault
) {
  useInited() {
    return onGBus('onVTaskUpdate', (payload) => {
      if (
        payload.type === 'single' &&
        payload.taskModuleType === 'VGAME_TOMORROW_GIFT_VGAME_TOMORROW_GIFT'
      ) {
        this.refreshVTomorrowPackTask(10);
      }
    });
  }
  from = '';

  isDlgOpen = false;
  async onButtonClick(from: string) {
    if (!ButtonLockController.Instance.tryGetLock('topup', 1)) {
      return;
    }
    this.tryOpenDlg(from);
  }
  closeAll() {
    this.isDlgOpen = false;
  }

  async tryOpenDlg(from: string) {
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('vgame_click_tomorrow_gift_package', {
      is_logined: isLogined,
      activity_type: from,
    });
    if (!isLogined) {
      navigation_login_bridge(('gamehall_tomorrow_' + from) as any);
      return false;
    }

    const res = await this.refreshVTomorrowPackTask(0);
    if (!res.ok) {
      Toast(res.error.message);
      return;
    }
    this.from = from;
    const taskStatus = this.TomorrowPackTask?.status;
    if (
      taskStatus === 'NOT_STARTED' ||
      taskStatus === 'UNDERWAY' ||
      taskStatus === 'AVAILABLE'
    ) {
      this.isDlgOpen = true;
    }
  }
}
</script>
