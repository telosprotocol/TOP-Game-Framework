<template>
  <portal to="modal">
    <GamePayActivity
      ref="payEntry"
      v-model="isActivityDlgShow"
      :from="activityFrom"
      @updateActivity="onActivityUpdate"
      @openNext="onOpenNext"
      @close="onPayActivityClose"
    ></GamePayActivity>
    <VTopupTaskDlg
      ref="task"
      v-model="isTopupDlgShow"
      @updateActivity="onActivityUpdate"
      @close="onDlgClose"
    ></VTopupTaskDlg>
    <GrowthPlanDlg
      ref="growth"
      v-model="isGrowthShow"
      @updateActivity="onActivityUpdate"
      @close="onDlgClose"
    ></GrowthPlanDlg>
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
import VTopupTaskDlg from './VTopupTaskDlg.vue';
import GamePayActivity from './GamePayActivity.vue';
import GrowthPlanDlg from './GrowthPlanDlg.vue';

@Component({
  components: {
    VTopupTaskDlg,
    GamePayActivity,
    GrowthPlanDlg,
  },
})
export default class GamePayActivityEntryLogic extends Vue {
  $refs: {
    task: VTopupTaskDlg;
    growth: GrowthPlanDlg;
    payEntry: GamePayActivity;
  };
  async onButtonClick(from?: IActivityEntryFrom) {
    if (!ButtonLockController.Instance.tryGetLock('activity2', 1)) {
      return;
    }
    this.tryOpenDlg(from);
  }

  activityFrom: IActivityEntryFrom | 'VGame_pay_seq' = null;
  async tryOpenDlg(from: IActivityEntryFrom | 'VGame_pay_seq') {
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('click_gamehall_topupactivity', {
      activity_type: from,
      is_logined: isLogined ? '1' : '0',
    });
    this.activityFrom = from;
    this.isActivityDlgShow = true;

    return this.$refs.payEntry.waitDlgClose().then(() => {
      return true;
    });
  }
  async onPayActivityClose() {
    if (this.activityFrom === 'VGame_pay_seq') {
      return;
    }
    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      return;
    }

    this.isGrowthShow = true;
  }
  async tryOpenTopupTaskDlg(_from: IActivityEntryFrom | 'h5command') {
    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      navigation_login_bridge(
        'gamehall_TOPUP_TASK'
        // , {
        //   to:
        //     '/h5command/openGameHallDlg?type=PAY&from=' +
        //     encodeURIComponent(from),
        //   opType: BannerOpType.AppLink,
        // }
      );
      return false;
    }
    this.isActivityDlgShow = false;
    // this.$tracev('click_gamehall_topuptask', {
    //   activity_type: from,
    // });
    this.isGrowthShow = true;
    return this.$refs.growth.waitDlgClose().then(() => {
      return true;
    });
  }

  async tryOpenGrowthPlanDlg(from: IActivityEntryFrom | 'h5command') {
    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      navigation_login_bridge(
        'gamehall_GROWTH_PLAN'
        // , {
        //   to:
        //     '/h5command/openGameHallDlg?type=GROWTH_PLAN&from=' +
        //     encodeURIComponent(from),
        //   opType: BannerOpType.AppLink,
        // }
      );
      return false;
    }
    this.$tracev('click_gamehall_growthplan2', {
      activity_type: from,
    });
    this.isActivityDlgShow = false;
    this.isGrowthShow = true;
    return this.$refs.growth.waitDlgClose().then(() => {
      return true;
    });
  }
  isActivityDlgShow = false;

  closeAll() {
    this.isActivityDlgShow = false;
    this.isTopupDlgShow = false;
    this.isGrowthShow = false;
  }
  onActivityUpdate() {
    this.$emit('updateActivity', {
      type: 'PAY_ENTRY' as IActivityType,
    });
  }
  onDlgClose(_needUpdate: boolean) {
    // if (needUpdate) {
    //   //
    this.$emit('updateActivity', {
      type: 'GROWTH_PLAN' as IActivityType,
    });
    // }
  }

  onOpenNext(type: 'PAY' | 'GROWTH_PLAN') {
    if (type === 'PAY') {
      this.$tracev('click_activity_recharge_daily');
      this.isTopupDlgShow = true;
    } else {
      this.$tracev('click_activity_recharge_growth_plan');
      this.isGrowthShow = true;
    }
  }

  isTopupDlgShow = false;

  isGrowthShow = false;
}
</script>
