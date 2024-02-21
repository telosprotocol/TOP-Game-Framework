<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask" @click="onCloseClicked"></div>

      <div
        class="relative rounded-[20px] w-[312px] bg-gradient-to-b from-[#F7D34A] to-[#FEF9DC] p-1 tz-transel-scaleInOut"
      >
        <main
          class="rounded-[20px] bg-gradient-to-b from-[#60286D] to-[#232358] pt-10 pb-4 min-h-full flex items-center justify-center flex-col text-white"
        >
          <HiggsHeaderSimpleUI
            :title="$t('V_HG.exception')"
            @close="onCloseClicked"
          ></HiggsHeaderSimpleUI>
          <div
            class="text-center font-rubik font-medium px-4 text-sm mb-3 mx-6"
          >
            {{ $t('V_HG.oppsP1') }}
          </div>
          <div
            class="bg-contain bg-center bg-no-repeat mb-4"
            :style="
              $ss.getters.convertBgImageStyle(
                $ss.getters.translateImage({
                  en: '/online/higgs/higgsRedeemUsedUpBlock.png?webp',
                }),
                true,
                $ss.getters.designPxsObjToReal({
                  width: 281,
                  height: 199,
                })
              )
            "
          ></div>
          <div
            class="bg-[rgba(113,78,153,0.5)] font-rubik font-semibold leading-4 text-xs rounded-full px-6 py-2 mx-6"
          >
            {{ $t('V_HG.oppsBottom') }}
          </div>
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
import { Watch } from 'vue-property-decorator';

import HiggsHeaderSimpleUI from './HiggsHeaderSimpleUI.vue';

@Component({
  components: { HiggsHeaderSimpleUI },
})
export default class HiggsRedeemOppsDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('higgs_coin_reedem_stockslow_exposure');
    } else {
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_higgs_coin_reedem_stockslow');

    this.emitDlgVisible(false);
  }
  //#endregion
}
</script>
