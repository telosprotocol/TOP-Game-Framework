<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex flex-col items-center justify-center tz-transel-scaleInOut"
      >
        <div class="absolute inset-0" @click="onCloseClicked"></div>
        <div
          class="relative w-full bg-top bg-no-repeat bg-contain mb-5"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 350,
                height: 350,
                paddingTop: 105,
              },
              require('@/assets/gameHall/surprizeGift/giftBg.png?webp'),
              true
            )
          "
        >
          <div
            class="bg-contain bg-center bg-no-repeat h-6"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 360,
                },
                $ss.getters.translateImage({
                  en: require('@/assets/gameHall/surprizeGift/title-en.png?webp'),
                  id: require('@/assets/gameHall/surprizeGift/title-id.png?webp'),
                }),
                true
              )
            "
          ></div>
          <div class="flex items-center justify-center flex-nowrap mb-5">
            <div
              class="text-base text-[#FED571] font-robot-medium font-medium w-[200%] whitespace-nowrap leading-none"
              :style="
                $ss.getters.normalizeCss({
                  scale: '0.47',
                  marginLeft: -4,
                })
              "
            >
              {{ $t('VG.surpriseGiftTitleTip') }}
            </div>
          </div>
          <div
            class="absolute z-0"
            v-if="isCountDown"
            :style="
              $ss.getters.normalizeCss(
                {
                  top: 165,
                  left: 67,
                  height: 54,
                  width: 209,
                },
                isCountDown
                  ? require('@/assets/gameHall/surprizeGift/bgCountDown.png?webp')
                  : null,
                true
              )
            "
          ></div>
          <div class="px-16 relative z-10">
            <div class="pl-2 pr-3 text-[#A53131] text-[11px] mb-2">
              <!-- WaitOrDoTask -->
              <div
                class="font-robot-medium font-medium leading-tight flex items-center justify-center text-xs tracking-tighter text-center"
                :style="
                  $ss.getters.normalizeCss({
                    height: isCountDown ? 56 : 36,
                    fontSize: $i18n.locale === 'en' ? 14 : 12,
                  })
                "
              >
                {{
                  isCountDown
                    ? $t('VG.surpriseWaitCountDown')
                    : $t('VG.surpriseCompleteTask')
                }}
              </div>
              <!-- TaskInfo -->
              <div
                v-if="!isCountDown"
                class="flex items-center justify-between h-4 box-content px-2 py-0.5 font-robot-medium font-medium"
              >
                <div class="flex-1 truncate whitespace-nowrap">
                  {{ sTaskInfo.name }}
                </div>
                <div
                  v-if="TomorrowPackTask && !isCountDown"
                  class="rounded-full border border-[#A64012] h-full bg-[#FEE8B3] text-[#A64012] flex items-center justify-center relative overflow-hidden"
                  :style="$ss.getters.normalizeCss({ width: 72 })"
                >
                  <div
                    class="absolute left-0 h-full bg-[#FFE173] rounded-full"
                    :style="progressStyle"
                  ></div>
                  <div
                    class="text-xs scale-[85%] leading-none font-robot-medium font-medium"
                  >
                    {{ progressText }}
                  </div>
                </div>
              </div>
            </div>
            <!-- BonusText -->
            <div
              class="font-bold font-robot-bold text-[#A64012] text-lg text-center tracking-[0.3em] mb-4"
              v-html="bonusText"
            ></div>
            <div class="flex items-center text-xs justify-center mb-1.5">
              <div
                class="text-[#FED571] whitespace-nowrap text-center scale-[85%] -ml-2"
              >
                {{ $t('VG.surpriseGiftBottomTip') }}
              </div>
            </div>
            <button
              class="vbtn-topup mx-auto flex items-center justify-center"
              @click="onBtnClick"
              onBtnClick
              :class="{ 'vbtn-topup--disabled': !isBtnGreen }"
            >
              <TimeCountDown
                v-if="isCountDown"
                :client-end-time="entryClientEndTime"
                :show-second="true"
                @countdownEnd="onCountDownEnd"
              ></TimeCountDown>
              <span v-else>
                {{ $t('VG.surpriseOpen') }}
              </span>
            </button>
          </div>

          <!-- CloseButton -->
          <button
            @click="onCloseClicked"
            class="absolute top-5 right-0 w-6 h-6 bg-contain bg-center bg-no-repeat active:scale-95"
            v-webp="require('@/assets/gameCommon/x2.png?webp')"
          ></button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import TimeCountDown from '@/components/CountDownTimer/TimeCountDown.vue';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import { getClientTimestampByAsyncStateItemRef } from '@/controller/AsyncStateItem';
