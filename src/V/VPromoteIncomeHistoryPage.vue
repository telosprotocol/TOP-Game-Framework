<template>
  <div class="h-screen flex flex-col bg-white">
    <div
      class="absolute top-0 left-0 right-0 z-0 overflow-hidden"
      :style="$ss.getters.designPxsObjToReal({ height: 200 })"
    >
      <VPurpleCircleBgUI></VPurpleCircleBgUI>
    </div>
    <HeaderTop
      skin="dark"
      class="shrink-0"
      :title="$t('VPIH.title')"
      left-icon="icon-back"
      bar-background="transparent"
      left-icon-event="return_invite_revenue_details"
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
            @click="showIncomeTypePicker"
            class="flex items-center robot-medium text-base text-white"
          >
            <div>{{ curIncomeTypeText || '' }}</div>
            <ib
              class="iconfont icon-down transition-transform"
              :class="{
                'rotate-180': showIncomeType,
              }"
            ></ib>
            <div class="h-full w-8"></div>
          </div>

          <van-popup
            v-model="showIncomeType"
            round
            position="bottom"
            :title="$t('VPIH.type')"
            v-if="!pageSourceInfo"
          >
            <van-picker
              show-toolbar
              ref="dstSourcePicker"
              :columns="IncomeTypeList"
              @cancel="showIncomeType = false"
              @confirm="onIncomeTypeSelect"
              :confirm-button-text="$t('Base.Confirm')"
              :cancel-button-text="$t('Base.Cancel')"
            />
          </van-popup>
        </div>
      </div>
      <div
        class="flex justify-between mx-4 text-white text-[14px] leading-none"
      >
        <div
          class="flex-1 mr-2 overflow-hidden"
          v-for="item in cSummaryInfo"
          :class="item.className"
          :key="item.type"
        >
          <div class="mb-2">{{ item.title }}:</div>
          <VAssetBlockUI :coin-type="item.type">{{
            item.txt || ''
          }}</VAssetBlockUI>
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
          class="mx-4 pt-4 text-base"
        >
          <div class="flex items-start">
            <div
              class="shrink-0 w-8 h-8 box-content bg-contain bg-center bg-no-repeat mr-2"
              v-webp="item.icon"
            ></div>
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div class="font-rubki font-bold text-[#333] mb-3 flex-1">
                  {{ item.inviteDescription }}
                </div>
                <div
                  class="font-din-bold rounded-full px-2 w-24 text-right py-[1px]"
                  :class="item.txtAmountClassName"
                >
                  {{ item.txtIncomeAccount }}
                </div>
              </div>
              <div
                class="flex items-center justify-between border-b border-solid border-[#EEE] pb-4"
              >
                <div class="text-xs leaindg-none opacity-60">
                  {{ item.txtTime }}
                </div>

                <div
                  class="text-xs leaindg-none opacity-60"
                  v-if="item.txtAccountAmount"
                >
                  {{ item.curAccountTitle }} : {{ item.txtAccountAmount }}
                </div>
              </div>
            </div>
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

import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { getFirstString } from '@/utils/string';

import {
  formatAssetByType,
  formatVToken,
  formatVGold,
} from '@/modules/vFormatter';
import { formatFullDateTime } from '@/utils/datetime';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import { convert2QueryStr } from '@/utils/url';
import VMonthPicker, {
  IMonthOption,
} from '@/modules/VMonthPicker/VMonthPicker.vue';
import { tryMergeLocalesForVPrjPromoteIncomeHistory } from '@/locales/Page/VPrj/VPIH/init';
import VPurpleCircleBgUI from '@/components/VPurpleCircleBgUI.vue';
import VAssetBlockUI from '@/modules/VAssetInfo/VAssetBlockUI.vue';
import type { TokenSourceType } from '@/modules/RightWallet/RightWallet.model';
import type { VCoinEnum } from '../modules/VAssetInfo/VCoinEnum';
import {
  incomeDetailListGameInviteController,
  incomeDetailSummaryGameInviteController,
} from '@/vservices/client/GameInviteController';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjPromoteIncomeHistory();

