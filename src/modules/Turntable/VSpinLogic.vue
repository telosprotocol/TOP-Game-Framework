<template>
  <portal to="modal">
    <TurntableDlg
      :init-tab-type="initTabType"
      v-model="isTurntableShow"
      ref="turntableDlg"
      @close="onTurntableClose"
    ></TurntableDlg>
  </portal>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { navigation_login_bridge } from '@/js_bridge/js_call_app';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import Component, { mixins } from 'vue-class-component';
import type { IActivityType } from '@/modules/VHallActivitysBar/activity-logic.config';
import TurntableDlg from './TurntableDlg.vue';
import { VTurntableListMixin } from './turntable.state';
@Component({
  components: { TurntableDlg },
})
export default class VSpinLogic extends mixins(
  VUserAccountMixin,
  VTurntableListMixin
) {
  $refs: { turntableDlg: TurntableDlg };
  isTurntableShow = false;
  get hasFreeSpin() {
    const turntableList = this.VTurntableList || [];
    for (let i = 0; i < turntableList.length; i++) {
      const item = turntableList[i];
      if (Number(item.freeSpinCount) > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   *  Spin
   */
  async onButtonClick(_from?: string) {
    if (!ButtonLockController.Instance.tryGetLock('spin', 0.5)) {
      return false;
    }
    return this.tryOpenTurntableDlg(_from);
  }

  async tryOpenTurntableDlg(_from?: string) {
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('click_gamehall_checkin', {
      is_logined: isLogined,
      activity_type: _from,
    });
    if (!isLogined) {
      navigation_login_bridge('gamehall_spin');
      return false;
    }
    // this.$emit('close', { type: 'spin' });
    this.isTurntableShow = true;
    return true;
  }

  initTabType: API.LuckyWheelVO['luckyWheelType'] = null;
  async openTurntable(
    initTabType: API.LuckyWheelVO['luckyWheelType'],
    from: string
  ) {
    this.initTabType = initTabType || null;
    await this.tryOpenTurntableDlg(from);
    this.$nextTick(() => {
      this.initTabType = null;
    });
  }

  onTurntableClose(isTurned: boolean) {
    if (isTurned) {
      this.refreshVUserAccount(0);
      //
      this.$emit('updateActivity', { type: 'TURNTABLE' as IActivityType });
    }
  }

  // /**
  //  *      isLogin+load UserAccount+Turntable
  //  */
  // async tryAutoOpenTurntable() {
  //   //
  //   const lastInfo = getVGameTurntableOpenLs();
  //   const curUserId = this.$ss.state.user.userId;
  //   if (
  //     !lastInfo ||
  //     lastInfo.userId != curUserId ||
  //     lastInfo.tag !== this.UserAccount?.turnTableTag
  //   ) {
  //     setVGameTurntableOpenLs({
  //       userId: curUserId,
  //       tag: this.UserAccount?.turnTableTag,
  //     });
  //     this.isTurntableShow = true;
  //     return true;
  //   }
  //   return false;
  // }

  closeAll() {
    this.$refs.turntableDlg?.closeAll();
    this.isTurntableShow = false;
  }
}
</script>
