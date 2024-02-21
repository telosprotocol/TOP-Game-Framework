<template>
  <div class="h-screen flex flex-col bg-white">
    <div
      class="absolute top-0 left-0 right-0 z-0 overflow-hidden"
      :style="$ss.getters.designPxsObjToReal({ height: 200 })"
    >
      <VPurpleCircleBgUI></VPurpleCircleBgUI>
    </div>
    <HeaderTop
      class="shrink-0"
      skin="dark"
      left-icon-event="return_dst_detail"
      :left-icon-event-data="tracePageData"
      :title="$t('VDD.details')"
      left-icon="icon-back"
      bar-background="transparent"
    >
      <div
        slot="beforeInner"
        class="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <VPurpleCircleBgUI></VPurpleCircleBgUI>
      </div>
    </HeaderTop>
    <section class="relative z-[2] shrink-0 pt-1 pb-5 text-white">
      <div class="flex justify-between mx-4 mb-2">
        <VMonthPicker
          class="flex-1 mr-2"
          trigger-class="text-white"
          ref="monthPicker"
          @selected="onMonthSelected"
        ></VMonthPicker>
        <div class="flex-1">
          <div
            v-if="!pageSourceInfo"
            @click="showDSTSourcePicker"
            class="flex items-center robot-medium text-base text-white"
          >
            <div>{{ curDSTSourceText || '' }}</div>
            <ib
              class="iconfont icon-down transition-transform"
              :class="{
                'rotate-180': showDSTSource,
              }"
            ></ib>
          </div>
          <van-popup
            v-model="showDSTSource"
            round
            position="bottom"
            v-if="!pageSourceInfo"
          >
            <van-picker
              style="color: white"
              class="text-white"
              show-toolbar
              ref="dstSourcePicker"
              :columns="DSTSourceList"
              @cancel="showDSTSource = false"
              @confirm="onDSTSourceSelect"
              :confirm-button-text="$t('Base.Confirm')"
              :cancel-button-text="$t('Base.Cancel')"
            />
          </van-popup>
        </div>
      </div>
      <div
        class="flex justify-between mx-4 text-white text-[14px] leading-none"
      >
        <div class="flex-1 mr-2 overflow-hidden">
          <div class="mb-2">{{ $t('VDD.dstBenefits') }}:</div>
          <VAssetBlockUI coin-type="VTOKEN">{{
            cSummaryInfo ? cSummaryInfo.beanefitsAmount : ''
          }}</VAssetBlockUI>
        </div>
        <div class="flex-1 overflow-hidden">
          <div v-if="!pageSourceInfo || !pageSourceInfo.nopayout">
            <div class="mb-2">{{ $t('VDD.dstPayout') }}:</div>
            <VAssetBlockUI coin-type="VTOKEN">{{
              cSummaryInfo ? cSummaryInfo.payoutAmount : ''
            }}</VAssetBlockUI>
          </div>
        </div>
      </div>
    </section>
    <main class="relative z-[1] flex-1 overflow-y-auto rounded-t-3xl bg-white">
      <NoDataIcon
        v-if="isNoData"
        class="text-[#333] text-[14px] mt-12"
      ></NoDataIcon>
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
          class="flex items-start mx-4 border-b border-solid border-[#EEE] py-4 text-base"
        >
          <div
            class="shrink-0 w-10 h-10 bg-[#F1F3FF] rounded-full flex items-center justify-center mr-2"
          >
            <div
              class="shrink-0 w-8 h-8 box-content bg-contain bg-center bg-no-repeat"
              v-webp="require('@/assets/vcommon/CoinVToken.png?webp')"
            ></div>
          </div>
          <div class="flex-1">
            <div class="font-rubki font-bold text-[#333] mb-2">
              {{ item.tokenSourceName }}
            </div>
            <div class="text-xs leaindg-none opacity-60">
              {{ item.txtTime }}
            </div>
          </div>
          <div
            class="font-din-bold rounded-full px-2 w-24 text-right py-[1px]"
            :class="{
              'text-[#9E6FFB] bg-[#F1F3FF]': item.direct === 'ADD',
              'text-[#777] bg-[#F5F5F5]': item.direct === 'SUB',
            }"
          >
            {{ item.txtAmount }}
          </div>
        </div>
      </List>
    </main>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import NoDataIcon from '@/components/NoData/NoDataIcon.vue';
