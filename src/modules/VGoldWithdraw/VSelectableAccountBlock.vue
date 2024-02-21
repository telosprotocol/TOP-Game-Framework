<template>
  <section>
    <h3 class="robot-medium mb-2">
      {{ $t('VGW.selectWithdrawalAccount') }}
    </h3>
    <div class="mb-2">
      <VSelectableAccountItem
        :info="item"
        :key="item.type"
        ref="accountItemList"
        v-for="item in visibleAccountList"
        :checked="curAccountChannelType === item.type"
        @selected="onSelectAccount"
        @startBind="onStartBindAccount"
      ></VSelectableAccountItem>
    </div>
    <div
      v-if="needExpandBlock"
      ref="expandBlock"
      class="bg-[#F6F2FC] text-[#9567D1] h-[15px] flex items-center justify-center"
      @click="onExpandAccountList"
    >
      <div
        class="iconfont icon-up transition-transform"
        :class="{ 'rotate-180': !isExpand }"
      ></div>
    </div>
    <portal to="modal">
      <VInputAccountDlg
        v-model="isBindDlgOpened"
        :info="bindDlgInfo"
        :open-source="openSource"
        :from="bindDlgFrom"
        :small-limit-amount="smallLimitAmount"
        @updated="onAccountItemUpdated"
      ></VInputAccountDlg>
    </portal>
  </section>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';
import VSelectableAccountItem from './VSelectableAccountItem.vue';

import VInputAccountDlg from './VInputAccountDlg.vue';
import type { IWithdrawType } from './controller/VGoldWithdraw.state';

const INITIAL_VISIBLE_ACCOUNT_COUNT = 2;

@Component({
  components: { VSelectableAccountItem, VInputAccountDlg },
})
export default class VSelectableAccountBlock extends Vue {
  $refs: {
    expandBlock: HTMLDivElement;
  };

  @Prop({
    type: String,
  })
  withdrawType: IWithdrawType;

  /**
   *
   */
  @Prop({
    type: String,
    required: false,
  })
  openSource: string;

  @Prop({
    type: Array,
  })
  rawAccountList: API.WithdrawalForAccountViewVO[];

  @Prop({
    type: Object,
    required: false,
  })
  payAutoWithdrawInfo: API.PayAutoWithdrawInfoVO;

  rawCurAccountItem: API.WithdrawalForAccountViewVO = null;

  get curAccountItem() {
    return this.rawCurAccountItem || this.visibleAccountList[0];
  }

  get curAccountChannelType() {
    return this.curAccountItem?.type;
  }

  get accountList() {
    let list = this.rawAccountList;
    if (this.withdrawType === 'SMALL_WITHDRAW') {
      const payChannel = this.payAutoWithdrawInfo?.payChannel;
      list = list.filter((item) => item.type === payChannel);
    }
    return list.map((item) => {
      return item;
    });
  }
  get smallLimitAmount() {
    return this.payAutoWithdrawInfo?.limitAmount;
  }
  get visibleAccountList() {
    if (this.isExpand) {
      return this.accountList;
    }
    return this.accountList.slice(0, INITIAL_VISIBLE_ACCOUNT_COUNT);
  }

  isExpand = false;

  get needExpandBlock() {
    return this.accountList.length > INITIAL_VISIBLE_ACCOUNT_COUNT;
  }

  onExpandAccountList() {
    this.isExpand = !this.isExpand;
    this.$nextTick(() => {
      this.$refs.expandBlock.scrollIntoView({
        behavior: 'smooth',
      });
    });
  }

  /**
   *
   * @param item
   */
  onSelectAccount(
    item: typeof VSelectableAccountBlock.prototype.accountList[0]
  ) {
    this.rawCurAccountItem = item;
  }

  //#region

  bindDlgInfo: API.WithdrawalForAccountViewVO = null;
  bindDlgFrom = '';
  isBindDlgOpened = false;
  /**
   *
   */
  onStartBindAccount(
    item: typeof VSelectableAccountBlock.prototype.accountList[0],
    from: 'check' | 'edit'
  ) {
    this.rawCurAccountItem = item;
    this.isBindDlgOpened = true;
    this.bindDlgInfo = item;
    this.bindDlgFrom = from;
  }

  /**
   *
   * @param item
   */
  onAccountItemUpdated(cItem: API.WithdrawalForAccountViewVO) {
    this.rawAccountList.forEach((item, idx) => {
      if (item.type === cItem.type) {
        this.$set(this.rawAccountList, idx, cItem);
      }
    });
    this.rawCurAccountItem = cItem;
  }

  startBindCurAccount() {
    this.bindDlgInfo = this.curAccountItem;
    this.isBindDlgOpened = true;
  }
  // #endregion
}
</script>
