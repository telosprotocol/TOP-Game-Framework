<template>
  <portal to="modal">
    <BenefitDlg v-model="isDlgShow" @close="onDlgClose"></BenefitDlg >
  </portal>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import Vue from 'vue';
import Component from 'vue-class-component';
import BenefitDlg from './BenefitDlg.vue';
@Component({
  components: { BenefitDlg },
})
export default class BenefitEntryLogic extends Vue {
  isDlgShow = false;

  async onButtonClick(_from?: string) {
    if (!ButtonLockController.Instance.tryGetLock('weekcard', 1)) {
      return;
    }
    this.tryOpenDlg(_from);
  }

  async tryOpenDlg(_from?: string) {
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('click_weekcard', {
      is_logined: isLogined,
      activity_type: _from,
    });
    if (!isLogined) {
      navigation_login_bridge('gamehall_weekcard');
      return false;
    }
    this.isDlgShow = true;
    return true;
  }
  onDlgClose(needUpdate: boolean) {
    if (needUpdate) {
    }
  }

  closeAll() {
    this.isDlgShow = false;
  }
}
</script>