import { Picker, Popup, List, Toast } from 'vant';
import Component, { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjDSTDetail } from '@/locales/Page/VPrj/VDD/init';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { getFirstString } from '@/utils/string';

import { formatVToken } from '@/modules/vFormatter';
import { formatFullDateTime } from '@/utils/datetime';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import { convert2QueryStr } from '@/utils/url';
import VMonthPicker, {
  IMonthOption,
} from '@/modules/VMonthPicker/VMonthPicker.vue';
import VAssetBlockUI from '@/modules/VAssetInfo/VAssetBlockUI.vue';
import VPurpleCircleBgUI from '@/components/VPurpleCircleBgUI.vue';
import type { TokenSourceType } from '@/modules/RightWallet/RightWallet.model';
import {
  pageUserTokenLogController,
  tokenStatUserTokenLogController,
} from '@/vservices/client/UserTokenLogController';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjDSTDetail();

@Component({
  components: {
    HeaderTop,
    'van-popup': Popup,
    'van-picker': Picker,
    List,
    NoDataIcon,
    VMonthPicker,
    VAssetBlockUI,
    VPurpleCircleBgUI,
  },
})
export default class VRightDSTDetailPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  statusBarColor = '#9161CF';

  useInited() {
    const pageSourceInfo = this.pageSourceInfo;
    if (pageSourceInfo) {
      this.curDSTIdx = pageSourceInfo.idx;
    }
    this.$trace('dst_detail_expose', {
      sourceType: this.curDSTSourceValue,
      ...this.tracePageData,
    });
    return () => {};
  }

  get tracePageData() {
    return {
      querySourceType: this.pageSourceInfo?.value || 'all',
    };
  }

  /**
   *         ，
   *  :       ，  ，
   */
  get pageSourceInfo() {
    const querySourceType = getFirstString(this.$route.query.sourceType);
    if (querySourceType) {
      const dstSourceItemIdx = this.DSTSourceList.findIndex(
        (item) => item.value === querySourceType
      );

      const item = this.DSTSourceList[dstSourceItemIdx];
      if (!item) {
        return null;
      }
      return {
        idx: dstSourceItemIdx,
        value: item.value,
        nopayout: item.nopayout,
      };
    }
    return null;
  }

  //#region Query
  $refs: {
    monthPicker: VMonthPicker;
    dstSourcePicker: Picker;
  };

  //#region dstSource

  showDSTSource = false;

  curDSTIdx = 0;

  get curDSTSourceValue() {
    return this.DSTSourceList[this.curDSTIdx]?.value;
  }
  get curDSTSourceText() {
    return this.DSTSourceList[this.curDSTIdx]?.text;
  }
  showDSTSourcePicker() {
    this.showDSTSource = true;
    this.$nextTick(() => {
      this.$refs.dstSourcePicker.setIndexes([this.curDSTIdx]);
    });
  }
  get DSTSourceList() {
    return [
      { value: '', text: this.$t('VDD.all') },
      { value: 'exchange_gold', text: this.$t('VDD.exchange_gold') },
      { value: 'play_game', text: this.$t('VDD.play_game'), nopayout: true },
      {
        value: 'team_recharge_rewards',
        text: this.$t('VDD.team_recharge_rewards'),
      },
      {
        value: 'activity',
        text: this.$t('VDD.activity'),
      },
    ] as { value: TokenSourceType | ''; text: string; nopayout?: boolean }[];
  }

  onDSTSourceSelect(
    _label: { value: TokenSourceType | ''; text: string },
    dIdx: number
  ) {
    // console.log('onDSTSourceSelect', dIdx, label);
    this.curDSTIdx = dIdx;
    this.showDSTSource = false;
    this.resetLoad();
    this.onLoad('selectTokenSource');
  }
  //#endregion

  onMonthSelected(_monthInfo: IMonthOption) {
    // console.log('[DEBUG] onMonthSelected', monthInfo);
    this.resetLoad();
    this.onLoad('selectMonth');
  }

  //#endregion

  //#region
  loading = false;
  finished = false;
  error = false;
  errorText = '';
  pageQueryObj = {
    pageIndex: 1,
    pageSize: 8,
  };
  rawDataList: API.UserTokenLogVO[] = [];
  get isNoData() {
    return this.rawDataList.length === 0 && !this.loading && !this.error;
  }

  /**
   *
   */
  get curFilterData() {
    const month = this.$refs.monthPicker?.curMonthItem;
    const sourceType = this.curDSTSourceValue;
    return {
      ...month?.value,
      sourceType: sourceType ? sourceType : undefined,
    };
  }

  resetLoad() {
    this.pageQueryObj.pageIndex = 1;
    this.rawDataList = [];
    this.finished = false;
  }
  onLoad(from: 'selectMonth' | 'selectTokenSource' | 'init') {
    const queryObj = {
      ...this.curFilterData,
      ...this.pageQueryObj,
    };
    // console.log('[DEBUG] UpdateList', { ...queryObj }, from);
    this.$trace('dst_detail_list_request', {
      ...queryObj,
      dataSource: from,
      ...this.tracePageData,
    });
    this.loading = true;
    this.tryUpdateDSTDetailSummary();
    pageUserTokenLogController(queryObj).then((res) => {
      const { pageIndex, pageSize } = queryObj;
      if (pageIndex !== this.pageQueryObj.pageIndex) {
        return;
      }
      if (res.success) {
        const hasNext = res.total > pageIndex * pageSize;
        this.finished = !hasNext;
        this.rawDataList = this.rawDataList.concat(res.data || []);
        this.pageQueryObj.pageIndex++;
        this.loading = false;
        this.error = false;
      } else {
        this.loading = false;
        this.error = true;
        this.errorText = res.message;
      }
    });
  }

  get dataList() {
    return this.rawDataList.map((item) => {
      return {
        ...item,
        txtAmount:
          (item.direct === 'SUB' ? '-' : '+') +
          formatVToken(Number(item.amount)),
        txtTime: formatFullDateTime(Number(item.createdDate)),
      };
    });
  }
  //#endregion

  //#region Summary
  _lastSummaryFilterDataStr: string;

  get curFilterDataStr() {
    const curFilterData = this.curFilterData;
    return convert2QueryStr(curFilterData);
  }

  summaryInfo: API.UserTokenLogStatVO = null;

  get cSummaryInfo() {
    const summaryInfo = this.summaryInfo;
    if (summaryInfo) {
      return {
        beanefitsAmount: formatVToken(Number(summaryInfo.beanefitsAmount)),
        payoutAmount: formatVToken(Number(summaryInfo.payoutAmount)),
      };
    } else {
      return null;
    }
  }

  tryUpdateDSTDetailSummary() {
    const curFilterDataStr = this.curFilterDataStr;
    if (this._lastSummaryFilterDataStr === curFilterDataStr) {
      return;
    }
    // console.log('[DEBUG] summary', { ...this.curFilterData }, curFilterDataStr);
    this._lastSummaryFilterDataStr = curFilterDataStr;
    tokenStatUserTokenLogController(this.curFilterData).then((res) => {
      if (res.success) {
        this.summaryInfo = res.data;
      } else {
        if (this._lastSummaryFilterDataStr === curFilterDataStr) {
          this._lastSummaryFilterDataStr = '';
        }
        Toast(res.message);
      }
    });
  }
  //#endregion
}
</script>
