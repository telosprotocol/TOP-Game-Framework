<template>
  <RewardDlgUI
    ref="dlgWrap"
    :value="value"
    :list="rewardUIList"
    @input="emitDlgVisible"
    @close="$emit('close')"
  >
  </RewardDlgUI>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';

import { Prop } from 'vue-property-decorator';
import type { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { getCoinConfig } from '@/modules/VAssetInfo/VCoin.config';
import { formatFloatG } from '@/store/modules/universe/universe';
import RewardDlgUI from './RewardDlgUI.vue';
import PopupMixin from '../../components/Modal/PopupMixin';

/**
 *
 */
export type IVGettedRewardDlgInfo = {
  /**
   *        ，       coin
   */
  icon?: string;
  //#region
  /**
   *      ，      ， +1,234,
   */
  text?: string;
  /**
   *      ，  text   ，  num, coin
   */
  num?: number;
  coin?: VCoinEnum;

  //#endregion
  /**
   *
   */
  name?: string;
};
function getTxtValue(info?: IVGettedRewardDlgInfo) {
  if (!info) {
    return '';
  }
  const text = info.text;
  if (text) {
    return text;
  }
  const coin = info.coin;
  const num = info.num;
  if (!coin && num == null) {
    return '';
  }
  if (coin) {
    const config = getCoinConfig(coin as VCoinEnum);
    return config.format(num);
  }
  return formatFloatG(num);
}
/**
 *         ( VGetPropsDlg  ：  Use)
 */
@Component({
  components: { RewardDlgUI },
})
export default class VGettedRewardsDlg extends mixins(PopupMixin) {
  mounted() {
    tryMergeLocalesForVPrjCommon();
  }
  /**
   *
   */
  @Prop({
    type: Array,
    required: false,
  })
  rewards?: IVGettedRewardDlgInfo[];

  get rewardUIList() {
    return (this.rewards || []).map((item, idx) => {
      let icon = item.icon;
      if (!icon) {
        const coin = item.coin;
        if (coin) {
          const config = getCoinConfig(coin as VCoinEnum, item.num);
          icon = config.rewardIcon;
        }
      }
      return {
        id: idx + '',
        nameText: item.name,
        imageUrl: icon,
        num: getTxtValue(item),
        type: item.coin,
      };
    });
  }
  dlgSound = true;
}
</script>
