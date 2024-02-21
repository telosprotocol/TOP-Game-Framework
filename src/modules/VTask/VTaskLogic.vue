<template>
  <portal to="modal">
    <VGetPropsDlg v-model="isGetPropsDlgShow" :list="propList"></VGetPropsDlg>
  </portal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import {
  dealVTaskToDo,
  getTaskTraceParams,
  ITaskModuleType,
} from '@/modules/VTask/VTask.controller';
import { GameUserTaskStatus } from '@/modules/VTask/VTask.model';
import type { IVTaskItemBase } from '@/modules/VTask/VTask.model';
import { Toast } from 'vant';
import VGetPropsDlg from '@/modules/VRewardProps/VGetPropsDlg.vue';
import { completeTaskController } from '@/vservices/client/TaskController';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';
import type { IUserPropRewardItemBase } from '../VRewardProps/controller/prop.model';

@Component({
  components: { VGetPropsDlg },
})
export default class VTaskLogic extends Vue {
  // taskInfo: IVTaskItemBase;
  isDealing = false;
  isGetPropsDlgShow = false;
  propList: IUserPropRewardItemBase[] = [];

  /**
   *       （    ）
   * @param taskInfo
   * @param taskType
   */
  async onTaskClick(
    taskInfo: IVTaskItemBase,
    taskModuleType: ITaskModuleType,
    ignoreLoginCheck?: boolean
  ) {
    // this.taskInfo = taskInfo;
    if (!ButtonLockController.Instance.tryGetLock('task-' + taskInfo.taskId)) {
      return;
    }
    if (this.isDealing) {
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        console.log('task is dealing', taskInfo.taskId);
      }
      return;
    }
    if (!ignoreLoginCheck) {
      const isLogined = await waitUserIsLoginedAuth();
      if (!isLogined) {
        //
        await navigation_login_bridge('tasklist'); // let rlt2 =
        //
        return;
      }
    }
    const traceParams = getTaskTraceParams(taskInfo, taskModuleType);
    if (taskInfo.status === GameUserTaskStatus.doing) {
      this.$tracev('click_gofinish_mission', traceParams);
      dealVTaskToDo(taskInfo, taskModuleType);
      return;
      //
    } else if (taskInfo.status === GameUserTaskStatus.claimable) {
      this.$tracev('click_receive_mission', traceParams);
      this.isDealing = true;
      //
      const res = await completeTaskController({
        taskId: taskInfo.taskId,
      });
      this.isDealing = false;
      if (res.success) {
        const rewards = res.data[0].rewards;
        this.propList = rewards as IUserPropRewardItemBase[];
        if (rewards && rewards.length > 0) {
          this.isGetPropsDlgShow = true;
          updateRewardsByPropTypes('GOLD');
        }
        this.$emit('updateTask', {
          taskInfo,
          taskModuleType,
          taskDealType: 'Claim',
        });
      } else {
        Toast(res.message);
        this.$emit('updateTask', {
          taskInfo,
          taskModuleType,
          taskDealType: 'Retry',
        });
      }
    }
  }
}
</script>
