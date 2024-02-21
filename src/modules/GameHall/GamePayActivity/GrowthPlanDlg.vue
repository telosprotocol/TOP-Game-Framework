<template>
  <GameWoodDlgUI
    :value="value"
    @input="emitDlgVisible"
    @close="$emit('close')"
    v-bind="$attrs"
    :img-title="
      $ss.getters.translateImage({
        en: require('@/assets/gameGrowth/grow-en.png'),
        id: require('@/assets/gameGrowth/grow-id.png'),
      })
    "
  >
    <nav
      slot="header"
      class="h-8 mb-3 w-full flex items-center justify-between mt-1.5"
    >
      <div
        class="flex-1 flex items-center justify-center bg-[length:100%_100%] bg-center bg-repeat-x font-robot-medium font-medium relative mx-1"
        v-for="item in tabList"
        :key="item.type"
        @click="onChangeTab(item.type, item.traceName)"
        :style="
          $ss.getters.normalizeCss(
            {
              height: 30,
              fontSize: curTab === item.type ? 14 : 12,
              color: curTab !== item.type ? '#6A1A1A' : '#F39B07',
              textShadow:
                curTab !== item.type
                  ? '0px 1px 0px  rgba(255, 236, 168, 1)'
                  : undefined,
            },
            curTab === item.type
              ? require('@/assets/gameCommon/groupSelect.png')
              : require('@/assets/gameCommon/groupUnSelect.png')
          )
        "
      >
        {{ item.name }}
        <div
          class="w-2 h-2 box-content border border-solid border-white bg-gradient-to-b from-[#FFAEAE] via-[#F41D1D] to-[#DC0000] rounded-full -right-1 absolute -top-1"
          v-if="reddotMap[item.type]"
        ></div>
      </div>
    </nav>
    <div
      slot="default"
      class="w-full overflow-auto mb-1"
      :style="$ss.getters.normalizeCss({ height: 318 })"
    >
      <GrowthPlanGrowTab
        ref="growth"
        @toMonthCard="curTab = 'month'"
        v-show="curTab === 'growth'"
        @close="onCloseClicked"
      ></GrowthPlanGrowTab>
      <GrowthPlanMonthTab
        ref="month"
        v-show="curTab === 'month'"
        @close="onCloseClicked"
      ></GrowthPlanMonthTab>
    </div>
    <div
      class="flex items-center justify-center h-full text-[10px] font-robot-medium font-medium text-[#7B4814] whitespace-nowrap"
      slot="bottom"
    >
      <ib class="iconfont icon-info"></ib>
      <span :style="{ textShadow: '0px 0.3px 0px #FFE173' }">
        {{ $t('VG.growthTip') }}
      </span>
    </div>
  </GameWoodDlgUI>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import GameWoodDlgUI from '@/modules/UI/GameWoodDlgUI.vue';
import GrowthPlanGrowTab from './GrowthPlanGrowTab.vue';
import GrowthPlanMonthTab from './GrowthPlanMonthTab.vue';
import { GrowthPlanMixin } from './GrowthPlanMixin.state';
import { MS_SECOND } from '@/constants/time';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
import { Toast } from 'vant';
import { GrowthPlanTaskMixin } from './GrowthPlanTask.state';
@Component({
  components: {
    GameWoodDlgUI,
    GrowthPlanGrowTab,
    GrowthPlanMonthTab,
  },
})
export default class GrowthPlanDlg extends mixins(
  BaseDlgMixin,
  BindEventMixinDefault,
  GrowthPlanMixin,
  GrowthPlanTaskMixin
) {
  useInited() {
    return onGBus('onVUserRechargeGameGold', async () => {
      if (this.value) {
        this.refreshGrowthPlan(5);
      } else {
        this.stateItemGrowthPlanRef.lastSetDt = 0;
      }
    });
  }
  declare $refs: {
    growth: GrowthPlanGrowTab;
    month: GrowthPlanMonthTab;
  };
  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.curTab = 'growth';
      this.$tracev('recharge_growth_plan_exposure');
      this.refreshGrowthPlan(MS_SECOND).then((res) => {
        if (!res.ok && res.error?.message) {
          Toast(res.error.message);
        }
      });
      this.$nextTick(() => {
        this.$refs.growth.refresh();
        this.$refs.month.refresh();
      });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    // closeDlg
    this.emitDlgVisible(false);
    this.$emit('close');
  }
  //#endregion

  curTab = 'growth';

  get reddotMap() {
    const isGrowthActive = this.GrowthPlanInfo?.status === 'GROWTH_PLAN_BOUGHT';
    return {
      growth:
        isGrowthActive &&
        (this.GrowthPlanTaskInfo || []).find(
          (item) => item.status === 'AVAILABLE'
        ) != null,
      month: this.GrowthPlanInfo?.payGiftReward?.rewardStatus === 'CAN_RECEIVE',
    };
  }
  get tabList() {
    return [
      {
        type: 'growth' as const,
        name: this.$t('VG.growthPlan'),
        traceName: 'click_recharge_growth_plan',
      },
      {
        type: 'month' as const,
        name: this.$t('VG.monthCard'),
        traceName: 'click_recharge_month_card_gift',
      },
    ];
  }

  onChangeTab(type: 'growth' | 'month', traceName: string) {
    this.curTab = type;
    if (traceName) {
      this.$tracev(traceName);
    }
  }
}
</script>
