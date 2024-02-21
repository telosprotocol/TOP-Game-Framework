<template>
  <section class="pt-4 px-3 bg-white rounded-md">
    <h3 class="robot-medium mb-3">{{ $t('VGW.chooseWithdrawItem') }}</h3>
    <div class="-mx-1.5">
      <div
        class="rounded-md font-robot-medium text-sm text-opacity-[0.65] w-[94px] h-14 flex items-center justify-center float-left mx-1.5 mb-3 relative"
        v-for="item in withdrawTypeAndAmountList"
        :class="{
          'bg-[#FFF8A5] text-[#B02620]': item.amount === value,
          'bg-[#F6F1FD] text-[#333]': item.amount !== value,
        }"
        :key="item.amount"
        @click="onChoose(item)"
      >
        <div
          v-if="item.tag"
          class="absolute left-0 top-0 rounded-tl-md rounded-br-md rounded-tr-sm rounded-bl-sm text-xs bg-gradient-to-r from-[#FF0000] to-[#FF6B00] h-4 flex items-center text-white min-w-9 px-1 font-robot-medium"
        >
          <TimeCountDown
            v-if="item.withdrawType === 'LIMIT_WITHDRAW' && limitClientEndTime"
            :client-end-time="limitClientEndTime"
            :show-second="true"
            @countdownEnd="onLeftTimeout"
          ></TimeCountDown>
          <div v-else>
            {{ item.tag }}
          </div>
        </div>
        Rp {{ $ss.getters.formatFloat(Number(item.amount)) }}
      </div>
      <div class="clear-both"></div>
    </div>
  </section>
</template>

<script lang="ts">
import TimeCountDown from '@/components/CountDownTimer/TimeCountDown.vue';
import { getClientTimestampByAsyncStateItemRef } from '@/controller/AsyncStateItem';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { VGoldWithdrawInfoMixin } from './controller/VGoldWithdraw.state';
@Component({
  components: { TimeCountDown },
})
export default class VGoldWithdrawSuggestInputBlock extends mixins(
  VGoldWithdrawInfoMixin
) {
  @Prop({
    type: String,
  })
  value: string;

  get withdrawTypeAndAmountList() {
    return (
      this.GoldWithdrawInfoNormal.payAutoWithdrawInfo
        .withdrawTypeAndAmountList || []
    ).map((item) => {
      return {
        ...item,
        tag: this.getTag(item),
      };
    });
  }
  getTag(item: API.WithdrawTypeAndAmount) {
    if (item.withdrawType === 'SMALL_WITHDRAW') {
      return 'HOT';
    } else if (item.withdrawType === 'LIMIT_WITHDRAW') {
      return this.$t('VGW.limitTag');
    }
    return null;
  }

  get limitClientEndTime() {
    const limitTimeStamp =
      this.GoldWithdrawInfoNormal?.payLimitWithdrwaInfoVO?.limitTimeStamp;

    return getClientTimestampByAsyncStateItemRef(
      limitTimeStamp,
      this.stateItemVGoldWithdrawInfoRef
    );
  }
  onLeftTimeout() {
    this.refreshVGoldWithdrawInfo(10);
  }
  onChoose(item: API.WithdrawTypeAndAmount) {
    this.$emit('input', item.amount);
    this.$emit('update:withdrawType', item.withdrawType);
  }
}
</script>
