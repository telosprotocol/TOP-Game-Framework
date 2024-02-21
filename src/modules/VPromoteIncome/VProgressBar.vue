<template>
  <div class="processbar_bg" @click="traceSubmit">
    <div class="processbar_front" :style="{ width: percent + '%' }"></div>
    <div class="processbar_lvlicon">
      <img v-webp="getVGameLevelConfigByTeamLevel2('zero').icon" alt="" />
      <img v-webp="getVGameLevelConfigByTeamLevel2('one').icon" alt="" />
      <img v-webp="getVGameLevelConfigByTeamLevel2('two').icon" alt="" />
      <img v-webp="getVGameLevelConfigByTeamLevel2('three').icon" alt="" />
      <img v-webp="getVGameLevelConfigByTeamLevel2('four').icon" alt="" />
    </div>
    <div
      class="processbar_curstep"
      :class="percentTxt === 0 || percentTxt === 100 ? 'hide' : ''"
      :style="{ left: percent + '%' }"
    >
      <img
        v-webp="require('@/assets/promptIncome/upgrade_curprocess.png?webp')"
        alt=""
      />
      <span class="text">{{ percentTxt + '%' }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { getVGameLevelConfigByTeamLevel2 } from '@/modules/VAssetInfo/VLevels.config';
import Component, { mixins } from 'vue-class-component';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { tryMergeLocalesForVPrjGoldWithdraw } from '@/locales/Page/VPrj/VGW/init';
import type { IPromotionIncomeProcessBarData } from './index.model';
import { Prop } from 'vue-property-decorator';

tryMergeLocalesForVPrjGoldWithdraw();
@Component({
  components: {},
})
export default class VProgressBar extends mixins(BindEventMixinDefault) {
  getVGameLevelConfigByTeamLevel2 = getVGameLevelConfigByTeamLevel2;

  @Prop({
    type: Object,
    required: true,
  })
  viewData: { viewData: IPromotionIncomeProcessBarData };

  @Prop({
    type: Boolean,
    required: false,
  })
  needTraceSubmit?: boolean;

  /**        */
  get percentTxt() {
    //   nextLevelNeedSameLevelUser  ，pcsSameLevelCntPercent 1
    let pcsRechargeCntPercent = this.viewData.viewData.nextLevelNeedRechargeUser
      ? this.viewData.viewData.directRechargeCount /
        this.viewData.viewData.nextLevelNeedRechargeUser
      : 1;

    if (pcsRechargeCntPercent > 1) pcsRechargeCntPercent = 1;
    if (pcsRechargeCntPercent < 0) pcsRechargeCntPercent = 0;

    if (this.viewData.viewData.currentLevel === 'four') {
      return 100;
    } else if (this.viewData.viewData.nextLevelNeedSameLevelUser) {
      //       nextLevelNeedSameLevelUser  ，pcsSameLevelCntPercent 1
      let pcsSameLevelCntPercent =
        this.viewData.viewData.directSameLevelCount /
        this.viewData.viewData.nextLevelNeedSameLevelUser;
      if (pcsSameLevelCntPercent > 1) pcsSameLevelCntPercent = 1;
      if (pcsSameLevelCntPercent < 0) pcsSameLevelCntPercent = 0;

      return (
        Math.floor(
          (pcsRechargeCntPercent * 0.5 + pcsSameLevelCntPercent * 0.5) * 10000 +
            0.5
        ) / 100
      );
    } else {
      return Math.floor(pcsRechargeCntPercent * 10000 + 0.5) / 100;
    }
  }

  /**      */
  get percent() {
    let prePercent = 0;
    switch (this.viewData.viewData.currentLevel) {
      case 'zero':
        prePercent = 0;
        break;
      case 'one':
        prePercent = 25;
        break;
      case 'two':
        prePercent = 50;
        break;
      case 'three':
        prePercent = 75;
        break;
      case 'four':
        prePercent = 100;
        break;
      default:
        break;
    }

    if (this.viewData.viewData.currentLevel !== 'four') {
      return prePercent + Number((this.percentTxt / 4).toFixed(2));
    }
    return prePercent;
  }

  traceSubmit() {
    if (this.needTraceSubmit) {
      this.$tracev('click_invite_grade_slide', {
        invite_grade: this.viewData.viewData.currentLevel,
        progress_bar: this.percentTxt,
      });
    }
  }
}
</script>

<style lang="less" scoped>
.processbar_bg {
  position: relative;
  height: 19px;

  background: #533789;
  border-radius: 15px 15px 15px 15px;
  box-shadow: inset 0px -1px 0px 0px rgba(255, 255, 255, 0.23);
}
.processbar_front {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 19px;
  background: linear-gradient(90deg, #f667ff 0%, #fff387 100%);
  border-radius: 15px 0px 0px 15px;
}
.processbar_curstep {
  position: absolute;
  top: 10px;
  left: 0%;
  width: 12px;
  height: 10px;

  transform: translateX(-58%);
}
.processbar_curstep.hide {
  display: none;
}
.processbar_curstep img {
  width: 12px;
  height: 10px;
}
.processbar_curstep .text {
  position: absolute;
  top: 28px;
  left: 50%;
  color: #ffffff;
  font-weight: bold;
  font-size: 12px;
  font-family: Rubik-Bold, Rubik;
  line-height: 8px;
  transform: translateX(-50%);
  zoom: 0.583;
}
.processbar_lvlicon {
  position: relative;
  height: 19px;
}
.processbar_lvlicon img {
  position: absolute;
  top: 50%;
  left: 0;
  width: 36px;
  height: auto;

  transform: translate(-50%, -50%);
}
.processbar_lvlicon img:nth-child(2) {
  left: 25%;
  width: 40px;
}
.processbar_lvlicon img:nth-child(3) {
  left: 50%;
  width: 40px;
}
.processbar_lvlicon img:nth-child(4) {
  left: 75%;
  width: 40px;
}
.processbar_lvlicon img:nth-child(5) {
  left: 100%;
  width: 42px;
}
</style>
