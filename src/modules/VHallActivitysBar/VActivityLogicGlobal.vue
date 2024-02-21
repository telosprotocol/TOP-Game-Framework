<template>
  <div>
    <VWelfareEntryLogic
      v-if="moduleMap.WELFARE_ENTRY"
      ref="WELFARE_ENTRY"
      @updateActivity="onActivityToUpdate"
      @activityClick="onActivityClick"
    ></VWelfareEntryLogic>
    <GamePayActivityEntryLogic
      v-if="moduleMap.PAY_ENTRY"
      ref="PAY_ENTRY"
      @updateActivity="onActivityToUpdate"
    ></GamePayActivityEntryLogic>
    <VGameTopupLogic
      ref="FIRST_CHARGE"
      v-if="moduleMap.FIRST_CHARGE"
      @updateActivity="onActivityToUpdate"
    ></VGameTopupLogic>
    <VSpinLogic
      ref="TURNTABLE"
      v-if="moduleMap.TURNTABLE"
      @updateActivity="onActivityToUpdate"
    ></VSpinLogic>
    <HiggsLogic
      v-if="moduleMap.HIGGS"
      ref="HIGGS"
      @updateActivity="onActivityToUpdate"
    ></HiggsLogic>
    <VGameTaskNoviceEntryLogic
      v-if="moduleMap.NOVICE_FIVE_DAYS"
      ref="NOVICE_FIVE_DAYS"
      @updateActivity="onActivityToUpdate"
    ></VGameTaskNoviceEntryLogic>
    <GameWeekCardEntryLogic
      v-if="moduleMap.WEEK_RECHARGE"
      ref="WEEK_RECHARGE"
      @updateActivity="onActivityToUpdate"
    ></GameWeekCardEntryLogic>
    <VGameTomorrowPackLogic
      v-if="moduleMap.TOMORROW_GIFT"
      ref="TOMORROW_GIFT"
      @updateActivity="onActivityToUpdate"
    ></VGameTomorrowPackLogic>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import HiggsLogic from '@/modules/Higgs/HiggsLogic.vue';
import VSpinLogic from '@/modules/Turntable/VSpinLogic.vue';
import VWelfareEntryLogic from '@/modules/VActivityList/VWelfareEntryLogic.vue';
import VGameTopupLogic from '@/modules/GameHall/VTopupFirstDiscount/VGameTopupLogic.vue';
import {
  ACTIVITY_CONFIG_MAP,
  IActivityEntryFrom,
  IActivityType,
} from './activity-logic.config';
import GamePayActivityEntryLogic from '../GameHall/GamePayActivity/GamePayActivityEntryLogic.vue';
import VGameTomorrowPackLogic from '../GameHall/VGameTomorrowPack/VGameTomorrowPackLogic.vue';
import VGameTaskNoviceEntryLogic from '../GameTaskNovice/VGameTaskNoviceEntryLogic.vue';
import GameWeekCardEntryLogic from '../GameWeekCard/GameWeekCardEntryLogic.vue';
import { emitGBus } from '../../utils/GBus';
@Component({
  components: {
    VGameTopupLogic,
    VSpinLogic,
    HiggsLogic,
    VWelfareEntryLogic,
    VGameTaskNoviceEntryLogic,
    GamePayActivityEntryLogic,
    VGameTomorrowPackLogic,
    GameWeekCardEntryLogic,
  },
})
export default class VActivityLogicGlobal extends Vue {
  $refs: {
    FIRST_CHARGE: VGameTopupLogic;
    TURNTABLE: VSpinLogic;
    HIGGS: HiggsLogic;
    WELFARE_ENTRY: VWelfareEntryLogic;
    NOVICE_FIVE_DAYS: VGameTaskNoviceEntryLogic;
    PAY_ENTRY: GamePayActivityEntryLogic;
    WEEK_RECHARGE: GameWeekCardEntryLogic;
    TOMORROW_GIFT: VGameTomorrowPackLogic;
  };
  moduleMap = {
    //          ，
    FIRST_CHARGE: true,
    TURNTABLE: true,
    HIGGS: true,
    PAY_ENTRY: true,
    NOVICE_FIVE_DAYS: true,
    WEEK_RECHARGE: true,
    WELFARE_ENTRY: true,
    TOMORROW_GIFT: true,
  };

  async onActivityClick(type: IActivityType, from: IActivityEntryFrom) {
    const logic = this.$refs[type as 'FIRST_CHARGE'];
    if (logic) {
      logic?.onButtonClick(from as any);
      return;
    }
    if (type === 'GROWTH_PLAN') {
      //
      this.$refs.PAY_ENTRY?.tryOpenGrowthPlanDlg?.(from);
      return;
    }
    const config = ACTIVITY_CONFIG_MAP[type];
    if (!config) {
      return;
    }
    return config.onClick?.(from);
  }
  closeAll() {
    Object.keys(this.moduleMap).forEach((moduleName) => {
      this.$refs[moduleName as 'FIRST_CHARGE']?.closeAll?.();
    });
  }
  onActivityToUpdate(data: { type: IActivityType }) {
    this.$emit('updateActivity', data);
    emitGBus('onActivityToUpdate', data);
  }
}
</script>
