<template>
  <div class="flex flex-col">
    <section class="overflow-auto w-full">
      <div class="flex items-center mb-4 overflow-auto px-3">
        <div
          v-for="item in statusOptions"
          class="rounded-full text-sm leading-none bg-white py-1.5 px-3 mr-2 whitespace-nowrap"
          :class="{
            'text-[#7C47C1] font-medium': curIdx === item.idx,
            'text-[#666]': curIdx !== item.idx,
          }"
          @click="onStatusChange(item)"
          :key="item.text"
        >
          {{ item.text }}
        </div>
      </div>
    </section>
    <main
      class="mx-3 flex-1 px-4 pb-2 mb-2 overflow-y-auto bg-white rounded-md"
    >
      <NoDataIcon class="text-[#9567D1] mt-6" v-if="isNoData"></NoDataIcon>
      <List
        v-model="loading"
        :finished="finished"
        :error-text="errorText || $t('Base.FailLoad')"
        :error.sync="error"
        @load="onLoad"
      >
        <div
          v-for="item in dataList"
          :key="item.id"
          class="text-[13px] py-4 border-solid border-[#9567D1]"
          :class="{ 'border-b': !item.isLast }"
        >
          <div class="flex justify-between mb-1">
            <div class="text-[15px] robot-bold mr-1">
              {{ item.textMoney }}
            </div>
            <div class="mr-1 flex-1" :class="item.textClass">
              {{ item.textStatus }}
            </div>
            <div class="text-[#9567D1]">{{ item.textDate }}</div>
          </div>
          <div class="flex justify-between text-[#9567D1]">
            <div>{{ item.textDesc }}</div>
            <div>{{ item.textFee }}</div>
          </div>
          <div class="mt-1 text-[#F93B0B]" v-if="item.reason">
            {{ item.reason }}
          </div>
        </div>
      </List>
    </main>
    <div
      class="mx-3 p-2 bg-white rounded-md relative"
      v-if="!isBottomTipClosed"
    >
      <span class="font-bold font-robot-bold">{{ $t('VWH.notice') }}</span>
      <span v-html="$t('VWH.bottomTip')"></span>
      <button
        class="absolute right-0 top-0 p-1 pl-2 text-[#ccc]"
        @click="isBottomTipClosed = true"
      >
        <ib class="iconfont icon-close text-xs"></ib>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import NoDataIcon from '@/components/NoData/NoDataIcon.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import { formatDateTime } from '@/utils/datetime';
import { gameWithdrawalGoldRecordWithdrawalController } from '@/vservices/client/WithdrawalController';
import { Checkbox, CheckboxGroup, List } from 'vant';
import Component, { mixins } from 'vue-class-component';

type VWithdrawalStatus = API.WithdrawalLogVO['status'];

