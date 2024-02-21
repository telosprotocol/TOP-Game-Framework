<template>
  <div
    class="rounded-xl bg-gradient-to-r from-[#A971FA] to-[#852AE9] p-3 text-white text-xs"
  >
    <div class="robod-bold text-base text-center">
      {{ $t('VPIN.incomeMethod') }}
    </div>
    <div class="flex items-center flex-wrap">
      <div
        v-for="item in methodList"
        :key="item.type"
        class="w-1/2 py-2.5 pr-2 flex items-center"
      >
        <Popover
          slot="right"
          theme="dark"
          :value="curTipShow === item.type"
          @input="onTipShowChange($event, item.type, item.tipEvent)"
          placement="top-start"
          trigger="click"
        >
          <div
            class="p-2"
            :style="$ss.getters.designPxsObjToReal({ width: 172 })"
          >
            {{ item.tips }}
          </div>
          <template #reference>
            <div
              class="w-9 h-9 bg-contain bg-no-repeat bg-center mr-1 relative"
              :style="$ss.getters.convertBgImageStyle(item.icon, true)"
            >
              <div
                class="absolute inset-0"
                :style="$ss.getters.designPxsObjToReal({ right: -80 })"
              ></div>
            </div>
          </template>
        </Popover>
        <div class="robot-medium leading-[14px]">{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { traceElementExpose } from '@/utils/trace';
import { Popover } from 'vant';
import Component, { mixins } from 'vue-class-component';
@Component({
  components: { Popover },
})
export default class VPromoteIncomeIncomeSourceBlock extends mixins(
  BindEventMixinDefault
) {
  useInited() {
    const offCb = traceElementExpose(
      this.$el as HTMLElement,
      'dropdown_directpush_income_exposure',
      { content_type: 'sourceblock' }
    );
    return offCb;
  }
  curTipShow = '';

  onTipShowChange(isShow: boolean, type: string, eventName: string) {
    if (isShow) {
      this.$trace(eventName);
      this.curTipShow = type;
    } else if (type === this.curTipShow && isShow == false) {
      this.curTipShow = '';
    }
    // console.log('[DEBUG] onTipShowChange', event, type);
  }

  get methodList() {
    return [
      {
        type: 'RL',
        text: this.$t('VPIN.RL'),
        tips: this.$t('VPIN.RLTip'),
        icon: '/online/playIncomeN/method1.png?webp',
        tipEvent: 'directpush_income_exposure',
      },
      {
        type: 'RTL',
        text: this.$t('VPIN.RTL'),
        tips: this.$t('VPIN.RTLTip'),
        icon: '/online/playIncomeN/method2.png?webp',
        tipEvent: 'intermediary_income_exposure',
      },
      {
        type: 'topup',
        text: this.$t('VPIN.TopupIncome'),
        tips: this.$t('VPIN.TopupIncomeTip'),
        icon: '/online/playIncomeN/method3.png?webp',
        tipEvent: 'recharge_rebate_exposure',
      },
      {
        type: 'teamTopup',
        text: this.$t('VPIN.TeamTopup'),
        tips: this.$t('VPIN.TeamTopupTip'),
        icon: '/online/playIncomeN/method4.png?webp',
        tipEvent: 'team_mining_exposure',
      },
    ];
  }
}
</script>
