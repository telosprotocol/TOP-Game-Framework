<template>
  <div class="text-[#333] text-sm leading-none" v-show="isActive">
    <GoldWithdrawMarqueue
      class="mb-2"
      :is-active="isActive"
    ></GoldWithdrawMarqueue>
    <VQueueItemBlock
      v-if="hasQueueItem"
      class="mb-4"
      @click.native="onOpenQueueDlg"
    ></VQueueItemBlock>
    <VGoldWithdrawInfoBlock
      :show-available="
        curChoosedWithdrawType !== 'SMALL_WITHDRAW' &&
        isLogined &&
        curChoosedWithdrawType !== 'ACTIVITY'
      "
      :gold-withdraw-info="GoldWithdrawInfo"
      class="mb-2"
    ></VGoldWithdrawInfoBlock>
    <VGoldWithdrawSuggestInputBlock
      v-model="txtExchangCoinCount"
      class="mb-2"
      v-if="curWithdrawType === 'SMALL_WITHDRAW'"
      @update:withdrawType="curChoosedWithdrawTypeValue = $event"
    >
    </VGoldWithdrawSuggestInputBlock>

    <article class="py-4 px-3 bg-white rounded-md">
      <!-- CoinAmountInput -->
      <section v-if="curWithdrawType !== 'SMALL_WITHDRAW'" class="mb-4">
        <h3 class="robot-medium mb-2">{{ $t('VGW.withdrawalAmount') }}</h3>
        <section>
          <div class="flex items-center justify-between mb-2">
            <input
              :value="txtExchangCoinCount"
              type="number"
              @input="onNumChange"
              @change="onNumChange"
              class="flex-1 box-content border border-solid border-[#9567D1] rounded-md mr-2.5 leading-12 h-4 leading-4 py-3 items-center px-4 vplaceholder text-lg robot-bold disabled:bg-[#F6F1FD] disabled:border-[#F6F1FD] disabled:text-[#78767A] disabled:text-sm"
              :disabled="curChoosedWithdrawType === 'ACTIVITY'"
              :style="
                $ss.getters.designPxsObjToReal({
                  '--tz-v-placeholder-color': '#CAB3E8',
                  '--tz-v-placeholder-size': 14,
                  '--tz-v-placeholder-weight': '400',
                })
              "
              :placeholder="$t('VGW.enterWithdrawalCoins')"
            />
            <div
              class="font-don-bold text-xl"
              v-if="curChoosedWithdrawType !== 'ACTIVITY'"
            >
              K
            </div>
          </div>
          <div
            class="font-din-bold text-xl text-[#9567D1]"
            v-if="txtRealRpCount && curChoosedWithdrawType !== 'ACTIVITY'"
          >
            ={{ txtRealRpCount }}
          </div>
        </section>
        <!-- LimitLeftTimeBlock -->
        <div
          v-if="
            GoldWithdrawInfo &&
            GoldWithdrawInfo.payLimitWithdrwaInfoVO &&
            curChoosedWithdrawType === 'LIMIT_WITHDRAW'
          "
          class="bg-[#FFF0F0] border border-[#FFCFCF] p-2 rounded-md mt-3 relative text-[13px] text-[#333] leading-4"
        >
          <div
            class="w-2 h-2 rotate-45 bg-[#FFF0F0] border-t border-l absolute -top-1 left-5 border-[#FFCFCF]"
          ></div>
          <i18n tag="div" path="VGW.withdrawalCondition">
            <span class="font-black"
              >{{
                $ss.getters.formatFloat(
                  Number(GoldWithdrawInfo.payLimitWithdrwaInfoVO.limitAmount)
                )
              }}
            </span>
            <span class="font-black">{{
              $ss.getters.formatFloat(Number(GoldWithdrawInfo.minAmount))
            }}</span>
            <VCountDownShort
              v-if="limitClientEndTime"
              class="font-black text-[#F93B0B]"
              @countdownEnd="onLeftTimeout"
              :show-second="true"
              :client-end-time="limitClientEndTime"
            ></VCountDownShort>
          </i18n>
        </div>
      </section>
      <VWithdrawTaskBlockForLimit
        class="mb-4"
        ref="taskBlockLimit"
        v-if="curChoosedWithdrawType === 'LIMIT_WITHDRAW' && isLogined"
      ></VWithdrawTaskBlockForLimit>
      <VSelectableAccountBlock
        ref="accountBlock"
        :withdraw-type="curChoosedWithdrawType"
        :open-source="queryFrom"
        :raw-account-list="rawAccountList"
        :pay-auto-withdraw-info="
          GoldWithdrawInfo ? GoldWithdrawInfo.payAutoWithdrawInfo : null
        "
        class="mb-4"
      ></VSelectableAccountBlock>
      <section class="robot-medium mb-6">
        <div class="mb-2 robot-medium">
          {{ $t('VGW.serviceFee') }}：{{
            serviceFeeInfo ? serviceFeeInfo.txtServiceFee : ''
          }}
        </div>
        <div class="text-base robot-bold">
          {{ $t('VGW.estimatedArrival') }}:
          <span>{{ txtEstimatedArrival }} IDR</span>
        </div>
      </section>
      <button
        class="vbutton font-rubik w-full h-12 active:scale-95 mb-3"
        @click="onConfirmWithdrawClick"
        :disabled="!isConfirmWithdrawable"
      >
        {{ $t('VGW.confirmWithdrawal') }}
      </button>
    </article>
    <portal to="modal">
      <VGoldWithdrawConfirmDlg
        v-model="isConfirmDlgOpened"
        :from="queryFrom"
        :order-info="confirmOrderInfo"
        @success="onDrawableSuccess"
        @fail="onDrawableFail"
      ></VGoldWithdrawConfirmDlg>
      <VGoldWithdrawOKDlg
        v-model="isOKDlgOpened"
        @close="onOkClose"
      ></VGoldWithdrawOKDlg>
      <VGoldWithdrawOKDlgForSmall
        v-model="isOKDlgOpenedForSmall"
        :real-draw-num="realDrawedNum"
        @close="onOkClose"
        :from="queryFrom"
      ></VGoldWithdrawOKDlgForSmall>
      <VWithdrawQueueDlg
        v-model="isQueueDlgOpened"
        @update="onQueueUpdated"
      ></VWithdrawQueueDlg>
      <VGoldWithdrawErrorDlg
        v-model="errDlg.isOpened"
        :msg="errDlg.msg"
        :btn-text="errDlg.btnText"
        :deal-close="errDlg.dealClose"
      ></VGoldWithdrawErrorDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VGoldWithdrawInfoMixin } from './controller/VGoldWithdraw.state';
