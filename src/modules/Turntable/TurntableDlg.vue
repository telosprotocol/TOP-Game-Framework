<template>
  <transition name="tz-transwrap" :duration="250">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>
      <!-- TopLeftDec -->
      <aside class="pointer-events-none">
        <!-- Light -->
        <div
          class="absolute top-0 left-0 z-0 bg-contain bg-no-repeat bg-left-top animate-twSpin2 animate-alternate animate-infinite origin-top-left"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 274,
                height: 304,
                '--animate-from-deg': '0',
                '--animate-to-deg': '15deg',
                animationDuration: '5s',
              },
              require('@/assets/turntable3/light.png?webp'),
              true
            )
          "
        ></div>

        <!-- Leaf -->
        <div
          class="absolute top-0 left-0 z-20 bg-contain bg-no-repeat bg-left-top"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 108,
                height: 88,
              },
              require('@/assets/turntable3/leaf.png?webp'),
              true
            )
          "
        ></div>
      </aside>

      <div class="relative z-[8] mt-4">
        <main class="tz-transel-scaleInOut">
          <Turntable
            ref="turntable"
            :type="curTabType"
            :info="curTurntable"
            :img-title="imgTurntableTitle"
            class="mx-auto"
          >
            <!-- CloseButton -->
            <button
              slot="before"
              @click="onCloseClicked"
              class="w-9 h-9 bg-contain bg-no-repeat bg-center active:scale-95 absolute -top-1 right-1"
              v-webp="require('@/assets/gameCommon/x.png?webp')"
            ></button>
            <button
              slot="before"
              @click="onShowRuleDlg"
              class="absolute bg-contain bg-center bg-no-repeat active:scale-95"
              :style="
                $ss.getters.normalizeCss(
                  {
                    width: 58,
                    height: 79,
                    right: 24,
                    bottom: -34,
                  },
                  $ss.getters.translateImage({
                    en: require('@/assets/turntable3/btnRule-en.png?webp'),
                    id: require('@/assets/turntable3/btnRule-id.png?webp'),
                  }),
                  true
                )
              "
            ></button>
          </Turntable>
          <ButtonSpinUI
            :is-turanable-able="isTuranableAble"
            @click.native="onTurnClick"
          >
            <template slot="btnContent">
              <div
                key="free"
                v-if="turntableFeeInfo == null || turntableFeeInfo.isFree"
              >
                {{ $t('V_T.spin') }}
              </div>
              <div
                key="icon"
                class="bg-contain bg-center bg-no-repeat w-7 h-7 mr-1"
                v-if="turntableFeeInfo && !turntableFeeInfo.isFree"
                v-webp="turntableFeeInfo.icon"
              ></div>
              <div
                key="text"
                v-if="turntableFeeInfo && !turntableFeeInfo.isFree"
              >
                {{ turntableFeeInfo.txtFee }}
              </div>
            </template>
          </ButtonSpinUI>
        </main>
      </div>

      <portal to="modal">
        <TurntableRuleDlg
          :type="curTabType"
          v-model="isRuleDlgShow"
          :fee="normalFee"
        ></TurntableRuleDlg>
        <TurntableNoGoldDlg
          :type="curTabType"
          v-model="isNoGoldDlgShow"
        ></TurntableNoGoldDlg>
        <VGettedRewardsDlg
          :rewards="rewardList"
          v-model="isRewardGettedShow"
          @close="onGetRewardClose"
        >
        </VGettedRewardsDlg>
      </portal>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import PopupMixin from '@/components/Modal/PopupMixin';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import {
  showLoading_bridge,
  dismissLoading_bridge,
  isShowBankruptcyGiftAndOpen,
} from '@/js_bridge/js_call_app_base';
import TurntableRuleDlg from './TurntableRuleDlg.vue';
import { tryMergeLocalesForVPrjTurntable } from '@/locales/Page/VPrj/V_T/init';
import TurntableNoGoldDlg from './TurntableNoGoldDlg.vue';
import Turntable from './Turntable.vue';
import { Toast } from 'vant';
import { getCoinConfig } from '@/modules/VAssetInfo/VCoin.config';
import type { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { VTurntableListMixin } from './turntable.state';

import VGettedRewardsDlg, {
  IVGettedRewardDlgInfo,
} from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import ButtonSpinUI from './ButtonSpinUI.vue';
import { luckyWheelSpinUserLuckyWheelLogController } from '@/vservices/client/UserLuckyWheelLogController';
import { webpFilter } from '../../directives/webp';
import { stateItemVActivityHallList } from '../VActivityList/activity-hall.state';
import stateItemVGamePayGift from '../GameHall/VTopupFirstDiscount/VGamePayGift.state';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';
tryMergeLocalesForVPrjTurntable();
@Component({
  components: {
    TurntableRuleDlg,
    TurntableNoGoldDlg,
    Turntable,
    VGettedRewardsDlg,
    ButtonSpinUI,
  },
})
export default class TurntableDlg extends mixins(
  PopupMixin,
  VTurntableListMixin
) {
  $refs!: {
    turntable: Turntable;
    dlgWrap: HTMLDivElement;
  };

  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  async onValueChange(isShow: boolean) {
    if (isShow) {
      showLoading_bridge();
      this.isTurned = false;
      const res = await this.refreshVTurntableList(0);
      dismissLoading_bridge();
      if (!res.ok) {
        Toast(res.error.Reason);
      }
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('click_close_game_luckywheel', {});
    this.$emit('close', this.isTurned);

    this.emitDlgVisible(false);
  }
  //#endregion

  //#region  Tab
  curTabType: API.LuckyWheelVO['luckyWheelType'] = 'GOLD';
  // get tabList() {
  //   return [
  //     {
  //       type: 'GOLD',
  //       title: this.$t('V_T.gold'),
  //     },
  //     {
  //       type: 'DIAMOND',
  //       title: this.$t('V_T.diamond'),
  //     },
  //   ] as { type: API.LuckyWheelVO['luckyWheelType']; title: string }[];
  // }
  // onTabItemSelect(tabItem: typeof TurntableDlg.prototype.tabList[0]) {
  //   if (this.isWheeling) {
  //     return;
  //   }
  //   this.curTabType = tabItem.type;
  //   this.$tracev('click_gamehall_checkin_tab', {
  //     checkin_tab: tabItem.type,
  //   });
  //   this.$refs.turntable.resetTurn();
  // }
  //#endregion

  //#region turntable

  get turntableFeeInfo() {
    const curTurntable = this.curTurntable;
    if (!curTurntable) {
      return null;
    }
    const isFree = this.curTurntable.freeSpinCount > 0;

    const config = getCoinConfig(curTurntable.coin);
    return {
      isFree,
      ...config,
      txtFee: isFree ? '' : config.format(Number(curTurntable.amount)),
    };
  }

  get normalFee() {
    const curTurntable = this.curTurntable;
    if (!curTurntable) {
      return null;
    }
    const config = getCoinConfig(curTurntable.coin);
    return config.format(Number(curTurntable.amount));
  }

  get curTurntable() {
    const list = this.VTurntableList;
    if (!list) {
      return null;
    }
    const curTabType = this.curTabType;
    return list.find((item) => item.luckyWheelType === curTabType);
  }

  get imgTurntableTitle() {
    return webpFilter(
      this.$ss.getters.translateImage({
        en: require('@/assets/turntable3/GoldWheel.png?webp'),
        id: require('@/assets/turntable3/RodaEmas.png?webp'),
      })
    );
  }
  //#endregion

  //#region Ruledlg
  isRuleDlgShow = false;
  onShowRuleDlg() {
    this.isRuleDlgShow = true;
  }

  //#endregion

  //#region

  get isTuranableAble() {
    return this.curTurntable != null;
  }
  isNoGoldDlgShow = false;
  isWheeling = false;

  isTurned?: boolean;
  async onTurnClick() {
    if (this.isWheeling || !this.isTuranableAble) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('turn', 2)) {
      return;
    }
    const curTurntable = this.curTurntable;
    this.$tracev('click_game_luckywheel', {
      checkin_tab: curTurntable.luckyWheelType,
      free_spincount: curTurntable.freeSpinCount + '',
    });
    // if (curTurntable.freeSpinCount <= 0 && this.VRightStat) {
    //   //
    //   if (curTurntable.coin === 'GOLD') {
    //     if (
    //       Number(curTurntable.amount) > Number(this.VRightStat.goldTotalAmount)
    //     ) {
    //       this.isNoGoldDlgShow = true;
    //       return;
    //     }
    //   }
    // }
    this.isWheeling = true;
    // showLoading_bridge();
    this.$refs.turntable.prepareTurn();
    const res = await luckyWheelSpinUserLuckyWheelLogController({
      luckyWheelType: curTurntable.luckyWheelType,
    });
    // dismissLoading_bridge();
    const turntableCellIdx = (res.data || 0) - 1;
    const turntableCellItem = curTurntable.items?.[turntableCellIdx];
    this.$tracev('game_result_luckywheel', {
      checkin_tab: curTurntable.luckyWheelType,
      free_spincount: curTurntable.freeSpinCount + '',
      result: res.success ? '1' : '0',
      err_code: res.code + '',
      luckywheel_coins: turntableCellItem?.amount + '',
    });
    if (res.code === 20003) {
      this.isWheeling = false;
      const res = await isShowBankruptcyGiftAndOpen('luckywheel');
      if (res.Result === 1 && res.data) {
        stateItemVActivityHallList.tryUpdate(0);
        stateItemVGamePayGift.tryUpdate(0);
        return;
      } else {
        this.isNoGoldDlgShow = true;
      }
      return;
    }
    if (res.success) {
      this.isTurned = true;
      await this.$refs.turntable.startTurn(turntableCellIdx);
      this.isWheeling = false;
      // //
      // if (curTurntable.freeSpinCount <= 0) {
      //   penetrateGBusOnly('onVUserAssetInfoChanged', {});
      // }
      //
      this.rewardInfo = {
        num: Number(turntableCellItem.amount),
        coin: turntableCellItem.coin as VCoinEnum,
        icon: turntableCellItem.icon,
      };
      this.isRewardGettedShow = true;
      //
      updateRewardsByPropTypes('GOLD');
      //       ，
    } else {
      this.isWheeling = false;
      Toast(res.message);
    }
  }

  //#endregion

  //#region

  rewardInfo: IVGettedRewardDlgInfo = null;

  get rewardList() {
    const rewardInfo = this.rewardInfo;
    if (rewardInfo) {
      return [rewardInfo];
    }
    return [];
  }
  isRewardGettedShow = false;
  onGetRewardClose() {
    this.refreshVTurntableList(0);
  }

  //#endregion

  closeAll() {
    this.isRuleDlgShow = false;
    this.isNoGoldDlgShow = false;
    this.isRewardGettedShow = false;
  }
}
</script>