@Component({
  components: {
    HeaderTop,
    'van-popup': Popup,
    'van-picker': Picker,
    List,
    NoDataIcon,
    VMonthPicker,
    VPurpleCircleBgUI,
    VAssetBlockUI,
  },
})
export default class VPromoteIncomeHistoryPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  statusBarColor = '#9161CF';

  useInited() {
    const pageSourceInfo = this.pageSourceInfo;
    if (pageSourceInfo) {
      this.curIncomeTypeIdx = pageSourceInfo.idx;
    }
    this.$trace('invite_revenue_details_exposure', {
      sourceType: this.curIncomeTypeValue,
    });
    return () => {};
  }

  /**
   *         ，
   *  :       ，  ，
   */
  get pageSourceInfo() {
    const querySourceType = getFirstString(this.$route.query.sourceType);
    if (querySourceType) {
      const dstSourceItemIdx = this.IncomeTypeList.findIndex(
        (item) => item.value === querySourceType
      );

      return {
        idx: dstSourceItemIdx,
        value: this.IncomeTypeList[dstSourceItemIdx].value,
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

  showIncomeType = false;

  curIncomeTypeIdx = 0;

  get curIncomeTypeValue() {
    return this.IncomeTypeList[this.curIncomeTypeIdx]?.value;
  }
  get curIncomeTypeText() {
    return this.IncomeTypeList[this.curIncomeTypeIdx]?.text;
  }
  showIncomeTypePicker() {
    this.showIncomeType = true;
    this.$nextTick(() => {
      this.$refs.dstSourcePicker.setIndexes([this.curIncomeTypeIdx]);
    });
  }
  get IncomeTypeList() {
    return [
      { value: undefined, text: this.$t('VPIH.all') },
      { value: 'GOLD', text: this.$t('VPIH.GOLD') },
      { value: 'VTOKEN', text: this.$t('VPIH.VTOKEN') },
      {
        value: 'DIRECT',
        text: this.$t('VPIH.DIRECT'),
      },
      {
        value: 'INDIRECT',
        text: this.$t('VPIH.INDIRECT'),
      },
    ] as { value?: API.IncomeDetailPageAO['incomeDetailType']; text: string }[];
  }

  onIncomeTypeSelect(
    _label: { value: TokenSourceType | ''; text: string },
    dIdx: number
  ) {
    this.$trace('click_invite_revenue_details_condition', {
      condition_type: _label.value + '',
      condition_month: this.$refs.monthPicker?.getCurValue().month + '',
    });
    // console.log('onIncomeTypeSelect', dIdx, label);
    this.curIncomeTypeIdx = dIdx;
    this.showIncomeType = false;
    this.resetLoad();
    this.onLoad('selectIncomeType');
  }
  //#endregion

  onMonthSelected(monthInfo: IMonthOption) {
    this.$trace('click_invite_revenue_details_condition', {
      condition_month: monthInfo.value.month + '',
      condition_type: this.curIncomeTypeValue + '',
    });
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
  rawDataList: API.IncomeDetailListVO[] = [];
  get isNoData() {
    return this.rawDataList.length === 0 && !this.loading && !this.error;
  }

  /**
   *
   */
  get curFilterData() {
    const curTimeDurObj = this.$refs.monthPicker?.curTimeDurObj;
    const incomeDetailType = this.curIncomeTypeValue;
    return { incomeDetailType, ...curTimeDurObj };
  }

  resetLoad() {
    this.pageQueryObj.pageIndex = 1;
    this.rawDataList = [];
    this.finished = false;
  }
  onLoad(_from: 'selectMonth' | 'selectIncomeType' | 'init') {
    const queryObj = {
      ...this.curFilterData,
      ...this.pageQueryObj,
    };
    // console.log('[DEBUG] UpdateList', { ...queryObj }, from);

    this.loading = true;
    this.tryUpdateIncomeDetailSummary();
    incomeDetailListGameInviteController(queryObj).then((res) => {
      if (res.success) {
        const hasNext =
          res.total > this.pageQueryObj.pageIndex * this.pageQueryObj.pageSize;
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
      const incomeAccount = Number(item.incomeAmount);
      const incomeSign = incomeAccount > 0 ? '+' : '';
      const IncomeTypeConfig = {
        GOLD: {
          icon: require('@/assets/vcommon/CoinGold.png?webp'),
          txtAccountClassName: 'text-[#F5A000] bg-[#FEFAE9]',
        },
        BONUS_GOLD: {
          icon: require('@/assets/vcommon/CoinGold.png?webp'),
          txtAccountClassName: 'text-[#F5A000] bg-[#FEFAE9]',
        },
        VTOKEN: {
          icon: require('@/assets/vcommon/CoinVToken.png?webp'),
          txtAccountClassName: 'text-[#9E6FFB] bg-[#F1F3FF]',
        },
      };
      const incomeTypeItem = IncomeTypeConfig[item.incomeType];
      return {
        ...item,
        icon: incomeTypeItem?.icon,
        direct: incomeAccount > 0 ? 'ADD' : 'SUB',
        txtIncomeAccount:
          incomeSign +
          formatAssetByType(incomeAccount, item.incomeType as VCoinEnum),
        txtAmountClassName: (incomeTypeItem || IncomeTypeConfig.VTOKEN)
          .txtAccountClassName,
        txtAccountAmount: formatAssetByType(
          Number(item.currentAmount),
          item.incomeType as VCoinEnum
        ),
        curAccountTitle: {
          GOLD: this.$t('VPIH.amount_GOLD'),
          BONUS_GOLD: this.$t('VPIH.amount_GOLD'),
          VTOKEN: this.$t('VPIH.amount_VTOKEN'),
        }[item.incomeType],
        txtTime: formatFullDateTime(Number(item.incomeTime)),
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

  summaryInfo: API.IncomeDetailStatVO = null;

  get cSummaryInfo() {
    const summaryInfo = this.summaryInfo;
    const curIncomeTypeValue = this.curIncomeTypeValue;

    const list = [
      {
        type: 'VTOKEN',
        txt: summaryInfo
          ? formatVToken(Number(summaryInfo.totalDstIncomeAmount))
          : '',
        title: this.$t('VPIH.VTOKEN'),
      },
      {
        type: 'GOLD',
        txt: summaryInfo
          ? formatVGold(Number(summaryInfo.totalGoldIncomeAmount))
          : '',
        className: 'mr-2',
        title: this.$t('VPIH.GOLD'),
      },
    ];
    if (curIncomeTypeValue === 'VTOKEN') {
      return [list[0]];
    } else if (curIncomeTypeValue === 'GOLD') {
      return [list[1]];
    } else {
      return list;
    }
  }

  curIncomeDetailTypeForSummary: API.IncomeDetailPageAO['incomeDetailType'];
  tryUpdateIncomeDetailSummary() {
    const curFilterDataStr = this.curFilterDataStr;
    if (this._lastSummaryFilterDataStr === curFilterDataStr) {
      return;
    }
    // console.log('[DEBUG] summary', { ...this.curFilterData }, curFilterDataStr);
    this._lastSummaryFilterDataStr = curFilterDataStr;
    const curFilterData = this.curFilterData;
    this.curIncomeDetailTypeForSummary = curFilterData.incomeDetailType;
    incomeDetailSummaryGameInviteController(curFilterData).then((res) => {
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