import { trim, noop } from 'lodash-es';
import { tryMergeLocalesForVPrjGoldWithdraw } from '@/locales/Page/VPrj/VGW/init';
import VSelectableAccountBlock from './VSelectableAccountBlock.vue';
import { VCoinPriceInfoMixin } from '@/modules/VAssetInfo/VCoinPriceInfo.state';
import VGoldWithdrawConfirmDlg, {
  IConfirmOrderInfo,
} from './VGoldWithdrawConfirmDlg.vue';
import VGoldWithdrawOKDlg from './VGoldWithdrawOKDlg.vue';
import { checkAndForceUpdate } from '@/utils/dom/input';
import VGoldWithdrawInfoBlock from './VGoldWithdrawInfoBlock.vue';
import { Toast } from 'vant';
import ButtonLockController from '@/controller/ButtonLockController';
import { getFirstString } from '@/utils/string';
import VGoldWithdrawOKDlgForSmall from './VGoldWithdrawOKDlgForSmall.vue';
import { Prop, Watch } from 'vue-property-decorator';
import type { IWithdrawType } from './controller/VGoldWithdraw.state';
import VWithdrawTaskBlockForLimit from './VWithdrawTaskBlockForLimit.vue';
import VCountDownShort from './VCountDownShort.vue';
import VWithdrawQueueDlg from './VWithdrawQueueDlg.vue';
import VQueueItemBlock from './VQueueItemBlock.vue';
import stateItemVWithdrawQueue from './controller/WithdrawQueue.state';
import { onGBus } from '@/utils/GBus';
import VGoldWithdrawErrorDlg from './VGoldWithdrawErrorDlg.vue';
import { ROUTENAME_INAPP_V_GOLDWITHDRAW } from '../../constants/localRoutePath';
import { waitUserIsLoginedAuth } from '../../store/modules/user.utils';
import type { VGoldWithdrawInfoVO } from '@/modules/VGoldWithdraw/controller/VGoldWithdraw.state';
import {
  navigation_login_bridge,
  close_bridge,
} from '../../js_bridge/js_call_app_base';
import { BannerOpType } from '@/constants/BannerOpType';
import { getGoldWithdrawUrl, IGoldWithdrawFrom } from '../vRedirect';
import VGoldWithdrawSuggestInputBlock from './VGoldWithdrawSuggestInputBlock.vue';
import { getClientTimestampByAsyncStateItemRef } from '@/controller/AsyncStateItem';
import TimeCountDown from '../../components/CountDownTimer/TimeCountDown.vue';
import { VGoldWithdrawWeekRechargeMixin } from './controller/VGoldWithdrawByActivity.state';
import GoldWithdrawMarqueue from './GoldWithdrawMarqueue.vue';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';

