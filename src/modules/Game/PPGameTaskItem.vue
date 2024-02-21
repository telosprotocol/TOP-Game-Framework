<template>
  <div
    @click="onTaskClick"
    class="w-full h-12 p-[1px] rounded-md"
    :style="
      $ss.getters.normalizeCss({
        background:
          'linear-gradient(180deg, #EFA70B 0%, #FEF233 51.56%, #A34802 100%),linear-gradient(0deg, #FFFFFF, #FFFFFF)',
      })
    "
  >
    <div
      class="w-full h-full rounded-md bg-white flex items-center justify-between text-[#533695] pl-2 p-0.5"
    >
      <div
        class="shrink-0 bg-center bg-cover bg-no-repeat w-8 h-8 mr-1.5"
        :style="$ss.getters.normalizeCss({}, taskInfo.icon, false)"
      ></div>
      <div class="flex-1 overflow-hidden">
        <div
          class="text-xs leading-[14px] font-robot-medium font-medium tz-ellipsis-break-2 h-7"
        >
          {{ taskInfo.name }}
        </div>
        <button
          v-if="isClaimable"
          class="bg-contain bg-center bg-no-repeat font-robot-medium font-medium text-xs flex items-center justify-center text-white mx-auto"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 43,
                height: 16,
              },
              require('@/assets/ppgame/btnClaim.png?webp'),
              true
            )
          "
        >
          {{ $t('V.AVAILABLE') }}
        </button>
        <div v-if="taskStatus === 'UNDERWAY'">
          <GameTaskProgress
            :task-info="taskInfo"
            class="w-20 h-1.5 bg-[#4D1212] mb-0.5"
            :no-text="true"
          ></GameTaskProgress>
        </div>
        <div
          v-if="taskStatus === 'FINISHED'"
          class="mx-auto bg-contain bg-center bg-no-repeat"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 20,
                height: 17,
                marginTop: -2,
              },
              require('@/assets/ppgame/iconCheck.png?webp'),
              true
            )
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GameUserTaskStatus } from '@/modules/VTask/VTask.model';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import VTaskItemMixin from '@/modules/VTask/VTaskItemMixin';
import GameTaskProgress from '../GameTask/GameTaskProgress.vue';
import { getTaskTraceParams } from '../VTask/VTask.controller';
import { claimRewardToGameCoinTaskController } from '@/vservices/client/TaskController';
import { Toast } from 'vant';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop } from 'vue-property-decorator';

@Component({
  components: { GameTaskProgress },
})
export default class PPGameTaskItem extends mixins(VTaskItemMixin) {
  @Prop({
    type: String,
    required: true,
  })
  gameId: string;

  get isClaimable() {
    return this.taskStatus === GameUserTaskStatus.claimable;
  }

  async onTaskClick() {
    const taskInfo = this.taskInfo;
    if (taskInfo.status !== 'AVAILABLE') {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('task-' + taskInfo.taskId)) {
      return;
    }
    const taskModuleType = 'VGAME_NOVICE_VGAME_NOVICE';
    this.$tracev('vgame_click_gamenovice_guidance_receive_task', {
      ...getTaskTraceParams(taskInfo, taskModuleType),
      game_id: this.gameId,
      task_coin: taskInfo?.propRewards?.[0]?.propNum + '',
    }); //    
    const res = await claimRewardToGameCoinTaskController({
      taskId: taskInfo.taskId,
      gameId: this.gameId,
    });
    if (res.success) {
      this.$emit('updateTask', {
        taskInfo,
        taskModuleType,
        taskDealType: 'Claim',
      });
      //  
      window.GAME_CTL.UpdateCoin();
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
</script>
