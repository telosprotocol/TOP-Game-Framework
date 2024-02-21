<template>
  <div>
    <div
      class="bg-contain bg-center bg-no-repeat relative flex flex-col items-center"
      :style="
        $ss.getters.normalizeCss(
          { width: 544 / 2, height: 318 },
          require('@/assets/gameGrowth/month-bg.png?webp'),
          true
        )
      "
    >
      <h3
        class="font-rubik font-black italic text-2xl mt-3 bg-clip-text"
        :style="{
          backgroundImage:
            'linear-gradient(180deg, #FFF 36.05%, #FDFF7E 79.56%)',
          webkitTextFillColor: 'transparent',
          webkitTextStroke: '1px #881631',
        }"
      >
        {{ $t('VG.monthCard') }}
      </h3>
      <div class="text-base font-robot-medium font-medium">
        <div v-if="!leftDays" class="text-[#C50000]">
          {{ $t('VG.notActivated') }}
        </div>
        <div v-else class="flex items-center text-[#0EFFA8]">
          <div
            class="bg-contain bg-center bg-no-repeat"
            :style="
              $ss.getters.normalizeCss(
                { width: 25, height: 25, marginRight: 2 },
                require('@/assets/gameGrowth/ld.png')
              )
            "
          ></div>
          <div>
            {{ $tc('Base.xDays', leftDays, { n: leftDays }) }}
          </div>
        </div>
      </div>
      <div class="relative z-0 text-center mt-1">
        <div
          class="font-rubik font-bold text-sm italic vgradient-text-outline"
          v-for="(item, idx) in pList"
          :style="
            $ss.getters.normalizeCss({
              '--v-background':
                'linear-gradient(180deg, #FFE173 20.59%, #FDFCE8 31.77%, #FEFE3A 49.5%, #FF9C0A 70.59%)',
              '--v--shadow-from': '#B02620',
              '--v-shadow-y': 1,
              '--v-shadow-x': 0.5,
              lineHeight: 17,
              marginBottom: 3,
            })
          "
          :key="idx"
          :data-text="item"
        >
          {{ item }}
        </div>
      </div>
      <i18n
        path="VG.claimableDaily"
        class="text-white font-robot-medium font-medium mb-2"
        :style="$ss.getters.normalizeCss({ marginTop: 98 })"
      >
        <span class="text-[#F8E051]">{{ txtDailyNum }}</span>
      </i18n>
      <button
        @click="onCardBtnClick"
        class="vbtn vbtn--lg w-60 active:scale-95 whitespace-nowrap"
        :class="btnStatus.btnClass"
      >
        {{ btnStatus.btnText }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { getActivityPayForMultiPrice } from '@/constants/APP_SCHEMA_URLS';
import ButtonLockController from '@/controller/ButtonLockController';
import { updateRewardsByPropTypes } from '@/modules/VAssetInfo/VAsset.utils';
import { emitGBus } from '@/utils/GBus';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import { receiveRewardPayGiftController } from '@/vservices/client/PayGiftController';
import { Toast } from 'vant';
import Component, { mixins } from 'vue-class-component';
import { GrowthPlanMixin } from './GrowthPlanMixin.state';
@Component({
  components: {},
})
export default class GrowthPlanMonthTab extends mixins(GrowthPlanMixin) {
  refresh() {}

  get pList() {
    const coinNum = this.GrowthPlanInfo?.coinNum;
    const totalRp = coinNum
      ? this.$ss.getters.formatFloat(Number(coinNum))
      : '-';
    return [
      this.$t('VG.buyAndGet'),
      `· ${this.$t('Base.xRp', { n: ' ' + totalRp + ' ' })}`,
      '· ' + this.$t('VG.activateGrowth'),
    ];
  }

  get leftDays() {
    return this.GrowthPlanInfo?.leftDays;
  }

  get txtDailyNum() {
    const dailyAmount = this.GrowthPlanInfo?.payGiftReward?.rewardAmount;
    if (dailyAmount != null) {
      return this.$t('Base.xRp', {
        n: ' ' + this.$ss.getters.formatFloat(Number(dailyAmount)) + ' ',
      });
    } else {
      return '-';
    }
  }

  get btnStatus() {
    const GrowthPlanInfo = this.GrowthPlanInfo;
    if (this.leftDays === 0) {
      const totalNum = Number(GrowthPlanInfo.price);
      return {
        btnClass: 'vbtn--yellow',
        btnText: this.$t('Base.xRp', {
          n: isNaN(totalNum)
            ? ''
            : ' ' + this.$ss.getters.formatFloat(totalNum) + ' ',
        }),
      };
    }
    const rewardStatus = GrowthPlanInfo?.payGiftReward?.rewardStatus;
    if (rewardStatus === 'CAN_RECEIVE') {
      return {
        btnClass: 'vbtn--primary',
        btnText: this.$t('VG.claimRewards'),
      };
    } else {
      return {
        btnClass: 'vbtn--disable',
        btnText: this.$t('VG.comeBackTomorrow'),
      };
    }
  }

  async onCardBtnClick() {
    const GrowthPlanInfo = this.GrowthPlanInfo;
    if (!GrowthPlanInfo) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('month-card', 1)) {
      return;
    }
    const btnEventName = 'click_recharge_month_card_gift_button';
    if (this.leftDays === 0) {
      this.$tracev(btnEventName, {
        button_type: 'buy',
      });
      openAppH5LinkPreferLocal(
        getActivityPayForMultiPrice(
          GrowthPlanInfo.activityId,
          'GROWTH_PLAN_MONTH',
          GrowthPlanInfo.price
        ),
        {}
      );
      return;
    }
    const rewardStatus = GrowthPlanInfo.payGiftReward?.rewardStatus;
    if (rewardStatus === 'CAN_RECEIVE') {
      this.$tracev(btnEventName, {
        button_type: 'receive',
      });
      const res = await receiveRewardPayGiftController({
        activityId: GrowthPlanInfo.activityId,
        rewardId: GrowthPlanInfo.payGiftReward.rewardId,
      });
      if (res.success) {
        this.refreshGrowthPlan(0);
        emitGBus('openGameHallGetPropDlg', {
          propList: [
            {
              propNum: Number(GrowthPlanInfo.payGiftReward.rewardAmount),
              type: GrowthPlanInfo.payGiftReward.rewardType,
            },
          ],
        });
        updateRewardsByPropTypes('GOLD');
      } else {
        Toast(res.message);
      }
    } else {
      this.$emit('close');
    }
  }
}
</script>
@/constants/APP_SCHEMA_URLS
