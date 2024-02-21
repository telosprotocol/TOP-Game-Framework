<template>
  <div>
    <div class="p-4 py-6 bg-white rounded-2xl relative mb-3">
      <!-- ToExchange -->
      <div class="mb-4">
        <div class="text-[#A874F0] robot-bold italic text-base leading-5 mb-2">
          {{ $t('VDE.wantToExchange') }}
        </div>
        <div
          class="bg-[#F6F1FD] h-[46px] flex items-center rounded-full text-[#333] robot-bold text-[14px] pl-4 pr-6"
        >
          <div
            class="shrink-0 w-6 h-6 bg-contain bg-center bg-no-repeat mr-1"
            v-webp="require('@/assets/vcommon/CoinVToken.png?webp')"
          ></div>
          <div>{{ $t('V.DST') }}</div>
          <input
            ref="input"
            class="flex-1 ml-5 text-right w-32 bg-[#F6F1FD]"
            v-model="txtUsableDst"
            type="number"
            :placeholder="maxTxtDst"
            @blur="onTxtDstBlur"
          />
        </div>
      </div>
      <div class="mb-3">
        <div class="robot-bold flex items-center justify-between mb-2">
          <div class="text-[#A874F0] robot-bold italic text-base leading-5">
            {{ $t('VDE.exchangeableCoins') }}
          </div>
          <div class="text-[#333] text-xs leading-none">
            {{ $t('V.xDST', [1]) }}={{ $t('V.xCoin', [txtNumDstToGold]) }}
          </div>
        </div>
        <div
          class="bg-[#F6F1FD] h-[46px] flex items-center rounded-full text-[#333] robot-bold text-[14px] pl-4 pr-6"
        >
          <div
            class="shrink-0 w-6 h-6 bg-contain bg-center bg-no-repeat mr-1"
            v-webp="require('@/assets/vcommon/CoinGold.png?webp')"
          ></div>
          <div>{{ $t('V.Coin') }}</div>
          <div class="flex-1 ml-5 text-right">{{ txtToCoins }}</div>
        </div>
      </div>
      <div class="flex items-center justify-between mb-4 text-xs">
        <i18n tag="div" class="text-[#EF545D]" path="VDE.currentLevelFee">{{
          txtCurLevelFee
        }}</i18n>
        <div class="text-[#A874F0] active:scale-95" @click="goToMyLevel">
          {{ $t('VDE.viewLevel') }}
        </div>
      </div>

      <button
        class="vbutton font-rubik w-full h-12"
        :class="{
          'active:scale-95': isExchangeable,
          'opacity-50': !isExchangeable,
        }"
        :style="{ filter: isExchangeable ? '' : 'grayscale(0.7)' }"
        @click="onExchangeNow"
      >
        {{ $t('VDE.exchangeNow') }}
      </button>
    </div>
    <div class="text-left text-[#777]">
      {{ limitDesc }}
    </div>
    <portal to="modal">
      <VRightToken2CoinExchangeOkDlg
        v-model="isToken2CoinExchangeOkOpened"
        :getted-coins="coinExchangeGetted"
        :exp-level-fee="coinExchangeLevelFee"
      ></VRightToken2CoinExchangeOkDlg>

      <VDSTExchangeConfirmDlg
        @ok="onExchangeConfirmed"
        @cancel="onExchangeCancel"
        v-model="isConfirmDlgOpened"
      ></VDSTExchangeConfirmDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { VCoinPriceInfoMixin } from '@/modules/VAssetInfo/VCoinPriceInfo.state';
