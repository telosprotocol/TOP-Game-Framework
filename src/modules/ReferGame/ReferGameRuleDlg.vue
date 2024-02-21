<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>
      <main
        class="relative w-80 p-3 pt-2 pb-6 bg-gradient-to-b from-[#AA76F1] to-[#8153DD] text-[#333333] rounded-xl tz-transel-scaleInOut"
      >
        <h3 class="font-rubik font-bold text-base mb-2 text-white">
          {{ $t('VRG.ruleTitle') }}
        </h3>
        <main class="rounded-xl bg-[#FFFFFF] px-3 text-[14px] text-[#A874F0]">
          <div class="px-1.5 py-5 robot text-[#777]">
            <div v-for="(item, idx) in ruleList" class="mb-1" :key="idx">
              {{ item.text }}
            </div>
          </div>
          <button
            @click="onCloseClicked"
            class="absolute right-1 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            v-webp="require('@/assets/vcommon/close/btnSimpleClose.png?webp')"
          ></button>
        </main>
      </main>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class ReferGameRuleDlg extends mixins(PopupMixin) {
  @Prop({
    type: [String, Number],
    required: false,
  })
  spendThreshold?: string | number;
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      // this.$trace('address_book_writeauth_exposure', {
      //   open_type: from,
      // });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_gamehall_invite_gift_explain');

    this.emitDlgVisible(false);
  }
  //#endregion

  onOKClick() {
    this.$emit('ok');
    this.emitDlgVisible(false);
  }
  onCancelClick() {
    this.$emit('cancel');
    this.emitDlgVisible(false);
  }

  get ruleList() {
    return [
      { text: this.$t('VRG.rule1') },
      {
        text: this.$t('VRG.rule2', {
          spendThreshold: this.spendThreshold ?? '',
        }),
      },
      { text: this.$t('VRG.rule3') },
    ];
  }
}
</script>
