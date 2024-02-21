<template>
  <transition name="tz-transwrap" :duration="250">
    <div
      class="absolute z-[1000] inset-0"
      v-if="value"
      v-bind="$attrs"
      @click.capture="$emit('dlgTouch')"
    >
      <div class="absolute inset-0 z-0" @click="onCloseClicked"></div>
      <div
        class="absolute right-0 top-0 bg-contain bg-center bg-no-repeat tz-transel-slideTopInOut"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 166,
              height: 199,
            },
            require('@/assets/ppgame/taskBg.png'),
            false
          )
        "
      >
        <div
          class="absolute top-2 text-center font-rubik font-bold text-sm w-full bg-clip-text"
          v-if="PPGameClientEndTime"
          :style="{
            // textShadow: '0px 1px 0px rgba(0, 0, 0, 0.40)',
            // color: '#FDCF66, #FDFCE8, #F5BE36, #FFFD1B',
            backgroundImage:
              'linear-gradient(180deg, #FDCF66 0%, #FDFCE8 49.48%, #F5BE36 49.49%, #FFFD1B 100%)',
            webkitTextFillColor: 'transparent',
          }"
        >
          <TimeCountDown
            :show-second="true"
            :client-end-time="PPGameClientEndTime"
          ></TimeCountDown>
        </div>
        <div class="absolute left-4 right-4 bottom-4 top-7 overflow-auto">
          <PPGameTaskItem
            v-for="item in taskList"
            :key="item.taskId"
            :game-id="gameId"
            class="mb-[3px]"
            :task-info="item"
            @updateTask="onUpdateTask"
          ></PPGameTaskItem>
        </div>
        <button
          @click="onCloseClicked"
          class="absolute bottom-0 w-full h-4"
        ></button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import TimeCountDown from '@/components/CountDownTimer/TimeCountDown.vue';
import { VPPGameTaskMixin } from './PPGameTask.state';

import PPGameTaskItem from './PPGameTaskItem.vue';
@Component({
  components: { TimeCountDown, PPGameTaskItem },
})
export default class PPGameTaskDlg extends mixins(
  BaseDlgMixin,
  VPPGameTaskMixin
) {
  @Prop({
    type: String,
    required: true,
  })
  gameId: string;

  @Prop({
    type: String,
    required: true,
  })
  from: 'novice' | 'unnovice';
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('vgame_gamenovice_guidance_task_exposure', {
        game_id: this.gameId,
        task_type: this.from,
      });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('vgame_close_gamenovice_guidance_task', {
      game_id: this.gameId,
    });
    // closeDlg
    this.emitDlgVisible(false);
  }
  //#endregion

  get taskList() {
    return (this.VPPGameTaskInfo || []).filter((item) => {
      return (
        item.status === 'FINISHED' ||
        item.status === 'UNDERWAY' ||
        item.status === 'AVAILABLE'
      );
    });
  }

  onUpdateTask() {
    this.refreshVPPGameTask(0);
  }
}
</script>
