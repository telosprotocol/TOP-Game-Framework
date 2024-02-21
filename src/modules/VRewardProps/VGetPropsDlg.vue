<template>
  <div>
    <RewardDlgUI
      ref="dlgWrap"
      :value="value"
      :list="rewardUIList"
      @input="emitDlgVisible"
    >
      <template slot="btn">
        <button
          @click.stop="onCloseOrUsePropClicked"
          class="vbtn vbtn--yellow w-full active:scale-95 mb-4"
          :class="{
            invisible: !canUse,
          }"
        >
          {{ $t('V.use') }}
        </button>
      </template>
    </RewardDlgUI>
    <portal to="modal">
      <VPropPhoneTicketUseDlg
        v-model="isPhoneTicketShow"
        :use-num="list && list[0] ? list[0].propNum : 0"
        :info="list ? list[0] : null"
        @used="onUseTicketSuccess"
      ></VPropPhoneTicketUseDlg>
      <GameToast v-model="isToastShow">{{ $t('V.useSuccess') }}</GameToast>
    </portal>
  </div>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
import { tryMergeLocalesForVPrjMyBag } from '@/locales/Page/VPrj/VBG/init';
import { Toast } from 'vant';
import VPropPhoneTicketUseDlg from './VPropPhoneTicketUseDlg.vue';
import { updateRewardsByPropTypes } from '@/modules/VAssetInfo/VAsset.utils';
import { getIsPropRewardUsableForCommonUse } from './controller/prop.utils';
import type { IUserPropRewardItemBase } from './controller/prop.model';
import { propUseUserPropController } from '@/vservices/client/UserPropController';
import RewardDlgUI from './RewardDlgUI.vue';
import GameToast from '../UI/GameToast.vue';
import { getCoinConfig } from '../VAssetInfo/VCoin.config';

/**
 *
 * 1.   1    ，
 * 2.       ，
 */
@Component({
  components: {
    VPropPhoneTicketUseDlg,
    RewardDlgUI,
    GameToast,
  },
})
export default class VGetPropsDlg extends mixins(PopupMixin) {
  mounted() {
    tryMergeLocalesForVPrjMyBag();
  }
  @Prop({
    type: Array,
  })
  list: IUserPropRewardItemBase[];

  @Prop({
    type: Function,
    required: false,
  })
  onDlgCloseCallback?: () => void | null;

  get rewardUIList() {
    return this.list?.map((item, idx) => {
      let { imageUrl, nameText, propNum, num } = item;

      let realNum = propNum;
      if (
        (realNum != null && num !== null && item.type === 'GOLD') ||
        item.type === 'VTOKEN'
      ) {
        realNum = Number(propNum) * Number(num);
      }
      const commonConfig = getCoinConfig(item.type as 'GOLD', realNum);
      if (!imageUrl) {
        imageUrl = commonConfig.rewardIcon;
      }

      return {
        id: item.propBagId || item.propId || idx,
        nameText,
        imageUrl,
        num: realNum,
        type: item.type,
      };
    });
  }

  //#region Dlg Basic Setting
  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('gamehall_prop_exposure', {
        prop_number: this.list.length + '',
      });
    } else {
      if (this.onDlgCloseCallback) {
        this.onDlgCloseCallback();
      }
    }
  }

  //#endregion

  async onCloseOrUsePropClicked() {
    if (!ButtonLockController.Instance.tryGetLock('useProp', 0.5)) {
      return;
    }
    if (this.canUse) {
      const curItem = this.list[0];
      const propInfo = curItem;
      this.$tracev('click_gamehall_prop_gouse', {
        prop_id: curItem.propId,
        prop_name: propInfo.nameText,
      });
      if (
        propInfo.type === 'PHONE_CHARGE_TICKET' ||
        propInfo.type === 'FLOW_CARD'
      ) {
        this.isPhoneTicketShow = true;
        this.emitDlgVisible(false);
      } else {
        //    VTOKEN
        // const curUseNum = curItem.propNum;
        const res = await propUseUserPropController({
          id: curItem.propBagId,
          useNum: curItem.propNum,
        });
        if (res.success) {
          this.emitDlgVisible(false);
          updateRewardsByPropTypes(propInfo.type);
          // this.gettedRewards = [
          //   getRewardDlgInfoByPropReward(curItem, curUseNum),
          // ];
          this.$emit('used');
          this.isToastShow = true;
        } else {
          Toast(res.message);
        }
      }
    } else {
      this.$tracev('click_gamehall_prop_confirm', {
        prop_number: this.list.length + '',
      });
      this.emitDlgVisible(false);
    }
  }
  isToastShow = false;
  // isGettedRewardDlgShow = false;
  // gettedRewards: IVGettedRewardDlgInfo[] = [];
  isPhoneTicketShow = false;

  get canUse() {
    if (
      this.list?.length === 1 &&
      getIsPropRewardUsableForCommonUse(this.list[0])
    ) {
      //
      return true;
    }
    return false;
  }
  onUseTicketSuccess() {
    this.$emit('used');
  }
}
</script>
