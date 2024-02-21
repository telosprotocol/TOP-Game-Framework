<template>
  <div>
    <ul>
      <li v-for="(item, idx) in allLevelData" :key="'descItem_' + idx">
        <div>
          <h3 class="font-robot">{{ idx + 1 }}. {{ item.title }}</h3>
          <p class="item_desc">{{ item.desc }}</p>
          <div class="item_comp_zone">
            <p class="item_comp_rl">
              <span class="item_comp_bg robot-bold">
                <img v-webp="getCoinConfig(VCoinEnum.VTOKEN).icon" alt="" />
                <span class="text"
                  >{{ item.rlDstRate }}% {{ $t('V.DST') }} +
                </span>
                <img v-webp="getCoinConfig(VCoinEnum.GOLD).icon" alt="" />
                <span class="text"
                  >{{ item.rlCoinRate }}% {{ $t('VPI.goldCoins') }}</span
                >
              </span>
              <span class="item_comp_left robot-bold"
                >{{ $t('VPI.directCommission') }} {{ item.rlAllRate }}%</span
              >
            </p>
            <p class="item_comp_rl">
              <span class="item_comp_bg robot-bold">
                <img v-webp="getCoinConfig(VCoinEnum.VTOKEN).icon" alt="" />
                <span class="text"
                  >{{ item.rtlDstRate }}% {{ $t('V.DST') }} +
                </span>
                <img v-webp="getCoinConfig(VCoinEnum.GOLD).icon" alt="" />
                <span class="text"
                  >{{ item.rtlCoinRate }}% {{ $t('VPI.goldCoins') }}</span
                >
              </span>
              <span class="item_comp_left robot-bold"
                >{{ $t('VPI.indirectCommission') }} {{ item.rtlAllRate }}%</span
              >
            </p>
            <p class="item_comp_rl" v-if="item.isRtl3Exist">
              <span class="item_comp_bg robot-bold">
                <img v-webp="getCoinConfig(VCoinEnum.VTOKEN).icon" alt="" />
                <span class="text"
                  >{{ item.rtl3DstRate }}% {{ $t('V.DST') }} +
                </span>
                <img v-webp="getCoinConfig(VCoinEnum.GOLD).icon" alt="" />
                <span class="text"
                  >{{ item.rtl3CoinRate }}% {{ $t('VPI.goldCoins') }}</span
                >
              </span>
              <span class="item_comp_left robot-bold"
                >{{ $t('VPI.indirectCommission3') }}
                {{ item.rtl3AllRate }}%</span
              >
            </p>
            <p class="progressbar_con">
              <VProgressBar :view-data="{ viewData: item }" />
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import Component, { mixins } from 'vue-class-component';
import { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { getVGameLevelConfigByTeamLevel2 } from '@/modules/VAssetInfo/VLevels.config';
import type { IPromotionIncomeProcessBarData } from './index.model';
import VProgressBar from './VProgressBar.vue';
import { getCoinConfig } from '@/modules/VAssetInfo/VCoin.config';

interface IPromotionIncomeProcessBarDataExt
  extends IPromotionIncomeProcessBarData {
  title: string;
  desc: string;
  rlAllRate: number;
  rlCoinRate: number;
  rlDstRate: number;
  rtlAllRate: number;
  rtlCoinRate: number;
  rtlDstRate: number;
  isRtl3Exist: boolean;
  rtl3AllRate?: number;
  rtl3CoinRate?: number;
  rtl3DstRate?: number;
}

@Component({
  components: {
    VProgressBar,
  },
})
export default class VPromoteIncomeDesc extends mixins(BindEventMixinDefault) {
  getCoinConfig = getCoinConfig;
  VCoinEnum = VCoinEnum;

  statusBarColor = '#aa76f1';
  // useInited() {}
  get allLevelData() {
    return [
      {
        title: getVGameLevelConfigByTeamLevel2('zero').title,
        desc: this.$t('VPI.gameLevel_0_desc'),
        rlAllRate: 4,
        rlCoinRate: 4,
        rlDstRate: 0,
        rtlAllRate: 0,
        rtlCoinRate: 0,
        rtlDstRate: 0,
        isRtl3Exist: false,
        //
        directSameLevelCount: 3,
        nextLevelNeedSameLevelUser: 6,
        directRechargeCount: 3,
        nextLevelNeedRechargeUser: 6,
        currentLevel: 'zero',
      } as IPromotionIncomeProcessBarDataExt,
      {
        title: getVGameLevelConfigByTeamLevel2('one').title,
        desc: this.$t('VPI.gameLevel_1_desc'),
        rlAllRate: 10,
        rlCoinRate: 5,
        rlDstRate: 5,
        rtlAllRate: 0,
        rtlCoinRate: 0,
        rtlDstRate: 0,
        isRtl3Exist: false,
        //
        directSameLevelCount: 3,
        nextLevelNeedSameLevelUser: 6,
        directRechargeCount: 3,
        nextLevelNeedRechargeUser: 6,
        currentLevel: 'one',
      } as IPromotionIncomeProcessBarDataExt,
      {
        title: getVGameLevelConfigByTeamLevel2('two').title,
        desc: this.$t('VPI.gameLevel_2_desc'),
        rlAllRate: 16,
        rlCoinRate: 6,
        rlDstRate: 10,
        rtlAllRate: 1,
        rtlCoinRate: 0,
        rtlDstRate: 1,
        isRtl3Exist: false,
        //
        directSameLevelCount: 3,
        nextLevelNeedSameLevelUser: 6,
        directRechargeCount: 3,
        nextLevelNeedRechargeUser: 6,
        currentLevel: 'two',
      } as IPromotionIncomeProcessBarDataExt,
      {
        title: getVGameLevelConfigByTeamLevel2('three').title,
        desc: this.$t('VPI.gameLevel_3_desc'),
        rlAllRate: 19,
        rlCoinRate: 7,
        rlDstRate: 12,
        rtlAllRate: 2.5,
        rtlCoinRate: 1.5,
        rtlDstRate: 1,
        isRtl3Exist: false,
        //
        directSameLevelCount: 3,
        nextLevelNeedSameLevelUser: 6,
        directRechargeCount: 3,
        nextLevelNeedRechargeUser: 6,
        currentLevel: 'three',
      } as IPromotionIncomeProcessBarDataExt,
      {
        title: getVGameLevelConfigByTeamLevel2('four').title,
        desc: this.$t('VPI.gameLevel_4_desc'),
        rlAllRate: 23,
        rlCoinRate: 8,
        rlDstRate: 15,
        rtlAllRate: 4,
        rtlCoinRate: 2,
        rtlDstRate: 2,
        isRtl3Exist: true,
        rtl3AllRate: 0.1,
        rtl3CoinRate: 0.1,
        rtl3DstRate: 0,
        //
        directSameLevelCount: 3,
        nextLevelNeedSameLevelUser: 6,
        directRechargeCount: 3,
        nextLevelNeedRechargeUser: 6,
        currentLevel: 'four',
      } as IPromotionIncomeProcessBarDataExt,
    ];
  }
}
</script>

<style lang="less" scoped>
ul {
  height: 100%;
  padding: 25px 25px 25px 21px;

  overflow: auto;
  background: #ffffff;
  border-radius: 12px 12px 0 0;
}
li h3 {
  color: #343434;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
}
li p {
  // robot-regular
  padding-left: 0px;

  color: #343434;
  font-size: 12px;
  line-height: 14px;
}
li {
  padding-bottom: 42px;
}
li:last-child {
  padding-bottom: 0;
}
.item_desc {
  padding-top: 6px;
  padding-bottom: 13px;
}
.item_comp_zone {
  padding-left: 0px;
}
.item_comp_rl {
  position: relative;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin-bottom: 8px;
  padding: 6px 9px 0 9px;
  background: #f2eaff;
  border-radius: 30px 30px 30px 30px;
}
.item_comp_rl img {
  max-width: 18px;
  max-height: 18px;
  margin-right: 3px;
}
.progressbar_con {
  padding: 0 16px;
}
.item_comp_left {
  position: absolute;
  top: 50%;
  left: 9px;
  height: 21px;
  color: #a774ef;
  font-size: 12px;
  line-height: 21px;
  white-space: nowrap;
  transform: translateY(-50%);
}
.item_comp_bg {
  float: right;
  width: 158px;
  height: 21px;
  padding: 0 9px 0 1px;

  overflow-x: hidden;
  color: #ffffff;
  line-height: 21px;
  white-space: nowrap;
  background: #856baf;
  border-radius: 10px 10px 10px 10px;
}
.item_comp_left,
.item_comp_bg .text {
  font-size: 12px;
  zoom: 0.83;
}
/deep/.processbar_curstep .text {
  top: 32px;
  color: black;
}
</style>
