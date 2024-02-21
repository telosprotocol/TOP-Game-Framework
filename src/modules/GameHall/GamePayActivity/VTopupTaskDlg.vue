<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>

      <!-- DlgContent Include bg -->
      <div
        class="relative bg-contain bg-center bg-no-repeat mx-auto tz-transel-scaleInOut flex flex-col items-center"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 354,
              height: 413,
              paddingTop: 80,
              paddingLeft: 42,
              paddingRight: 36,
              paddingBottom: 30,
            },
            require('@/assets/gameActivity/dlgBg.png?webp'),
            true
          )
        "
      >
        <div
          class="absolute bg-contain bg-center bg-no-repeat w-full"
          :style="
            $ss.getters.normalizeCss(
              {
                top: 44,
                height: 36,
              },
              $ss.getters.translateImage({
                en: require('@/assets/gameActivity/activity-en.png'),
                id: require('@/assets/gameActivity/activity-id.png'),
              })
            )
          "
        ></div>
        <button
          @click="onCloseClicked"
          class="absolute bg-contain bg-center bg-no-repeat active:scale-95"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 38,
                height: 38,
                top: 32,
                right: -2,
              },
              require('@/assets/gametask2/x.png?webp'),
              true
            )
          "
        ></button>
        <section
          class="w-full pt-4"
          v-for="tItem in taskList"
          :key="tItem.taskId"
          :style="$ss.getters.normalizeCss({ height: 152 })"
        >
          <nav class="h-8 mb-4 w-full flex items-center justify-center px-0.5">
            <div
              class="flex items-center justify-center bg-[length:100%_auto] bg-center bg-no-repeat text-[15px] font-robot-medium font-medium truncate px-1"
              :style="
                $ss.getters.normalizeCss(
                  {
                    width: 130,
                    height: 30,
                    color: '#F39B07',
                  },
                  require('@/assets/gameCommon/groupSelect.png')
                )
              "
            >
              {{ tItem.name }}
            </div>
          </nav>
          <VTopupTaskItem :task-info="tItem"></VTopupTaskItem>
        </section>

        <div
          v-if="expirationClientTime"
          class="absolute bottom-2 rounded-full h-4 pr-3 pl-7 flex items-center justify-center bg-[#78460C] text-[#FFE173] text-xs leading-none shadow-sm shadow-[#FFE78E]"
        >
          <div
            class="bg-contain bg-center absolute"
            :style="
              $ss.getters.normalizeCss(
                { left: -7, top: -8.5, width: 32, height: 32 },
                require('@/assets/gameTaskNovice/iconTimer.png?webp'),
                true
              )
            "
          ></div>
          <VCountDown
            @end="onCountDownEnd"
            :expiration-client-time="expirationClientTime"
          ></VCountDown>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import { tryMergeLocalesForVPrjGameTaskPage } from '@/locales/Page/VPrj/VGT/init';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import VCountDown from '../../GameTask/VCountDown.vue';
import { MS_SECOND } from '../../../constants/time';
import { VModuleTasksMixinForRechargeTask } from './RechargeTask.state';
import GameTaskProgress from '../../GameTask/GameTaskProgress.vue';
import VTopupTaskItem from './VTopupTaskItem.vue';
import { getClientTimestampByAsyncStateItemRef } from '../../../controller/AsyncStateItem';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
tryMergeLocalesForVPrjGameTaskPage();
@Component({
  components: {
    VCountDown,
    GameTaskProgress,
    VTopupTaskItem,
  },
})
export default class VTopupTaskDlg extends mixins(
  BaseDlgMixin,
  BindEventMixinDefault,
  VModuleTasksMixinForRechargeTask
) {
  useInited() {
    const cb1 = onGBus('onVTaskUpdate', (payload) => {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[DEBUG] onVTaskUpdate', payload);
      }
      if (this.value) {
        if (
          (payload.type === 'single' &&
            payload.taskModuleType === 'RECHARGE_DAILY') ||
          payload.type === 'behavior'
        ) {
          this.refreshVModuleTasks(5);
          this.$emit('updateActivity');
        }
      }
    });
    const cb2 = onGBus('onVUserRechargeGameGold', () => {
      if (this.value) {
        this.refreshVModuleTasks(5);
      }
    });

    return () => {
      cb1();
      cb2();
    };
  }
  //#region Dlg Basic Setting

  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.refreshVModuleTasks(MS_SECOND * 3);
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('click_close_activity2', {});
    // closeDlg
    this.emitDlgVisible(false);
  }
  //#endregion

  get expirationClientTime() {
    const endTime = this.VModuleTasks?.[0]?.endTime;
    return getClientTimestampByAsyncStateItemRef(
      endTime,
      this.stateItemVModuleTasksRef
    );
  }

  get taskList() {
    return (this.VModuleTasks || []).slice(0, 2);
  }
  onCountDownEnd() {
    this.refreshVModuleTasks(100);
  }
}
</script>
./RechargeTask.state
