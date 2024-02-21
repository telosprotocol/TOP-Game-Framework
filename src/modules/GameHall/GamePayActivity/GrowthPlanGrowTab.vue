<template>
  <div class="overflow-x-clip">
    <div
      class="bg-contain bg-center bg-no-repeat relative"
      :style="
        $ss.getters.normalizeCss(
          { width: 544 / 2, height: 140 },
          $ss.getters.translateImage({
            en: require('@/assets/gameGrowth/grow-banner-en.png?webp'),
            id: require('@/assets/gameGrowth/grow-banner-id.png?webp'),
          }),
          true
        )
      "
    >
      <button
        v-if="status === 'INIT' || status === 'MONTH_CARD_BOUGHT'"
        @click="onBtnClick"
        class="absolute vbtn vbtn--sm vbtn--yellow"
        :style="$ss.getters.normalizeCss({ top: 104, left: 86, minWidth: 143 })"
      >
        {{
          status === 'INIT' ? $t('VG.activatePrivileges') : txtGrowthPlanPrice
        }}
      </button>
      <i18n
        v-else-if="status === 'GROWTH_PLAN_BOUGHT'"
        path="VG.getCashBack"
        class="absolute text-white text-[15px] leading-normal font-rubik font-bold"
        :style="
          $ss.getters.normalizeCss({
            top: 108,
            right: 18,
            minWidth: 143,
            webkitTextStroke: '1px #A23100',
          })
        "
      >
        {{ txtClaimedCoin }}
      </i18n>
    </div>
    <div class="pt-1">
      <GrowthTaskItem
        v-for="(item, idx) in taskList"
        :class="{ 'mb-1.5': idx !== taskList.length - 1 }"
        :task-info="item"
        :key="item.taskId"
      ></GrowthTaskItem>

      <AsyncStatus
        v-if="status"
        :status="taskReqStatus"
        :no-data-text="$t('VGT.groupMissionDone')"
        color="#F39B07"
        class="px-2 mt-6 text-center"
      >
      </AsyncStatus>
    </div>
  </div>
</template>

<script lang="ts">
import NoDataIcon from '@/components/NoData/NoDataIcon.vue';
import { getActivityPayForMultiPrice } from '@/constants/APP_SCHEMA_URLS';
import ButtonLockController from '@/controller/ButtonLockController';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import Component, { mixins } from 'vue-class-component';
import { GrowthPlanMixin } from './GrowthPlanMixin.state';
import { GrowthPlanTaskMixin } from './GrowthPlanTask.state';
import GrowthTaskItem from './GrowthTaskItem.vue';
import AsyncStatus from '../../../components/NoData/AsyncStatus.vue';

@Component({
  components: { GrowthTaskItem, NoDataIcon, AsyncStatus },
})
export default class GrowthPlanGrowTab extends mixins(
  GrowthPlanTaskMixin,
  BindEventMixinDefault,
  GrowthPlanMixin
) {
  useInited() {
    const cb1 = onGBus('onVTaskUpdate', (payload) => {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[DEBUG] onVTaskUpdate', payload);
      }
      if (
        (payload.type === 'single' &&
          payload.taskModuleType === 'GROWTH_PLAN_GROWTH_PLAN') ||
        payload.type === 'behavior'
      ) {
        this.refreshGrowthPlanTask(10);
        this.refreshGrowthPlan(10);
      }
    });
    return () => {
      cb1();
    };
  }

  refresh() {
    this.refreshGrowthPlanTask(10);
  }

  get taskList() {
    const status = this.status;
    const isGrowthActive = status === 'GROWTH_PLAN_BOUGHT' || status == null;
    return (this.GrowthPlanTaskInfo || []).map((item) => {
      const status =
        !isGrowthActive || item.status === 'TIMEOUT'
          ? 'NOT_TAKEN'
          : item.status;
      return {
        ...item,
        status: status,
        currentValue: status === 'NOT_TAKEN' ? 0 : item.currentValue,
      };
    });
  }

  get taskReqStatus() {
    const status = this.stateItemGrowthPlanTaskRef.status;
    if (status === 'ok' && this.taskList.length === 0) {
      return 'nodata';
    }
    return status;
  }

  get status() {
    return this.GrowthPlanInfo?.status;
  }

  get txtGrowthPlanPrice() {
    const growthPlanPrice = this.GrowthPlanInfo?.growthPlanPrice;
    if (growthPlanPrice == null) {
      return '-';
    }
    return this.$t('Base.xRp', {
      n: this.$ss.getters.formatFloat(Number(growthPlanPrice)),
    });
  }

  onBtnClick() {
    const status = this.status;
    const btnEventName = 'click_recharge_growth_plan_button';

    if (status === 'INIT') {
      if (!ButtonLockController.Instance.tryGetLock('click_' + status, 0.5)) {
        return;
      }
      this.$tracev(btnEventName, {
        button_type: 'jump',
      });
      this.$emit('toMonthCard');
    } else {
      if (!ButtonLockController.Instance.tryGetLock('click_' + status, 1)) {
        return;
      }
      const GrowthPlanInfo = this.GrowthPlanInfo;
      this.$tracev(btnEventName, {
        button_type: 'buy',
      });
      openAppH5LinkPreferLocal(
        getActivityPayForMultiPrice(
          GrowthPlanInfo.growthPlanActivityId,
          'GROWTH_PLAN',
          GrowthPlanInfo.growthPlanPrice
        ),
        {}
      );
    }
  }

  get claimedCoin() {
    const GrowthPlanTaskInfo = this.GrowthPlanTaskInfo;
    let count = 0;
    (GrowthPlanTaskInfo || []).forEach((item) => {
      if (item.status === 'FINISHED') {
        item.propRewards.map((propItem) => {
          if (propItem.type === 'GOLD') {
            count += Number(propItem.propNum) * Number(propItem.num);
          }
        });
      }
    });
    return count;
  }

  get txtClaimedCoin() {
    const claimedCoin = this.claimedCoin;
    if (claimedCoin < 1000) {
      return claimedCoin + '';
    } else {
      return Math.floor(claimedCoin / 1000) + ' K';
    }
  }
}
</script>
@/constants/APP_SCHEMA_URLS
