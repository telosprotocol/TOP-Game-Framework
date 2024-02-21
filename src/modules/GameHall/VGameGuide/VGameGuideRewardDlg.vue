<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask" @click="onCloseClicked"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative bg-contain bg-center bg-no-repeat"
          :style="bgStyle"
        >
          <div class="absolute left-0 right-0 bottom-7 px-7">
            <div
              :style="iconStyle"
              class="bg-contain bg-center bg-no-repeat mx-auto"
            ></div>

            <div
              v-if="txtValue"
              class="text-[26px] text-[#FEF8BF] rubik-black rubik vshadow-stroke-2 shadow-[#AE5100] -mt-5 mb-6 mx-auto text-center"
            >
              {{ txtValue }}
            </div>
            <div
              class="font-rubik font-medium text-base text-[#F9E5FF] text-center px-2 mb-3 leading-5"
            >
              {{ $t('VG.newGuideLuckyTip') }}
            </div>
            <button
              @click="onCloseClicked"
              class="vbutton vbutton--green font-rubik w-full h-11 active:scale-95 mb-3 relative"
            >
              {{ $t('VG.playNow') }}

              <VHandGuide
                :style="
                  $ss.getters.designPxsObjToReal({
                    right: 16,
                    top: 16,
                  })
                "
              >
              </VHandGuide>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { getCoinConfig } from '@/modules/VAssetInfo/VCoin.config';
import { Prop, Watch } from 'vue-property-decorator';
import type { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { convertBgImageStyle } from '@/utils/styles';
import VHandGuide from '@/components/VHandGuide.vue';
@Component({
  components: { VHandGuide },
})
export default class VGameGuideRewardDlg extends mixins(PopupMixin) {
  @Prop({
    type: Object,
    required: false,
  })
  info?: { num: number; coin: VCoinEnum; icon: string };

  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('gamenovice_guidance_reward_exposure');
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('click_gamenovice_guidance_reward');

    this.emitDlgVisible(false);
    this.$emit('close');
  }
  //#endregion
  get iconStyle() {
    let icon = this.info?.icon;
    const style = this.$ss.getters.designPxsObjToReal({
      width: 135,
      height: 135,
    });
    if (!icon) {
      const coin = this.info?.coin;
      if (coin) {
        const config = getCoinConfig(coin as VCoinEnum, this.info?.num);
        icon = config.rewardIcon;
      }
    }

    return convertBgImageStyle(icon, false, style);
  }

  get txtValue() {
    const info = this.info;
    if (!info) {
      return '';
    }
    const coin = info.coin;
    const num = info.num;
    if (!coin || num == null) {
      return '';
    }
    if (coin) {
      const config = getCoinConfig(coin as VCoinEnum, num);
      return '+' + config.format(num);
    }
    return '';
  }
  get bgStyle() {
    return this.$ss.getters.convertBgImageStyle(
      this.$ss.getters.translateImage({
        en: '/online/free_turntable/newturn_rlt_dlg_en.png?webp',
        id: '/online/free_turntable/newturn_rlt_dlg_id.png?webp',
      }),
      true,
      this.$ss.getters.designPxsObjToReal({
        width: 342,
        height: 471,
      })
    );
  }
}
</script>