import { formatVGold, formatVToken } from '@/modules/vFormatter';
import stateItemVRightWalletInfo, {
  VRightWalletInfoMixin,
} from '@/modules/RightWallet/RightWallet.state';
import { Watch } from 'vue-property-decorator';
import { Toast } from 'vant';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import { ROUTEPATH_V_RIGHTLEVEL } from '@/constants/localRoutePath';
import { formatFloatBase } from '@/utils/string';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import VRightToken2CoinExchangeOkDlg from './VRightToken2CoinExchangeOkDlg.vue';
import VDSTExchangeConfirmDlg from './VDSTExchangeConfirmDlg.vue';
import {
  exchangeGoldUserTokenLogController,
  usableUserTokenLogController,
} from '@/vservices/client/UserTokenLogController';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';
@Component({
  components: { VRightToken2CoinExchangeOkDlg, VDSTExchangeConfirmDlg },
})
export default class VDSTExchange extends mixins(
  VCoinPriceInfoMixin,
  VRightWalletInfoMixin,
  BindEventMixinDefault
) {
  useInited(_isMount: boolean) {
    this.txtUsableDst = '';
    this.refreshVCoinPriceInfo();
    this.refreshVRightWalletInfo();
    usableUserTokenLogController().then((res) => {
      if (res.success) {
        this.usableInfo = res.data;
        this.$refs.input?.focus();
        // this.usableDst = Number(res.data.amount);
      } else {
        Toast(res.message);
      }
    });

    return () => {};
  }
  $refs: {
    input: HTMLInputElement;
  };
  get limitDesc() {
    return this.$t('VDE.limitDesc', [
      this.usableInfo.dailyCountMaxLimit || '-',
      this.usableInfo.dailyAmountMaxLimit || '-',
    ]);
  }

  usableInfo: Partial<API.UserTokenUsableVO> = { amount: '' };

  get maxTxtDst() {
    const usableInfo = this.usableInfo;
    if (usableInfo.amount) {
      const numStr = formatVToken(Number(usableInfo.amount));
      return numStr;
    }
    return '';
  }
  //#region Dlg Basic Setting

  get txtCurLevelFee() {
    const RightWalletInfo = this.RightWalletInfo;
    if (RightWalletInfo) {
      return `${this.$ss.getters.formatFloat(
        Number(this.RightWalletInfo.expLevelFee) * 100,
        {
          reserveZeroDecimal: false,
        }
      )}%`;
    }
    return '-';
  }

  get numDstToGold() {
    const CoinPriceInfo = this.CoinPriceInfo;
    if (!CoinPriceInfo) {
      return null;
    }
    return Number(CoinPriceInfo.dstToRp) * Number(CoinPriceInfo.rpToGold);
  }

  get txtNumDstToGold() {
    const numDstToGold = this.numDstToGold;
    if (numDstToGold == null) {
      return '';
    }
    return formatVGold(numDstToGold);
  }
  //#endregion

  get dst2Gold() {
    const CoinPriceInfo = this.CoinPriceInfo;
    if (CoinPriceInfo == null) {
      return null;
    }
    return Number(CoinPriceInfo.dstToRp) * Number(CoinPriceInfo.rpToGold);
  }

  get numToCoins() {
    const usableDst = this.usableDst;
    const dst2Gold = this.dst2Gold;
    const RightWalletInfo = this.RightWalletInfo;
    if (dst2Gold == null || usableDst == null || !RightWalletInfo) {
      return null;
    }
    return (
      usableDst *
      (1 - Number(RightWalletInfo?.expLevelFee ?? 0)) *
      this.dst2Gold
    );
  }

  get txtToCoins() {
    const numToCoins = this.numToCoins;
    if (numToCoins == null) {
      return '';
    }
    return formatVGold(numToCoins);
  }

  // get txtDst() {
  //   const usableDst = this.usableDst;
  //   if (usableDst != null) {
  //     return formatVToken(usableDst);
  //   }
  //   return '';
  // }

  txtUsableDst = '';

  @Watch('txtUsableDst')
  onTxtUsableDstChanged(txtUsableDst: string) {
    if (!txtUsableDst) {
      this.txtUsableDst = '';
      return;
    }
    this.formatUsableDst(txtUsableDst);
    // //   
    // this.txtUsableDst = formatFloatBase(num, {
    //   precision: 6,
    //   reserveZeroDecimal: false,
    //   separator: '',
    //   decimalMark: '.',
    // });
  }

  formatUsableDst(txtUsableDst: string) {
    const num = Number(txtUsableDst);
    if (isNaN(num)) {
      this.txtUsableDst = '';
      return '';
    }
    const usableInfo = this.usableInfo;
    if (usableInfo && usableInfo.amount) {
      if (num > Number(usableInfo.amount)) {
        this.txtUsableDst = formatFloatBase(Number(usableInfo.amount), {
          precision: 6,
          reserveZeroDecimal: false,
          separator: '',
          decimalMark: '.',
        });
        return;
      }
    }
    const [intPart, pointPart] = txtUsableDst.split('.');
    if (pointPart && pointPart.length > 6) {
      this.txtUsableDst = `${intPart}.${pointPart.substring(0, 6)}`;
    }
  }
  onTxtDstBlur() {
    const txtUsableDst = this.txtUsableDst;
    if (!txtUsableDst) {
      return;
    }
    this.formatUsableDst(txtUsableDst);
  }

  get usableDst() {
    const txtUsableDst = this.txtUsableDst;
    const num = Number(txtUsableDst);
    if (isNaN(num)) {
      return null;
    }
    return num;
  }

  get isExchangeable() {
    const usableDst = this.usableDst;
    const dst2Gold = this.dst2Gold;
    const RightWalletInfo = this.RightWalletInfo;
    if (!RightWalletInfo) {
      return false;
    }
    if (!(usableDst > 0) || dst2Gold == null) {
      return false;
    }
    return true;
  }
  isConfirmDlgOpened = false;

  get traceParam() {
    const usableDst = this.usableDst;
    const goldAmount = this.numToCoins;
    const expLevelFee = this.RightWalletInfo?.expLevelFee;
    return {
      DST: usableDst,
      getted_coins: goldAmount,
      commission: expLevelFee,
    };
  }
  async onExchangeCancel() {
    this.$trace('click_dst_now_disagree_exchange', this.traceParam);
  }
  async onExchangeConfirmed() {
    if (!ButtonLockController.Instance.tryGetLock('exchangeOK', 0.5)) {
      return;
    }
    const usableDst = this.usableDst;
    const goldAmount = this.numToCoins;
    const expLevelFee = this.RightWalletInfo?.expLevelFee;
    const traceParam = this.traceParam;
    this.$trace('click_dst_now_agree_exchange', this.traceParam);
    const res = await exchangeGoldUserTokenLogController({
      dstAmount: usableDst,
      goldAmount: goldAmount,
    } as any);
    this.$trace('click_dst_now_exchange_result', {
      ...traceParam,
      exchange_result: res.success ? '1' : '0',
    });
    if (res.success) {
      this.isToken2CoinExchangeOkOpened = true;
      this.coinExchangeGetted = Number(res.data);
      this.coinExchangeLevelFee = expLevelFee;
      updateRewardsByPropTypes('GOLD');
    } else {
      Toast(res.message);
    }
    stateItemVRightWalletInfo.tryUpdate(0);
  }
  /**
   *  
   */
  async onExchangeNow() {
    if (!this.isExchangeable) {
      return;
    }
    this.$trace('click_dst_now_exchange', this.traceParam);
    if (!ButtonLockController.Instance.tryGetLock('confirm', 0.5)) {
      return;
    }
    this.isConfirmDlgOpened = true;
  }

  goToMyLevel() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_dst_exchange_exposure_detail');
    openAppH5LinkPreferLocal(ROUTEPATH_V_RIGHTLEVEL, {});
  }

  //#region  

  isToken2CoinExchangeOkOpened = false;
  coinExchangeGetted = 0;
  coinExchangeLevelFee = '';
  /**
   *  
   * @param num
   */
  onExchangeOK(result: { goldAmount: number; expLevelFee: string }) {
    this.isToken2CoinExchangeOkOpened = true;
    this.coinExchangeGetted = result.goldAmount;
    this.coinExchangeLevelFee = result.expLevelFee;
    updateRewardsByPropTypes('GOLD');
  }
  //#endregion
}
</script>