function normalizeCoinCount(str: string) {
  let newValue = trim(str).replace(/[^0-9]/gi, '');
  if (newValue.length > 13) {
    //      16 +3 K
    newValue = newValue.substring(0, 13);
  }
  return newValue;
}
tryMergeLocalesForVPrjGoldWithdraw();
@Component({
  components: {
    VGoldWithdrawInfoBlock,
    VSelectableAccountBlock,
    VGoldWithdrawConfirmDlg,
    VGoldWithdrawOKDlg,
    VGoldWithdrawOKDlgForSmall,
    VWithdrawTaskBlockForLimit,
    VCountDownShort,
    VWithdrawQueueDlg,
    VQueueItemBlock,
    VGoldWithdrawErrorDlg,
    TimeCountDown,
    VGoldWithdrawSuggestInputBlock,
    GoldWithdrawMarqueue,
  },
})
export default class VGoldWithdraw extends mixins(
  BindEventMixinDefault,
  VGoldWithdrawInfoMixin,
  VGoldWithdrawWeekRechargeMixin,
  VCoinPriceInfoMixin
) {
  $refs: {
    accountBlock: VSelectableAccountBlock;
    taskBlockLimit: VWithdrawTaskBlockForLimit;
  };

  @Prop({
    type: Boolean,
    required: false,
  })
  isActive: boolean;

  showCoinTipPopover = false;

  useInited() {
    this.refreshCurGoldWithdrawInfo().then((res) => {
      if (res.ok) {
        if (this.withdrawQueueUserVO) {
          //
          this.isQueueDlgOpened = true;
        }
      } else {
        Toast(res.error.message);
      }
    });
    this.refreshVCoinPriceInfo();
    return onGBus('onVUserRechargeGameGold', () => {
      this.refreshCurGoldWithdrawInfo(10);
    });
  }

  get activityType() {
    return getFirstString(this.$route.query.activityType) || '';
  }

  get GoldWithdrawInfo() {
    const activityType = this.activityType;
    if (activityType === 'WEEK_RECHARGE') {
      return this.VGoldWithdrawWeekRecharge;
    } else {
      return this.GoldWithdrawInfoNormal;
    }
  }
  get sGoldWithdrawInfo() {
    return this.GoldWithdrawInfo || ({} as Partial<VGoldWithdrawInfoVO>);
  }
  refreshCurGoldWithdrawInfo(timeout?: number) {
    const activityType = this.activityType;
    if (activityType === 'WEEK_RECHARGE') {
      return this.refreshVGoldWithdrawWeekRecharge(timeout);
    } else {
      return this.refreshVGoldWithdrawInfo(timeout);
    }
  }
  //#region

  /**
   *           (            ！！！)
   */
  curWithdrawType: IWithdrawType = 'NORMAL';

  curChoosedWithdrawTypeValue: IWithdrawType | null = null;
  get curChoosedWithdrawType() {
    if (!this.curChoosedWithdrawTypeValue) {
      return this.curWithdrawType;
    }
    return this.curChoosedWithdrawTypeValue;
  }

  @Watch('GoldWithdrawInfo.withdrawType')
  onServerWithdrawType(withdrawType: IWithdrawType) {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[Withdraw] ServerWithdrawChange', withdrawType);
    }
    this.curWithdrawType = withdrawType;
    this.curChoosedWithdrawTypeValue = null;
    if (withdrawType === 'SMALL_WITHDRAW') {
      this.txtExchangCoinCount =
        this.sGoldWithdrawInfo.payAutoWithdrawInfo
          .withdrawTypeAndAmountList?.[0]?.amount || '';
    } else if (withdrawType === 'ACTIVITY') {
      this.txtExchangCoinCount =
        this.sGoldWithdrawInfo.payAutoWithdrawInfo.limitAmount;
    }
  }
  //#endregion

  //#region

  get limitClientEndTime() {
    const limitTimeStamp =
      this.GoldWithdrawInfo?.payLimitWithdrwaInfoVO?.limitTimeStamp;

    return getClientTimestampByAsyncStateItemRef(
      limitTimeStamp,
      this.stateItemVGoldWithdrawInfoRef
    );
  }

  onLeftTimeout() {
    this.refreshCurGoldWithdrawInfo(10);
  }
  //#endregion

  //#region
  get withdrawQueueUserVO() {
    return this.GoldWithdrawInfo?.withdrawQueueUserVO;
  }

  @Watch('withdrawQueueUserVO')
  onQueueChange(withdrawQueueUserVO: API.WithdrawQueueUserVO) {
    stateItemVWithdrawQueue.setSuccessResult(withdrawQueueUserVO);
  }
  isQueueDlgOpened = false; //process.env.VUE_APP_ENV_NAME2 === 'sim';

  onOpenQueueDlg() {
    this.$trace('click_line_up_withdrawal');
    this.isQueueDlgOpened = true;
  }

  get hasQueueItem() {
    return this.withdrawQueueUserVO;
  }

  onQueueUpdated() {
    this.refreshCurGoldWithdrawInfo(10);
    this.$emit('withdrawCancel');
  }
  //#endregion

  //#region  guest
  get isLogined() {
    return this.$ss.state.user.isLogined;
  }

  @Watch('isLogined')
  onIsLoginedChange(isLogined: boolean) {
    const GoldWithdrawInfo = this.GoldWithdrawInfo;
    if (!GoldWithdrawInfo) {
      return;
    }
    if (isLogined) {
      this.refreshCurGoldWithdrawInfo(0);
    }
  }
  lastGuestWithdrawPrecondWait: Promise<IHttpResponse<VGoldWithdrawInfoVO>>;

  get rawAccountList() {
    const list = this.GoldWithdrawInfo?.account || [];
    return list;
  }
  //#endregion

  //#region
  txtExchangCoinCount = '';

  validNumForRatioNum() {
    const curValue = this.txtExchangCoinCount;
    const GoldWithdrawInfo = this.GoldWithdrawInfo;
    const withdrawType = GoldWithdrawInfo?.withdrawType;
    if (
      curValue &&
      (withdrawType === 'NORMAL' || withdrawType === 'QUEUE_WITHDRAW') &&
      GoldWithdrawInfo?.multipleRadix
    ) {
      //   ，
      const curNum = Number(curValue);
      const multipleRadix = Number(GoldWithdrawInfo.multipleRadix) / 1000;
      if (multipleRadix > 0) {
        if (curNum < multipleRadix) {
          this.txtExchangCoinCount = multipleRadix + '';
        } else {
          const ratio = Math.floor(curNum / multipleRadix);
          this.txtExchangCoinCount = multipleRadix * ratio + '';
        }
      }
    }
  }

  onNumChange(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value || '';
    const preValue = this.txtExchangCoinCount;
    let newValue = normalizeCoinCount(inputValue);
    this.txtExchangCoinCount = newValue;
    if (e.type === 'change') {
      this.validNumForRatioNum();
    }
    checkAndForceUpdate(this, {
      preValue,
      newValue,
      inputValue,
    });
  }

  //#endregion

  //#region realWithdrawAmount
  /**
   * RealExchangeNum from input
   */
  get realExchangeCoinNum() {
    const txtExchangCoinCount = this.txtExchangCoinCount;
    if (!txtExchangCoinCount) {
      return null;
    }
    const zoom =
      this.curWithdrawType === 'SMALL_WITHDRAW' ||
      this.curChoosedWithdrawType === 'ACTIVITY'
        ? 1
        : 1000;
    const num = Number(txtExchangCoinCount) * zoom;
    return num;
  }
  /**
   * realExchangeNum from input
   */
  get txtRealRpCount() {
    const realExchangeCoinNum = this.realExchangeCoinNum;
    if (realExchangeCoinNum == null) {
      return '';
    }
    return this.$ss.getters.formatFloat(realExchangeCoinNum, { precision: 0 });
  }
  //#endregion

  //#region

  get txtEstimatedArrival() {
    const serviceFeeInfo = this.serviceFeeInfo;
    if (!serviceFeeInfo) {
      return '';
    }
    return this.$ss.getters.formatFloat(serviceFeeInfo.estimatedArrival);
  }

  get serviceFeeInfo() {
    const GoldWithdrawInfo = this.GoldWithdrawInfo;
    const CoinPriceInfo = this.CoinPriceInfo;
    // const exchangeCoinCount = this.realExchangeCoinNum;
    if (!GoldWithdrawInfo || !CoinPriceInfo) {
      return null;
    }
    //         Rp
    const exchangeCoinToRp =
      this.realExchangeCoinNum / Number(CoinPriceInfo.rpToGold);
    if (
      this.curChoosedWithdrawType === 'SMALL_WITHDRAW' ||
      this.curChoosedWithdrawType === 'ACTIVITY'
    ) {
      const serviceFeeNum = 0;
      return {
        //    -
        serviceFeeNum,
        //    -  +
        txtServiceFee: `0`, //(${this.$t('VGW.firstDiscount')})
        //
        estimatedArrival: exchangeCoinToRp,
      };
    }
    const feeInfo = GoldWithdrawInfo.fee;
    //    ratio
    const ratio = Number(feeInfo.ratio);
    const serviceFeeNum = exchangeCoinToRp * ratio + Number(feeInfo.fixedFee);
    const txtServiceFee = `${this.$ss.getters.formatFloat(
      serviceFeeNum
    )} IDR (${(ratio * 100).toFixed(2)}% + ${this.$ss.getters.formatFloat(
      Number(feeInfo.fixedFee)
    )} IDR)`;
    const estimatedArrival = exchangeCoinToRp - serviceFeeNum;

    return {
      //    -
      serviceFeeNum,
      //    -  +
      txtServiceFee,
      //
      estimatedArrival,
    };
  }
  //#endregion

  //#region
  isConfirmDlgOpened = false;
  confirmOrderInfo: IConfirmOrderInfo = null;
  /**
   *
   */
  get queryFrom() {
    return getFirstString(this.$route.query.from) || '';
  }

  get isConfirmWithdrawable() {
    const isAble = this.txtExchangCoinCount.length > 0;

    if (isAble) {
      if (this.curWithdrawType === 'SMALL_WITHDRAW') {
        return true;
      } else {
        if (this.curChoosedWithdrawType === 'LIMIT_WITHDRAW') {
          const taskBlockLimit = this.$refs.taskBlockLimit;
          if (taskBlockLimit && !taskBlockLimit.isTaskWithdrawOK) {
            return false;
          }
        }
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   *
   */
  async onConfirmWithdrawClick() {
    if (!ButtonLockController.Instance.tryGetLock('confirm')) {
      return;
    }
    this.validNumForRatioNum();

    const curAccountItem = this.$refs.accountBlock.curAccountItem;
    const serviceFeeInfo = this.serviceFeeInfo;
    const traceInfo = {
      withdrawal_type: this.curWithdrawType,
      activity_type: this.activityType || '',
      choosedWithdrawType: this.curChoosedWithdrawType,
      apply_type: curAccountItem?.type,
      apply_name: curAccountItem?.name,
      open_source: this.queryFrom,
      apply_coins: this.realExchangeCoinNum + '', //
      commission: (serviceFeeInfo?.serviceFeeNum ?? '') + '',
      get_coins: (serviceFeeInfo?.estimatedArrival ?? '') + '',
    };
    const clickEventName = 'click_game_tarikdana_apply';
    const isContinueErrCode = await this.checkCanWithdraw();
    if (isContinueErrCode != 0) {
      if (isContinueErrCode === 3) {
        this.$tracev(clickEventName, {
          ...traceInfo,
          withdrawal_condition: 'dana',
        });
      }
      return;
    }
    const isLogined = await waitUserIsLoginedAuth();
    if (!isLogined) {
      this.$tracev(clickEventName, {
        ...traceInfo,
        withdrawal_condition: 'google',
      });
      navigation_login_bridge(ROUTENAME_INAPP_V_GOLDWITHDRAW, {
        opType: BannerOpType.AppLink,
        //
        to: getGoldWithdrawUrl(this.queryFrom as IGoldWithdrawFrom),
      });
      return;
    }
    // openConfirmDlg
    this.$tracev(clickEventName, {
      ...traceInfo,
      withdrawal_condition: 'confirm',
    });
    this.isConfirmDlgOpened = true;

    this.confirmOrderInfo = {
      accountInfo: curAccountItem,
      activityType: this
        .activityType as API.CreateWithdrawalV3AO['activityType'],
      realExchangeCoinNum: this.realExchangeCoinNum,
      serviceFeeNum: serviceFeeInfo.serviceFeeNum,
      estimatedArrival: serviceFeeInfo.estimatedArrival,
      withdrawType: this.curChoosedWithdrawType,
      originWithdrawType: this.curWithdrawType,
    };
  }

  /**
   * @return errCode, 0  ，
   */
  async checkCanWithdraw() {
    if (!this.GoldWithdrawInfo) {
      await this.refreshCurGoldWithdrawInfo();
    }
    const GoldWithdrawInfo = this.GoldWithdrawInfo;
    if (!GoldWithdrawInfo) {
      return 1;
    }
    //
    if (!this.$refs.accountBlock.curAccountItem) {
      return 2; //
    }
    if (!this.$refs.accountBlock.curAccountItem.channelNumber) {
      //
      this.$refs.accountBlock.startBindCurAccount();
      return 3; //
    }
    if (this.curWithdrawType === 'SMALL_WITHDRAW') {
      return 0;
    } else {
      const minAmount =
        this.curWithdrawType === 'LIMIT_WITHDRAW'
          ? Number(GoldWithdrawInfo.payLimitWithdrwaInfoVO.limitAmount)
          : Number(GoldWithdrawInfo.minAmount);
      if (this.realExchangeCoinNum < minAmount) {
        Toast(this.$t('VGW.firstDiscountMinX', [minAmount / 1000]));
        return 4;
      }
      if (
        //  Rp-  Rp<0，
        Number(GoldWithdrawInfo.withdrawalAbleGold) -
          Number(this.serviceFeeInfo?.estimatedArrival) <
        0
      ) {
        Toast(this.$t('VGW.insufficientCash'));
        return 5;
      }
      return 0;
    }
  }

  /**
   *
   */
  onDrawableSuccess(info: { realNum: number }) {
    if (this.curWithdrawType === 'SMALL_WITHDRAW') {
      this.isOKDlgOpenedForSmall = true;
      this.realDrawedNum = info.realNum;
    } else {
      this.isOKDlgOpened = true;
    }
    this.txtExchangCoinCount = '';
    this.$emit('withdrawSuccess');
    updateRewardsByPropTypes('GOLD');
  }

  onDrawableFail(info: API.ObjectVOBigDecimal) {
    let msg = info.message;
    let btnText = this.$t('Base.IKnown');
    let dealClose = () => {
      this.onDlgCloseAndRefreshWithdrawInfo();
      setTimeout(() => {
        close_bridge();
      });
    };
    this.$trace('click_noviceguide_withdrawal_rewardprompt', {
      prompt_type: info.code + '',
    });
    if (info.code === 26006) {
      // has withdrawed
      msg = this.$t('VGW.smallErrRepeat', {
        money: 'Rp ' + info.data,
      }) as string;
      btnText = this.$t('VGW.joinNow');
    } else if (info.code === 28003) {
      // dana account bind limit
      msg = this.$t('VGW.smallErrDanaLimit', {
        money: 'Rp ' + info.data,
      }) as string;
    } else {
      dealClose = () => {
        this.onDlgCloseAndRefreshWithdrawInfo();
      };
    }

    this.errDlg.msg = msg;
    this.errDlg.isOpened = true;
    this.errDlg.btnText = btnText as string;
    this.errDlg.dealClose = dealClose;
  }

  onDlgCloseAndRefreshWithdrawInfo() {
    //
    this.refreshCurGoldWithdrawInfo(0);
  }

  onOkClose() {
    if (this.curChoosedWithdrawType === 'ACTIVITY') {
      close_bridge();
    } else {
      this.onDlgCloseAndRefreshWithdrawInfo();
    }
  }

  realDrawedNum = 300;
  isOKDlgOpened = false;
  isOKDlgOpenedForSmall = false;
  //#endregion

  //#region WithdrawError
  errDlg = {
    isOpened: false,
    msg: '',
    btnText: '',
    dealClose: noop,
  };

  //#endregion
}
</script>
