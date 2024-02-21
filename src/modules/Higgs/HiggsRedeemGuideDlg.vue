<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask" @click="onCloseClicked"></div>

      <div
        class="relative rounded-[20px] w-[312px] bg-gradient-to-b from-[#F7D34A] to-[#FEF9DC] p-1 tz-transel-scaleInOut mt-6"
      >
        <main
          class="rounded-[20px] bg-gradient-to-b from-[#60286D] to-[#232358] pt-10 pb-4 min-h-full flex items-center justify-center flex-col text-white"
        >
          <HiggsHeaderSimpleUI
            :title="$t('V_HG.redeemGuideTitle')"
            @close="onCloseClicked"
          ></HiggsHeaderSimpleUI>
          <div
            class="text-center font-rubik font-medium px-4 text-sm mb-2 mx-6"
          >
            {{ $t('V_HG.redeemGuideTip') }}
          </div>
          <div
            class="bg-contain bg-center bg-no-repeat mb-3"
            :style="
              $ss.getters.convertBgImageStyle(
                $ss.getters.translateImage({
                  en: require('@/assets/higgs/redeemGuide-en.png?webp'),
                  id: require('@/assets/higgs/redeemGuide-id.png?webp'),
                }),
                true,
                $ss.getters.designPxsObjToReal({
                  width: 268,
                  height: 326,
                })
              )
            "
          ></div>
          <button
            @click="onOkClick"
            class="h-8 w-[100px] rounded-full font-rubik font-bold box-content border text-white border-[#C3711E] vshadow-stroke shadow-[#B14A01] flex items-center justify-center text-sm active:scale-95 mx-auto mt-2"
            :style="{
              background:
                'linear-gradient(180deg, #FC7700 0%, #FB7400 26%, #FB6800 48%, #FB6B00 72%, #FFCCA5 100%)',
            }"
          >
            {{ $t('Base.OK') }}
          </button>
        </main>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';

import HiggsHeaderSimpleUI from './HiggsHeaderSimpleUI.vue';

@Component({
  components: { HiggsHeaderSimpleUI },
})
export default class HiggsRedeemGuideDlg extends mixins(PopupMixin) {
  @Prop({
    type: String,
  })
  from: 'first_new' | 'exchange';
  //#region Dlg BasicSetting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('higgs_coin_reedem_guide_exposure');
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_higgs_coin_reedem_guide', {
      open_source: this.from,
    });
    this.emitDlgVisible(false);
  }
  //#endregion

  onOkClick() {
    this.$tracev('click_higgs_coin_reedem_guide_exchange', {
      open_source: this.from,
    });
    this.emitDlgVisible(false);
  }
}
</script>
