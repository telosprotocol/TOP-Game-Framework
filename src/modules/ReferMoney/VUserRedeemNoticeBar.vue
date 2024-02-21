<template>
  <div class="w-full h-full">
    <NoticeBar
      ref="notice"
      v-if="hasRedeemList"
      scrollable
      color="#ffffff"
      style="padding: 0; height: 100%"
      background="transparent"
    >
      <div class="flex flex-nowrap">
        <div
          v-for="(item, idx) in redeemList"
          class="flex items-center justify-center px-4"
          :key="idx"
        >
          <i18n
            tag="div"
            path="VRM.userJustRedeem"
            class="robot-regular text-center"
          >
            <span>{{ item[0] }}</span>
            <span class="robot-bold text-[#FFFA8B]">{{ item[1] }}</span>
          </i18n>
        </div>
      </div>
    </NoticeBar>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { stringShield } from '@/utils/string';
import { NoticeBar } from 'vant';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';
import { formatVRp } from '@/modules/vFormatter';
import { withdrawalRecordUserInfoWithdrawalController } from '@/vservices/client/WithdrawalController';
@Component({
  components: {
    NoticeBar,
  },
})
export default class VUserRedeemNoticeBar extends mixins(
  BindEventMixinDefault
) {
  $refs: {
    notice: NoticeBar;
  };
  useInited() {
    withdrawalRecordUserInfoWithdrawalController({
      amountOrder: false,
      count: 20,
      pageIndex: 1,
      pageSize: 20,
    }).then((res) => {
      if (res.success) {
        this.rawList = res.data;
        this.$nextTick(() => {
          (this.$refs.notice as any)?.reset(); //   Notice
        });
      }
    });
    return noop;
  }

  rawList: API.WidthdrawlUserInfoVO[] = [];
  //#region
  hasRedeemList() {
    return this.rawList && this.rawList.length > 0;
  }
  get redeemList() {
    return (this.rawList || []).map((item) => {
      return [
        stringShield(item.name),
        this.$t('Base.xRp', { n: formatVRp(Number(item.amount)) }),
      ];
    });
  }
  //#endregion
}
</script>
