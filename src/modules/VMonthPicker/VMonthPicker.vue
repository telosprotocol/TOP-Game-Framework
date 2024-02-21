<template>
  <div class="text-[#333]">
    <div
      @click="showMonthPicker"
      class="flex items-center robot-medium text-base"
      :class="triggerClass"
    >
      <div>{{ curMonthItem ? curMonthItem.text : '' }}</div>
      <ib
        class="iconfont icon-down transition-transform"
        :class="{
          'rotate-180': showMonth,
        }"
      ></ib>
    </div>
    <Popup v-model="showMonth" round position="bottom">
      <Picker
        show-toolbar
        ref="monthPicker"
        :columns="MonthListOption"
        @cancel="showMonth = false"
        @confirm="onMonthSelect"
        :confirm-button-text="$t('Base.Confirm')"
        :cancel-button-text="$t('Base.Cancel')"
      />
    </Popup>
  </div>
</template>

<script lang="ts">
import { Picker, Popup } from 'vant';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
const MONTH_SELECT_COUNT = 6;
export type IMonthOption = {
  text: string;
  value: { year: number; month: number };
};
@Component({
  components: { Picker, Popup },
})
export default class VMonthPicker extends Vue {
  $refs: {
    monthPicker: Picker;
  };

  @Prop({
    type: String,
    required: false,
  })
  triggerClass: string;

  getCurValue() {
    const month = this.curMonthItem;
    return month?.value;
  }

  //#region   
  showMonth = false;

  /**
   *       
   */
  curMonthIdx = MONTH_SELECT_COUNT - 1;
  onMonthSelect(monthInfo: IMonthOption, mIdx: number) {
    // console.log('[DEBUG] monthSelect', mIdx, monthInfo);
    this.curMonthIdx = mIdx;
    this.showMonth = false;
    this.$emit('input', mIdx);
    this.$emit('selected', monthInfo, mIdx);
  }

  get curMonthItem() {
    return this.MonthListOption[this.curMonthIdx];
  }

  get curTimeDurObj() {
    const item = this.curMonthItem;
    if (!item) {
      return {};
    }
    const { year, month } = item.value;
    const endDt = new Date(year, month, 1, 0, 0, 0, 0); //       
    const startDt = new Date(endDt.getTime());
    startDt.setMonth(month - 1);
    return {
      startTime: startDt.getTime(),
      endTime: endDt.getTime(),
    };
  }

  get MonthListOption() {
    const dt = new Date();
    let list: IMonthOption[] = [];
    for (let i = 0; i < MONTH_SELECT_COUNT; i++) {
      let curMonthIdx = dt.getMonth();
      list.push({
        text: this.$t(`Base.MonthName[${curMonthIdx}]`) as string,
        value: {
          year: dt.getFullYear(),
          month: curMonthIdx + 1,
        },
      });
      dt.setMonth(dt.getMonth() - 1);
    }

    return list.reverse();
  }

  showMonthPicker() {
    this.showMonth = true;
    this.$nextTick(() => {
      this.$refs.monthPicker.setIndexes([this.curMonthIdx]);
    });
  }
  //#endregion
}
</script>
