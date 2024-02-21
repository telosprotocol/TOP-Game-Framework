<template>
  <div
    class="bg-gradient-to-b from-[#FFCAA0] to-[#FFE7CE] p-[1px] rounded-xl relative"
  >
    <div
      class="absolute top-0 bg-contain bg-center bg-no-repeat"
      :style="
        $ss.getters.convertBgImageStyle(
          require('@/assets/checkinAc/light.png'),
          false,
          $ss.getters.designPxsObjToReal({ width: 77, height: 6, left: 22 })
        )
      "
    ></div>
    <div
      class="absolute bottom-0 bg-contain bg-center bg-no-repeat"
      :style="
        $ss.getters.convertBgImageStyle(
          require('@/assets/checkinAc/light.png'),
          false,
          $ss.getters.designPxsObjToReal({ width: 77, height: 6, right: 13 })
        )
      "
    ></div>
    <div
      class="flex justify-between items-stretch rounded-xl bg-gradient-to-b from-[#8C6DE3] to-[#694EB1] p-3"
    >
      <div
        class="border border-[#FFB9B6] shrink-0 bg-gradient-to-b from-[#262163] to-[#B055DB] mr-2.5 flex flex-col items-center justify-center rounded-lg z-0 relative"
        :style="$ss.getters.designPxsObjToReal({ width: 75, height: 75 })"
      >
        <div
          class="h-14 w-14 bg-center bg-contain bg-no-repeat"
          :style="taskIconStyle"
        ></div>
        <div
          v-if="txtNum"
          :data-text="txtNum"
          class="font-rubik text-sm font-bold vgradient-text-outline -mt-2"
        >
          {{ txtNum }}
        </div>
      </div>
      <div
        class="flex-1 mr-2 flex flex-col text-white overflow-hidden text-left"
      >
        <div
          class="flex-1 mb-1 font-rubik font-medium text-sm leading-[1.1em] tz-ellipsis-break-3 pt-1"
        >
          {{ taskInfo ? taskInfo.name : '' }}
        </div>
        <!-- ProgressBar -->
        <div
          v-if="taskStatus === 'UNDERWAY'"
          class="bg-[rgba(255,255,255,0.2)] w-full rounded-[1px] text-center h-3.5 relative"
        >
          <div
            class="absolute left-0 top-0 bottom-0 z-0 bg-[#FFC622]"
            :style="{
              width: `${(progressInfo.percent * 100).toFixed(3)}%`,
              'box-shadow': 'inset 0px 2px 0px 0px #FAE308',
              border: '1px solid #E1BD29',
            }"
          ></div>
          <div
            class="relative z-1 text-center text-[#6D1216] font-rubik font-medium"
          >
            {{ progressInfo.text }}
          </div>
        </div>

        <button
          v-if="taskStatus === 'AVAILABLE' && isToday"
          @click="onCheckinClick"
          class="shrink-0 h-6 w-[100px] rounded-full font-rubik font-bold box-content text-white vshadow-stroke shadow-[#B14A01] flex items-center justify-center active:scale-95 mt-2 border border-solid border-[#C3711E] mx-auto"
          :style="{
            background:
              'linear-gradient(180deg, #FC7700 0%, #FB7400 26%, #FB6800 48%, #FB6B00 72%, #FFCCA5 100%)',
          }"
        >
          {{ $t('V.getReward') }}
        </button>
        <div
          v-if="taskStatus === 'FINISHED'"
          class="flex items-center justify-center"
        >
          <div
            class="h-6 w-6 bg-contain bg-center bg-no-repeat mr-1"
            :style="
              $ss.getters.convertBgImageStyle(
                require('@/assets/checkinAc/iconOK.png')
              )
            "
          ></div>
          <div class="text-xs font-rubki font-medium">
            {{ $t('V.FINISHED') }}
          </div>
        </div>
        <div
          class="flex items-center justify-center text-white text-xs"
          v-if="
            taskStatus === 'TIMEOUT' ||
            taskStatus === 'NOT_STARTED' ||
            taskStatus === 'NOT_TAKEN'
          "
        >
          <div
            class="w-6 h-6 bg-contain bg-center bg-no-repeat mr-1"
            :style="
              $ss.getters.convertBgImageStyle('/online/higgs/warn.png', false)
            "
          ></div>
          <div>
            {{
              taskStatus === 'TIMEOUT'
                ? $t('Base.Timeout')
                : $t('VG.notStarted')
            }}
          </div>
        </div>
      </div>
    </div>
    <portal>
      <VGetPropsDlg v-model="isGetPropsDlgShow" :list="propList"></VGetPropsDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';
import { mixins } from 'vue-class-component';
import VTaskItemMixin from '@/modules/VTask/VTaskItemMixin';
import { formatFloatG } from '@/store/modules/universe/universe';
import { GameUserTaskStatus } from '@/modules/VTask/VTask.model';
import ButtonLockController from '@/controller/ButtonLockController';
import VGetPropsDlg from '@/modules/VRewardProps/VGetPropsDlg.vue';
import { Toast } from 'vant';
import { Prop } from 'vue-property-decorator';
import type { IUserPropRewardItemBase } from '@/modules/VRewardProps/controller/prop.model';
import { checkInUserFissionController } from '@/vservices/client/UserFissionController';
@Component({
  components: { VGetPropsDlg },
})
export default class CheckinActivityTaskItem extends mixins(VTaskItemMixin) {
  get taskIconStyle() {
    return convertBgImageStyle(this.taskInfo?.icon);
  }

  get txtNum() {
    const num = this.taskInfo?.propRewards?.[0]?.propNum;
    if (num == null) {
      return '';
    }
    return String(num);
  }

  @Prop({
    type: Boolean,
  })
  isToday: boolean;

  get progressInfo() {
    const taskInfo = this.taskInfo;
    if (taskInfo) {
      const status = taskInfo.status;
      const currentValue = Number(taskInfo.currentValue);
      const targetValue = Number(taskInfo.targetValue);
      const MAX_VALUE = 10000000;
      const curText =
        currentValue > MAX_VALUE
          ? formatFloatG(MAX_VALUE, {
              precision: 0,
            }) + '+'
          : formatFloatG(currentValue, {
              precision: 0,
            });
      const text = `${curText}/${formatFloatG(targetValue, { precision: 0 })}`;
      if (status === GameUserTaskStatus.doing) {
        return {
          percent: Math.min(currentValue / targetValue, 1),
          text,
        };
      } else {
        return {
          percent: 1,
          text,
        };
      }
    } else {
      return {
        percent: 1,
        text: '',
      };
    }
  }

  isGetPropsDlgShow = false;
  propList: IUserPropRewardItemBase[] = [];
  async onCheckinClick() {
    if (!this.isToday) {
    }
    if (!ButtonLockController.Instance.tryGetLock('checkin', 1)) {
      return;
    }
    this.$trace('click_earn_entrance_signin');
    const taskStauts = this.taskStatus;
    if (taskStauts === 'AVAILABLE') {
      //
      const res = await checkInUserFissionController();
      if (res.success) {
        this.propList = this.taskInfo.propRewards as IUserPropRewardItemBase[];
        this.isGetPropsDlgShow = true;
        this.$emit('ok');
      } else {
        Toast(res.message);
      }
    }
  }
}
</script>
