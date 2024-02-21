<template>
  <transition name="tz-transwrap" :duration="250">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>
      <div class="z-10 mt-4 relative">
        <main class="tz-transel-scaleInOut">
          <Turntable
            ref="turntable"
            type="FREE"
            :info="curTurntable"
            :img-title="imgTitle"
            class="mx-auto"
          ></Turntable>
          <ButtonSpinUI
            :is-turanable-able="isTuranableAble"
            @click.native="onTurnClick"
          >
          </ButtonSpinUI>
        </main>
        <!-- GuideMask -->
        <section>
          <div
            class="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-20"
            v-if="isMaskShow"
            @click="onMaskClick"
          ></div>
          <div class="absolute left-0 right-0 bottom-0 z-30" v-if="isMaskShow">
            <ButtonSpinUI
              :is-turanable-able="isTuranableAble"
              @click.native="onTurnClick"
            >
              <VHandGuide
                :style="
                  $ss.getters.designPxsObjToReal({
                    right: 16,
                    bottom: -36,
                  })
                "
              ></VHandGuide>
            </ButtonSpinUI>
          </div>
        </section>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import PopupMixin from '@/components/Modal/PopupMixin';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';

import Turntable from '@/modules/Turntable/Turntable.vue';
import { Toast } from 'vant';
import type { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import VHandGuide from '@/components/VHandGuide.vue';
import ButtonSpinUI from '@/modules/Turntable/ButtonSpinUI.vue';
import { webpFilter } from '../../../directives/webp';
import { luckyWheelSpinUserLuckyWheelLogController } from '@/vservices/client/UserLuckyWheelLogController';
import { updateRewardsByPropTypes } from '@/modules/VAssetInfo/VAsset.utils';

@Component({
  components: {
    Turntable,
    VHandGuide,
    ButtonSpinUI,
  },
})
export default class VGameGuideTurntable extends mixins(
  PopupMixin,
  VUserAccountMixin
) {
  $refs!: {
    turntable: Turntable;
  } & typeof PopupMixin.prototype.$refs;
  //#region Dlg Basic Setting

  isMaskShow = true;

  @Prop({
    type: Boolean,
  })
  isLoading: boolean;
  @Watch('value')
  async onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('gamenovice_guidance_turntable_exposure');
      this.isMaskShow = true;
      // showLoading_bridge();
      this.isTurned = false;
      // this.isLoading = true;
      // const res = await luckWheelUserLuckyWheelLogController({
      //   luckyWheelType: 'FREE',
      // });
      // this.isLoading = false;
      // dismissLoading_bridge();
      // if (!res.success) {
      //   Toast(res.message);
      //   //TODO     
      // } else {
      //   this.curTurntable = res.data;
      // }
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

  @Prop({
    type: Object,
    required: false,
  })
  curTurntable: API.LuckyWheelVO;

  get isLoadError() {
    return this.isLoading === false && !this.curTurntable;
  }

  onMaskClick() {
    if (this.isLoadError) {
      this.emitDlgVisible(false);
    }
  }
  get imgTitle() {
    return webpFilter(require('@/assets/turntable3/lucky-wheel.png?webp'));
  }

  //#region  

  get isTuranableAble() {
    return this.curTurntable != null;
  }
  isNoGoldDlgShow = false;
  isWheeling = false;

  isTurned?: boolean;
  async onTurnClick() {
    if (this.isLoadError) {
      //  ， 
      this.emitDlgVisible(false);
      return;
    }
    if (this.isWheeling || !this.isTuranableAble) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('turn', 2)) {
      return;
    }

    this.isMaskShow = false;
    const curTurntable = this.curTurntable;
    this.$tracev('click_gamenovice_guidance_turntable', {
      // turntable_coins: curTurntable.amount,
    });
    this.isWheeling = true;
    // showLoading_bridge();
    this.$refs.turntable.prepareTurn();
    const res = await luckyWheelSpinUserLuckyWheelLogController({
      luckyWheelType: curTurntable.luckyWheelType,
    });
    const turntableCellIdx = (res.data || 0) - 1;
    const turntableCellItem = curTurntable.items?.[turntableCellIdx];
    this.$tracev('game_result_luckywheel', {
      checkin_tab: curTurntable.luckyWheelType,
      free_spincount: curTurntable.freeSpinCount + '',
      result: res.success ? '1' : '0',
      err_code: res.code + '',
      luckywheel_coins: turntableCellItem?.amount + '',
    });
    if (res.success) {
      this.isTurned = true;
      await this.$refs.turntable.startTurn(turntableCellIdx);
      // dismissLoading_bridge();
      this.isWheeling = false;
      //  
      this.refreshVUserAccount(0);
      //  
      // this.rewardInfo = {};
      // this.isRewardGettedShow = true;
      updateRewardsByPropTypes('GOLD');
      this.$emit('success', {
        num: Number(turntableCellItem.amount),
        coin: turntableCellItem.coin as VCoinEnum,
        icon: turntableCellItem.icon,
      });
      this.emitDlgVisible(false);
    } else {
      this.isWheeling = false;
      Toast(res.message);
    }
  }

  //#endregion
}
</script>