const ITEM_FAIL_STATUSLIST = [
  'AUDIT_FAIL',
  'WITHDRAWAL_FAIL',
  'WITHDRAWAL_CLOSE',
] as VWithdrawalStatus[];
@Component({
  components: {
    Checkbox,
    CheckboxGroup,
    List,
    NoDataIcon,
  },
})
export default class VWithdrawHistory extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  useInited() {
    // this.onLoad = debounce(this.onLoad.bind(this), 20);
    // this.resetLoad();
    // this.onLoad('init');
    return () => {
      //    destroy
    };
  }
  isBottomTipClosed = false;
  //#region

  curIdx = 0;

  get curStatusItem() {
    return this.statusOptions[this.curIdx];
  }
  get statusOptions() {
    return (
      [
        {
          text: this.$t('VWH.all'),
          value: undefined,
        },
        {
          text: this.$t('VWH.wStatus_AUDIT_PROGRESS'),
          value: ['AUDIT_PROGRESS'],
        },
        {
          text: this.$t('VWH.wStatus_COMPLETED'),
          value: ['COMPLETED'],
        },
        {
          text: `${this.$t('VWH.wStatus_AUDIT_FAIL')}/${this.$t(
            'VWH.wStatus_WITHDRAWAL_CLOSE'
          )}`,
          value: ITEM_FAIL_STATUSLIST,
        },
      ] as {
        text: string;
        value?: VWithdrawalStatus[];
      }[]
    ).map((item, idx) => {
      return {
        ...item,
        idx,
      };
    });
  }

  onStatusChange(item: { text: string; idx: number }) {
    if (this.curIdx === item.idx) {
      return;
    }
    this.curIdx = item.idx;

    const statusList = this.curStatusItem.value;
    this.$tracev('click_game_tarikdana_condi_list', {
      condition: statusList ? statusList.join(',') : 'all',
      // channel: channelTypes.join(','),
      // cycle_type: this.$refs.timeOption.value,
    });
    this.resetLoad();
    this.onLoad('filiterType');
  }
  //#endregion

  //#region
  loading = false;
  finished = false;
  error = false;
  errorText = '';
  queryObj = {
    pageIndex: 1,
    pageSize: 8,
  };

  get isNoData() {
    return this.rawDataList.length === 0 && !this.loading && !this.error;
  }
  resetLoad() {
    // console.log('[DEBUG] history resetLoad');
    this.queryObj.pageIndex = 1;
    this.rawDataList = [];
    this.finished = false;
  }
  onLoad(_from?: string) {
    const queryObj = {
      ...this.queryObj,
      statusList: this.curStatusItem.value,
    };
    // console.log('[DEBUG] onLoad ', _from, queryObj);
    this.loading = true;
    gameWithdrawalGoldRecordWithdrawalController(queryObj).then((res) => {
      const { pageIndex, pageSize } = queryObj;
      if (pageIndex !== this.queryObj.pageIndex) {
        return;
      }
      if (res.success) {
        const hasNext = res.total > pageIndex * pageSize;
        this.finished = !hasNext;
        this.rawDataList = this.rawDataList.concat(res.data || []);
        this.queryObj.pageIndex++;
        this.loading = false;
        this.error = false;
      } else {
        this.loading = false;
        this.error = true;
        this.errorText = res.message;
      }
    });
  }
  //#endregion

  rawDataList: API.WithdrawalLogVO[] = [];

  get dataList() {
    const configStatusMap = {
      AUDIT_PROGRESS: {
        textStatus: this.$t('VWH.wStatus_AUDIT_PROGRESS') as string,
        textClass: 'text-[#37A01B]',
      },
      AUDIT_PASSED: {
        textStatus: this.$t('VWH.wStatus_AUDIT_PASSED') as string,
        textClass: 'text-[#37A01B]',
      },
      COMPLETED: {
        textStatus: this.$t('VWH.wStatus_COMPLETED') as string,
        textClass: 'text-[#3D79F2]',
      },
      AUDIT_FAIL: {
        textStatus: this.$t('VWH.wStatus_AUDIT_FAIL') as string,
        textClass: 'text-[#F93B0B]',
      },
      WITHDRAWAL_FAIL: {
        textStatus: this.$t('VWH.wStatus_WITHDRAWAL_FAIL') as string,
        textClass: 'text-[#F93B0B]',
      },
      WITHDRAWAL_CLOSE: {
        textStatus: this.$t('VWH.wStatus_WITHDRAWAL_CLOSE'),
        textClass: 'text-[#666]',
      },
      WITHDRAWAL_QUEUE: {
        textStatus: this.$t('VWH.wStatus_WITHDRAWAL_QUEUE'),
        textClass: 'text-[#37A01B]',
      },
      WITHDRAWAL_QUEUE_CANCEL: {
        textStatus: this.$t('VWH.wStatus_WITHDRAWAL_QUEUE_CANCEL'),
        textClass: 'text-[#666]',
      },
    };
    const formatFloat = this.$ss.getters.formatFloat;
    const list = this.rawDataList;
    return list
      .map((item) => {
        const failStatus = ITEM_FAIL_STATUSLIST.find(
          (st) => st === item.status
        );
        return {
          id: item.id,
          textMoney: formatFloat(Number(item.amount)),
          textDesc: this.$t('VWH.xWithdraw', [item.channelName]),
          textDate: formatDateTime(item.modifiedDate),
          textFee: `Fee: ${formatFloat(Number(item.fee))}`,
          ...configStatusMap[item.status],
          reason: failStatus ? item.reason : '',
        };
      })
      .map((item, idx) => {
        return {
          ...item,
          isLast: list.length - 1 === idx,
        };
      });
  }
}
</script>