import ButtonLockController from '@/controller/ButtonLockController';
import { updateRewardsByPropTypes } from '@/modules/VAssetInfo/VAsset.utils';
import type { IUserPropRewardItemBase } from '@/modules/VRewardProps/controller/prop.model';
import { getTaskTraceParams } from '@/modules/VTask/VTask.controller';
import { emitGBus } from '@/utils/GBus';
import { vGameClaimTomorrowGiftTaskController } from '@/vservices/client/TaskController';
import { Toast } from 'vant';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { VTomorrowPackTaskMixin } from './VTomorrowPackTask.state';
@Component({
  components: { TimeCountDown },
})
export default class VGameTomorrowPackDlg extends mixins(
  BaseDlgMixin,
  VTomorrowPackTaskMixin
) {
  @Prop({
    type: String,
  })
  from: string;

  dlgSound = true;
  get sTaskInfo() {
    return this.TomorrowPackTask || {};
  }
  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('vgame_tomorrow_gift_package_exposure', {
        task_status: this.sTaskInfo?.status,
      });
    }
  }
  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close-sg', 0.5)) {
      return;
    }
    this.emitDlgVisible(false);
  }

  //#region
  /**
   *
   */
  get isCountDown() {
    return this.sTaskInfo.status === 'NOT_STARTED';
  }

  get entryClientEndTime() {
    const taskItem = this.sTaskInfo;
    if (this.isCountDown) {
      return getClientTimestampByAsyncStateItemRef(
        taskItem.startTime,
        this.stateItemVTomorrowPackTaskRef
      );
    }
    return 0;
  }
  onCountDownEnd() {
    this.refreshVTomorrowPackTask(300);
  }

  //#endregion

  async onBtnClick() {
    if (!ButtonLockController.Instance.tryGetLock('tomorrow', 0.5)) {
      return;
    }
    if (this.isCountDown) {
      this.emitDlgVisible(false);
      return;
    }
    const taskInfo = this.sTaskInfo;
    const taskStatus = this.sTaskInfo.status;
    const taskModuleType = 'VGAME_TOMORROW_GIFT_VGAME_TOMORROW_GIFT';
    if (taskStatus === 'AVAILABLE') {
      this.$tracev('vgame_click_tomorrow_gift_package_receive', {
        ...getTaskTraceParams(taskInfo, taskModuleType),
        task_coin: taskInfo?.propRewards?.[0]?.propNum + '',
      });
      const res = await vGameClaimTomorrowGiftTaskController({
        taskId: taskInfo.taskId,
      });
      if (res.success) {
        emitGBus('openGameHallGetPropDlg', {
          propList: res.data[0].rewards as IUserPropRewardItemBase[],
        });
        updateRewardsByPropTypes('GOLD');
        this.$emit('updateActivity');
        this.emitDlgVisible(false);
      } else {
        Toast(res.message);
      }
      this.refreshVTomorrowPackTask();
    } else if (taskStatus === 'UNDERWAY') {
      emitGBus('dealTaskLogic', {
        taskInfo: taskInfo,
        taskModuleType: taskModuleType,
      });
      this.emitDlgVisible(false);
    }
  }

  //#region
  get progressText() {
    const taskInfo = this.TomorrowPackTask;

    return `${this.$ss.getters.formatFloat(
      Number(taskInfo.currentValue)
    )}/${this.$ss.getters.formatFloat(Number(taskInfo.targetValue))}`;
  }

  get progressStyle() {
    const taskInfo = this.TomorrowPackTask;
    return {
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FABC0A' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
      width: taskInfo
        ? Math.min(
            Number(taskInfo.currentValue) / Number(taskInfo.targetValue),
            1
          ) *
            100 +
          '%'
        : '0%',
    };
  }

  get bonusText() {
    const firstProp = this.TomorrowPackTask?.propRewards?.[0];
    if (!firstProp) {
      return '&nbsp;';
    }
    const maxK = firstProp.maxPropNum / 1000;
    return `${firstProp.minPropNum} - ${maxK}<span class="text-[#6A100E]">K</span>`;
  }

  get isBtnGreen() {
    const taskStatus = this.sTaskInfo.status;
    return taskStatus === 'AVAILABLE' || taskStatus === 'NOT_STARTED';
  }
  //#endregion
}
</script>
