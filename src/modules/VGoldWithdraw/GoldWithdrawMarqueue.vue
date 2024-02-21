<template>
  <div class="px-1.5 bg-white rounded-md h-8 flex items-center">
    <NoticeBar
      ref="bar"
      v-if="list && list.length > 0"
      class="flex items-center justify-between rounded-md text-xs w-full leading-4"
      style="padding: 0"
      color="#333"
      background="transparent"
    >
      <div class="flex flex-nowrap font-robot-medium font-medium text-[#333]">
        <i18n
          path="VGW.userWithdrawedMoney"
          tag="div"
          class="mr-4"
          v-for="item in list"
          :key="item.id"
        >
          <span class="text-[#33EC97]">{{ item.name }}</span>
          <span class="text-[#FF9C0A]">Rp{{ item.amount }}</span>
        </i18n>
      </div>
    </NoticeBar>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';
import { NoticeBar } from 'vant';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { GoldWithdrawMarqueueMixin } from './controller/GoldWithdrawMarqueue.state';
@Component({
  components: { NoticeBar },
})
export default class GoldWithdrawMarqueue extends mixins(
  GoldWithdrawMarqueueMixin,
  BindEventMixinDefault
) {
  $refs: { bar: NoticeBar };
  useInited() {
    this.refreshGoldWithdrawMarqueue();
    return noop;
  }

  @Prop({
    type: Boolean,
  })
  isActive: boolean;

  @Watch('isActive')
  onActiveChange(isActive: boolean) {
    if (isActive) {
      this.$nextTick(() => {
        const bar = this.$refs.bar as any;
        if (bar && bar.reset) {
          bar.reset();
        }
      });
    }
  }
  get list() {
    return (this.GoldWithdrawMarqueue || []).map((item) => {
      return {
        id: item.id,
        name: item.name,
        amount: this.$ss.getters.formatFloat(Number(item.amount)),
      };
    });
  }
}
</script>
