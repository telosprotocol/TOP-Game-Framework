<template>
  <article class="py-4 px-3 bg-white rounded-md">
    <!-- Gold -->
    <section class="bg-[#F6F2FC] rounded-md px-4 py-2 font-medium">
      <div class="flex items-center mb-1">
        <div class="px-0.5">{{ $t('VGW.coin') }}</div>
      </div>
      <div class="flex items-center">
        <div
          class="shrink-0 w-7 h-7 box-content bg-contain bg-center bg-no-repeat mr-0.5"
          v-webp="require('@/assets/vcommon/CoinGold.png?webp')"
        ></div>
        <van-popover
          v-if="isLogined"
          theme="dark van-popover--purplebordered van-popover--bordered"
          v-model="showCoinSplitPopover"
          placement="top"
          trigger="click"
        >
          <div class="p-2 max-w-[160px]">
            <div>{{ $t('V.Bonus') }}: {{ goldInfo.bonusGold }}</div>
            <div>{{ $t('V.Cash') }}: {{ goldInfo.cashGold }}</div>
          </div>
          <template #reference>
            <div class="font-din-bold text-xl underline leading-normal pr-1">
              {{ txtTotalGold }}
            </div>
          </template>
        </van-popover>
        <div v-else class="font-din-bold text-xl leading-normal pr-1">
          {{ txtTotalGold }}
        </div>
        <div class="font-din-bold text-[14px] leading-[none] pt-0.5">
          ={{ txtTotalGoldRp }} IDR
        </div>
      </div>
    </section>
    <!-- AableGold -->
    <section
      v-if="showAvailable"
      class="mt-2 bg-[#F6F2FC] rounded-md text-[#333] px-4 py-2 font-medium"
    >
      <div class="flex items-center mb-1">
        <div class="px-0.5">{{ $t('VGW.ableCoin') }}</div>
        <van-popover
          v-model="showCoinTipPopover"
          placement="top"
          theme="dark van-popover--purplebordered van-popover--bordered"
          trigger="click"
        >
          <div class="p-2 max-w-[160px]">
            {{
              $t('VGW.ableCoinTip', {
                cash: gameMultiple,
                bonus: bonusGameMultiple,
              })
            }}
          </div>
          <template #reference>
            <ib
              class="iconfont icon-question-outline text-[1.2em] text-[#9567D1]"
              type="primary"
            ></ib>
          </template>
        </van-popover>
      </div>
      <div class="flex items-center mb-0.5">
        <div
          class="shrink-0 w-7 h-7 box-content bg-contain bg-center bg-no-repeat mr-0.5"
          v-webp="require('@/assets/vcommon/CoinGold.png?webp')"
        ></div>

        <van-popover
          v-if="isLogined"
          theme="dark van-popover--purplebordered van-popover--bordered"
          v-model="showCoinSplitPopover2"
          placement="top"
          trigger="click"
        >
          <div class="p-2 max-w-[160px]">
            <div>{{ $t('V.Bonus') }}: {{ withdrawableInfo.bonusGold }}</div>
            <div>{{ $t('V.Cash') }}: {{ withdrawableInfo.cashGold }}</div>
          </div>
          <template #reference>
            <div class="font-din-bold text-xl leading-normal underline">
              {{ txtWithdrawalAbleGold }}
            </div>
          </template>
        </van-popover>
        <div v-else class="font-din-bold text-xl leading-normal pr-1">
          {{ txtWithdrawalAbleGold }}
        </div>
        <ib
          @click="onRefreshClick"
          :class="{ 'animate-twSpin': isRefreshing || isAnimating }"
          class="iconfont icon-refresh ml-1 text-[#9567D1] transition-transform animate-infinite"
        ></ib>
      </div>
      <div class="text-[#F93B0B] text-xs">
        {{ $t('VGW.resetToZeroAfterDone') }}
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VCoinPriceInfoMixin } from '@/modules/VAssetInfo/VCoinPriceInfo.state';
import {
  VGoldWithdrawInfoMixin,
  VGoldWithdrawInfoVO,
} from './controller/VGoldWithdraw.state';
import { formatVGold, formatVRp } from '@/modules/vFormatter';
import { Popover } from 'vant';
import { Prop } from 'vue-property-decorator';
import ButtonLockController from '@/controller/ButtonLockController';
@Component({
  components: {
    'van-popover': Popover,
  },
})
export default class VGoldWithdrawInfoBlock extends mixins(
  VCoinPriceInfoMixin,
  VGoldWithdrawInfoMixin
) {
  showCoinTipPopover = false;

  @Prop({
    type: Boolean,
  })
  showAvailable?: boolean;

  @Prop({
    type: Object,
    required: false,
  })
  GoldWithdrawInfo: Pick<
    VGoldWithdrawInfoVO,
    | 'gameMultiple'
    | 'bonusGameMultiple'
    | 'totalGold'
    | 'totalCashGold'
    | 'totalBonusGold'
    | 'withdrawalAbleCashGold'
    | 'withdrawalAbleBonusGold'
    | 'withdrawalAbleGold'
  >;

  get gameMultiple() {
    const gameMultiple = this.GoldWithdrawInfo?.gameMultiple;
    if (gameMultiple == null) {
      return '-';
    }
    return gameMultiple;
  }
  get bonusGameMultiple() {
    const bonusGameMultiple = this.GoldWithdrawInfo?.bonusGameMultiple;
    if (bonusGameMultiple == null) {
      return '-';
    }
    return bonusGameMultiple;
  }

  isLogined() {
    return this.$ss.getters['user/isRealLogined'];
  }
  //
  get txtTotalGold() {
    const totalGold = this.GoldWithdrawInfo?.totalGold;
    return formatVGold(totalGold ? Number(totalGold) : 0);
  }

  showCoinSplitPopover = false;
  get goldInfo() {
    const info = this.GoldWithdrawInfo;
    if (!info) {
      return {};
    }
    return {
      cashGold: formatVGold(Number(info.totalCashGold)),
      bonusGold: formatVGold(Number(info.totalBonusGold)),
    };
  }

  showCoinSplitPopover2 = false;
  get withdrawableInfo() {
    const info = this.GoldWithdrawInfo;
    if (!info) {
      return {};
    }
    return {
      cashGold: formatVGold(Number(info.withdrawalAbleCashGold)),
      bonusGold: formatVGold(Number(info.withdrawalAbleBonusGold)),
    };
  }

  get txtTotalGoldRp() {
    const rpToGold = this.CoinPriceInfo?.rpToGold;
    const totalGold = this.GoldWithdrawInfo?.totalGold;
    if (rpToGold == null || totalGold == null) {
      return '-';
    }
    const num = Number(totalGold) / Number(rpToGold);
    return formatVRp(num);
  }

  get txtWithdrawalAbleGold() {
    const withdrawalAbleGold = this.GoldWithdrawInfo?.withdrawalAbleGold;
    if (!withdrawalAbleGold) {
      return '';
    } else {
      return formatVGold(Number(withdrawalAbleGold));
    }
  }

  isRefreshing = false;
  isAnimating = false;
  lastAnimtateStartDt: number;
  onRefreshClick() {
    if (!ButtonLockController.Instance.tryGetLock('refresh', 0.5)) {
      return;
    }
    this.isRefreshing = true;
    this.isAnimating = true;
    this.lastAnimtateStartDt = Date.now();
    this.refreshVGoldWithdrawInfo(1).then(() => {
      this.isRefreshing = false;
      const leftDt = 1000 - ((Date.now() - this.lastAnimtateStartDt) % 1000);
      if (leftDt) {
        setTimeout(() => {
          this.isAnimating = false;
        }, leftDt);
      }
    });
  }
}
</script>
