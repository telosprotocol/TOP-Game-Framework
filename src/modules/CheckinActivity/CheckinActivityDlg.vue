<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-if="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative rounded-[20px] w-80 bg-gradient-to-b from-[#0D49D4] to-[#4585FF] p-1"
        >
          <main
            class="rounded-[20px] bg-gradient-to-b from-[#362171] to-[#5D439F] pt-10 px-3 pb-4 min-h-full flex items-center justify-center flex-col"
          >
            <div
              class="bg-contain bg-center bg-no-repeat absolute z-0 top-2"
              :style="
                $ss.getters.convertBgImageStyle(
                  '/online/common/dlgDecoration/goldDeco.png?webp',
                  true,
                  $ss.getters.designPxsObjToReal({
                    width: 282,
                    height: 120,
                    filter: 'blur(2px)',
                  })
                )
              "
            ></div>
            <header
              class="mx-auto absolute -translate-y-full left-1/2 -translate-x-1/2 bg-center bg-contain bg-no-repeat z-10"
              :style="
                $ss.getters.convertBgImageStyle(
                  require('@/assets/checkinAc/header.png?webp'),
                  true,
                  $ss.getters.designPxsObjToReal({
                    width: 270,
                    height: 165,
                    top: 42,
                  })
                )
              "
            >
              <div
                class="absolute -translate-x-1/2 left-1/2 flex items-center justify-center font-rubik text-xl font-black"
                :style="
                  $ss.getters.designPxsObjToReal({
                    top: 104,
                    width: 260,
                    height: 40,
                  })
                "
              >
                <div
                  class="vgradient-text-outline"
                  :style="{
                    '--v-color-from': '#FFFFD0',
                    '--v-color-to': '#F5BE36',
                    '--v-shadow-from': '#CC3900',
                    '--v-shadow-to': '#CC3900',
                    '--v-shadow-y': '3px',
                    '--v-shadow-x': '0',
                  }"
                  :data-text="title"
                >
                  {{ title }}
                </div>
              </div>
            </header>
            <button
              @click="onCloseClicked"
              class="absolute -right-1 -top-8 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
              v-webp="require('@/assets/vcommon/close/btnBlueClose.png?webp')"
            ></button>
            <section
              class="relative z-10 w-full rounded-xl bg-gradient-to-b from-[#8B5BE5] to-[#60A8D1] flex items-stretch mb-3 overflow-hidden"
              :style="$ss.getters.designPxsObjToReal({ height: 94 })"
            >
              <div
                v-for="item in dayList"
                :key="item.day"
                class="text-white text-xs text-center flex flex-col items-center flex-1 pt-3"
                @click="changeSelectDay(item)"
                :class="{
                  ' bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.44)]':
                    item.day - 1 === selectedIdx,
                }"
              >
                <div class="mb-1">DAY</div>
                <div class="font-din-bold text-2xl mb-2 leading-none">
                  {{ item.day }}
                </div>
                <div
                  :class="{
                    'iconfont icon-check-circle ': item.status === 'SIGNED',
                    'iconfont icon-radio-empty':
                      item.status === 'NOT_SIGNED' && item.isPastDay,
                  }"
                ></div>
              </div>
            </section>
            <CheckinActivityTaskItem
              class="w-full"
              :is-today="selectedIdx === curDay - 1"
              :task-info="taskInfo"
              @ok="onCheckInOK"
            ></CheckinActivityTaskItem>
          </main>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
import { VCheckinActivityMixin } from '@/modules/CheckinActivity/VCheckinActivity.state';
import CheckinActivityTaskItem from './CheckinActivityTaskItem.vue';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
@Component({
  components: { CheckinActivityTaskItem },
})
export default class CheckinActivityDlg extends mixins(
  BaseDlgMixin,
  VCheckinActivityMixin
) {
  get title() {
    return 'ROOKIE PRIZE';
  }
  @Prop({
    type: String,
  })
  taskId: string;
  //#region Dlg Basic Setting

  isCheckined: boolean;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.isCheckined = false;
      this.refreshVCheckinActivity(10).then(() => {
        this.selectedIdx = Math.max(this.curDay - 1, 0);
      });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
    this.$emit('close', this.isCheckined);
  }
  //#endregion
  get baseDayList() {
    return Array.from({ length: 7 }).map((item, idx) => {
      return {
        day: idx + 1,
      };
    });
  }

  get curDay() {
    return this.VCheckinActivity?.currentDays || 0;
  }
  get dayList() {
    const curDay = this.curDay;
    // const isCurSignIn = this.VCheckinActivity?.signIn || false;
    const list = this.VCheckinActivity?.items || [];
    return this.baseDayList.map((item, idx) => {
      const info = list[idx];
      let status: 'SIGNED' | 'TO_BE_SIGNED' | 'NOT_SIGNED' = 'NOT_SIGNED';
      if (info?.status === 'FINISHED') {
        status = 'SIGNED';
      } else {
        status = curDay === item.day ? 'TO_BE_SIGNED' : 'NOT_SIGNED';
      }
      const prop = info?.propRewards?.[0];
      return {
        day: item.day,
        status: status,
        info,

        isCurDay: item.day === curDay,

        isPastDay: item.day < curDay,
        textRewardNum: prop ? prop.propNum : '-',
        rewardIcon: prop ? prop.imageUrl : '',
        rewardName: prop ? prop.nameText : '',
      };
    });
  }

  get taskInfo() {
    return this.dayList[this.selectedIdx]?.info;
  }

  changeSelectDay(item: typeof CheckinActivityDlg.prototype.dayList[0]) {
    this.selectedIdx = item.day - 1;
  }
  selectedIdx = 0;
  onCheckInOK() {
    this.refreshVCheckinActivity(0);
    this.isCheckined = true;
  }
}
</script>
