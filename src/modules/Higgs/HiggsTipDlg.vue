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
          class="rounded-[20px] bg-gradient-to-b from-[#60286D] to-[#232358] pt-10 pb-8 min-h-full px-6 flex items-center justify-center flex-col"
        >
          <HiggsHeaderSimpleUI
            :title="$t('Base.Tips')"
            @close="onCloseClicked"
          ></HiggsHeaderSimpleUI>
          <h3
            class="text-sm font-rubik font-extrabold vgradient-text-outline leading-4 my-2 mx-6 text-center"
            :date-text="msg"
          >
            {{ msg }}
          </h3>
          <button
            @click="onCloseClicked"
            class="h-8 w-[100px] rounded-full font-rubik font-bold box-content border text-white border-[#C3711E] vshadow-stroke shadow-[#B14A01] flex items-center justify-center active:scale-95 mx-auto mt-4"
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
import HiggsHeaderSimpleUI from './HiggsHeaderSimpleUI.vue';
import { Prop } from 'vue-property-decorator';

@Component({
  components: { HiggsHeaderSimpleUI },
})
export default class HiggsTipDlg extends mixins(PopupMixin) {
  @Prop({
    type: String,
  })
  msg: string;
  //#region Dlg Basic Setting
  dlgSound = true;

  //
  // @Watch('value')
  // onValueChange(isShow: boolean) {
  //   if (isShow) {
  //   } else {
  //   }
  // }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
  }
  //#endregion
}
</script>
