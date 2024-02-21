<template>
  <GameDlgSimpleUI :value="value" @input="emitDlgVisible">
    <div class="-m-1 mt-0">
      <div class="text-center robot text-[15px] leading-tight mb-3">
        {{ $t('VG.changeNameConfirmTip') }}
      </div>

      <div class="flex items-center justify-between">
        <button
          @click="onCancelClick"
          class="flex-1 vbtn vbtn--danger mr-0.5 active:scale-95"
        >
          {{ $t('Base.Cancel') }}
        </button>
        <button
          class="flex-1 vbtn vbtn--primary active:scale-95"
          @click="onConfirmClick"
        >
          {{ $t('Base.OK') }}
        </button>
      </div>
    </div>
  </GameDlgSimpleUI>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import GameDlgSimpleUI from '@/modules/UI/GameDlgSimpleUI.vue';
import Component, { mixins } from 'vue-class-component';
@Component({
  components: { GameDlgSimpleUI },
})
export default class VGameNickNameConfirm extends mixins(PopupMixin) {
  dlgSound = true;
  onConfirmClick() {
    this.$emit('confirm');
    this.emitDlgVisible(false);
  }

  onCancelClick() {
    this.$emit('cancel');
    this.emitDlgVisible(false);
  }
}
</script>
