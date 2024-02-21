<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative w-80 p-2 pt-3 pb-6 bg-gradient-to-b from-[#AA76F1] to-[#8153DD] text-[#333333] rounded-xl"
        >
          <button
            class="absolute right-1 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            @click="onCloseClicked"
            v-webp="require('@/assets/vcommon/close/btnSimpleClose.png?webp')"
          ></button>
          <h3 class="robot-medium text-base mb-1 text-white flex items-center">
            {{ $t('VGW.confirmWithdrawalOrder') }}
          </h3>
          <main class="rounded-xl bg-[#FFFFFF] p-3 pt-7 text-[14px]">
            <div
              v-for="(item, idx) in infoList"
              :key="idx"
              class="py-1 flex items-center"
            >
              <div class="mr-1">{{ item.title }}:</div>
              <div class="robot-bold">{{ item.txt }}</div>
            </div>
            <button
              class="vbutton font-rubik w-full h-12 mb-2 active:scale-95 mt-2"
              @click="onConfirmClick"
            >
              {{ $t('VGW.confirmWithdrawal') }}
            </button>
          </main>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import type { IWithdrawType } from './controller/VGoldWithdraw.state';
import { Prop } from 'vue-property-decorator';
import { formatVGold, formatVRp } from '@/modules/vFormatter';
import { Toast } from 'vant';
import { createWithdrawalGoldV3WithdrawalController } from '@/vservices/client/WithdrawalController';
import { notifyWithdrawaled } from '@/js_bridge/js_call_app_base';
export type IConfirmOrderInfo = {
  accountInfo: API.WithdrawalForAccountViewVO;
  realExchangeCoinNum: number;
  serviceFeeNum: number;
  estimatedArrival: number;
  activityType: API.CreateWithdrawalV3AO['activityType'];
  withdrawType: IWithdrawType;

  originWithdrawType: IWithdrawType;
};
@Component({
  components: {},
})
export default class VGoldWithdrawConfirmDlg extends mixins(PopupMixin) {
  @Prop({
    type: Object,
    required: false,
  })
  orderInfo: IConfirmOrderInfo;

  /**
   *
   */
  @Prop({
    type: String,
    required: false,
  })
  from: string;

  //#region Dlg Basic Setting

  // remove if not used
  // @Watch('value')
  // onValueChange(isShow: boolean) {
  //   if (isShow) {
  //
  //     // this.$trace('address_book_writeauth_exposure', {
  //     //   open_type: from,
  //     // });
  //   }
  // }
  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_game_tarikdana_order', this.traceParam);

    this.emitDlgVisible(false);
  }
  //#endregion

  get traceParam() {
    const info = this.orderInfo;
    if (!info) {
      return {
        open_source: this.from,
      };
    }
    return {
      withdrawal_type: info.originWithdrawType,
      choosedWithdrawType: info.withdrawType,
      real_coins: info.realExchangeCoinNum,
      commission: (info.serviceFeeNum ?? '') + '',
      get_coins: (info.estimatedArrival ?? '') + '',
      channel: info.accountInfo.type,
      open_source: this.from,
      account_number: info.accountInfo.channelNumber,
      activity_type: info.activityType || '',
    };
  }

  get infoList() {
    const orderInfo = this.orderInfo;
    return [
      {
        title: this.$t('VGW.withdrawalAmount'), //
        txt: orderInfo ? formatVGold(orderInfo.realExchangeCoinNum) : '',
      },
      {
        title: this.$t('VGW.serviceFee'), //
        txt: orderInfo ? formatVGold(orderInfo.serviceFeeNum) : '',
      },
      {
        title: this.$t('VGW.arrivalAmount'), //
        txt: orderInfo ? formatVRp(orderInfo.estimatedArrival) : '',
      },
      {
        title: this.$t('VGW.channel'), //
        txt: orderInfo?.accountInfo?.name || '',
      },
      {
        title: this.$t('VGW.account'), //
        txt: orderInfo?.accountInfo?.channelNumber || '',
      },
    ];
  }

  async onConfirmClick() {
    if (!ButtonLockController.Instance.tryGetLock('confirmW', 0.5)) {
      return;
    }
    const info = this.orderInfo;
    const traceParam = this.traceParam;
    this.$tracev('click_game_tarikdana_order', traceParam);
    const activityType = info.activityType;
    const res = await createWithdrawalGoldV3WithdrawalController({
      withdrawalAmount: info.realExchangeCoinNum + '',
      // toAmount: info.estimatedArrival,
      // fee: info.serviceFeeNum,
      channel: info.accountInfo.type as API.CreateWithdrawalV3AO['channel'],
      withdrawType: info.withdrawType,
      countryCode: info.accountInfo.countryCode,
      channelNumber: info.accountInfo.channelNumber,
      source: this.from,
      activityType: activityType ? activityType : undefined,
    });
    this.$tracev('game_tarikdana_order_result', {
      ...traceParam,
      order_result: res.success ? '1' : '0',
    });
    if (res.success) {
      this.$emit('success', {
        realNum: Number(res.data),
      });
      notifyWithdrawaled({
        type: info.withdrawType,
        price: info.realExchangeCoinNum + '',
      });
      this.emitDlgVisible(false);
    } else {
      this.$emit('fail', {
        ...res,
        data: info.realExchangeCoinNum + '',
      });
      Toast(res.message);
    }
  }
}
</script>
