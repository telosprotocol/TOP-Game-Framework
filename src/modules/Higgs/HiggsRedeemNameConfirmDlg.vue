<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-if="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative rounded-[20px] w-[312px] bg-gradient-to-b from-[#F7D34A] to-[#FEF9DC] p-1"
        >
          <main
            class="rounded-[20px] bg-gradient-to-b from-[#60286D] to-[#232358] pt-10 pb-8 min-h-full px-6 flex items-center justify-center flex-col"
          >
            <HiggsHeaderSimpleUI
              :title="$t('V_HG.guideConfirmTitle')"
              @close="onCloseClicked"
            ></HiggsHeaderSimpleUI>
            <h3
              class="text-sm font-rubik font-extrabold leading-4 mb-3 text-center text-white mx-2"
            >
              {{ $t('V_HG.guideConfirmDesc') }}
            </h3>
            <div class="flex items-center justify-between w-full">
              <button
                @click="onCancelClick"
                class="h-8 w-[100px] rounded-full font-rubik font-bold box-content text-white bg-[#674597] flex items-center justify-center active:scale-95 mx-auto mt-4 text-sm"
              >
                {{ $t('Base.Cancel') }}
              </button>
              <button
                @click="onConfirmClick"
                class="h-8 w-[100px] rounded-full font-rubik font-bold box-content border text-white border-[#C3711E] vshadow-stroke shadow-[#B14A01] flex items-center justify-center active:scale-95 mx-auto mt-4 text-sm"
                :style="{
                  background:
                    'linear-gradient(180deg, #FC7700 0%, #FB7400 26%, #FB6800 48%, #FB6B00 72%, #FFCCA5 100%)',
                }"
              >
                {{ $t('Base.Confirm') }}
              </button>
            </div>
          </main>
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
import { Prop, Watch } from 'vue-property-decorator';
import HiggsHeaderSimpleUI from './HiggsHeaderSimpleUI.vue';

@Component({
  components: { HiggsHeaderSimpleUI },
})
export default class HiggsRedeemNameConfirmDlg extends mixins(PopupMixin) {
  @Prop({
    type: String,
  })
  taskId: string;
  //#region Dlg Basic
  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('higgs_coin_reedem_guide_write_exposure');
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_higgs_coin_reedem_guide_write');
    this.$emit('close', { isContinue: true });
    this.emitDlgVisible(false);
  }
  //#endregion

  onConfirmClick() {
    this.$emit('close', { isContinue: false });
    this.emitDlgVisible(false);
  }

  onCancelClick() {
    this.$emit('close', { isContinue: true });
    this.emitDlgVisible(false);
  }
}
</script>
