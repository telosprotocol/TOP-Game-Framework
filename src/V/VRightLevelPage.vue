<template>
  <div class="bg-[#F1EDF6] h-screen flex flex-col relative z-0">
    <div
      class="bg-[length:100%_auto] bg-top bg-no-repeat fixed top-0 left-0 right-0 -z-10"
      :style="bgPurpleHeadStyle"
    ></div>
    <HeaderTop
      left-icon="icon-left"
      :title="$t('VML.FeeLevelList')"
      bar-background="transparent"
      skin="dark"
    ></HeaderTop>
    <VLevelHead class="shrink-0"></VLevelHead>
    <main class="-mt-8 px-4 py-4 flex-1 overflow-y-auto">
      <div class="p-4 bg-white rounded-2xl shadow-md shadow-[#AC8ADD]">
        <div>
          <div class="flex items-center justify-between mb-2.5">
            <div class="rule-title flex-[5] mr-3 break-all">
              {{ $t('VML.UserLevel') }}
            </div>
            <div class="rule-title flex-[3] break-all">
              {{ $t('VML.TransactionFee') }}
            </div>
          </div>
          <div
            v-for="item in RightLevelRule"
            :key="item.levelNo"
            class="flex items-center justify-between mb-2.5"
          >
            <div
              class="rule-item flex-[5] mr-3 text-base font-medium font-rubik text-[#9567D1]"
              :class="{ current: item.levelNo === curGameLevel }"
            >
              {{ getGameLevelConfig(item.levelNo).title }}
            </div>

            <div
              class="rule-item flex-[3] lv-text2 font-rubik text-base font-bold break-all text-[#9567D1]"
              :class="{ current: item.levelNo === curGameLevel }"
            >
              {{ convertFeeRatio(item.feeRatio) }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';

import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import VLevelHead from '@/modules/RightLevel/VLevelHead.vue';
import { tryMergeLocalesForVPrjRightLevel } from '@/locales/Page/VPrj/VML/init';
import { getVGameLevelConfigByGameLevel } from '@/modules/VAssetInfo/VLevels.config';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import HeaderTop from '@/components/HeaderTop/index.vue';
import { convertBgImageStyle } from '@/utils/styles';
import { VRightLevelRuleMixin } from '@/modules/RightLevel/RightLevel.state';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjRightLevel();

//
@Component({
  components: {
    VLevelHead,
    HeaderTop,
  },
})
export default class VRightLevelPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  VRightLevelRuleMixin,
  VUserAccountMixin
) {
  statusBarColor = '#9262CF';
  useInited() {
    this.refreshVRightLevelRule();
    this.refreshVUserAccount().then(() => {
      this.$trace('dst_exchange_exposure_detail_exposure', {
        grade: this.curGameLevel,
      });
    });
    return () => {};
  }
  get bgPurpleHeadStyle() {
    return convertBgImageStyle(
      require('@/assets/vcommon/head/purpleHeadBg.png?webp'),
      true,
      this.$ss.getters.designPxsObjToReal({
        width: 360,
        height: 294,
      })
    );
  }
  convertFeeRatio(feeRatio: number) {
    return `${this.$ss.getters.formatFloat(feeRatio * 100, {
      reserveZeroDecimal: false,
    })}%`;
  }

  get curGameLevel() {
    return this.UserAccount?.gameLevel;
  }

  getGameLevelConfig(level: number) {
    return getVGameLevelConfigByGameLevel(level);
  }
}
</script>
<style type="less" scoped>
.rule-item,
.rule-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #f1e8ff;
  border-radius: 10px;
  opacity: 1;
}
.rule-item {
  background: #f6f2fc;
}
.rule-item.current {
  border: 1px solid #9567d1;
}
.rule-title {
  color: #fff;
  font-weight: bold;
  background: linear-gradient(180deg, #b688eb 0%, #9d6ed5 100%);
}
</style>
