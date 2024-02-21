<template>
  <GameDlgUI
    :value="value"
    @input="emitDlgVisible"
    :img-title="require('@/assets/gameProfile/Atur-nomor-telepon.png')"
  >
    <div style="height: 100px">Test</div>
  </GameDlgUI>
</template>

<script lang="ts">
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import ButtonLockController from '@/controller/ButtonLockController';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import GameDlgUI from './GameDlgUI.vue';
@Component({
  components: {
    GameDlgUI,
  },
})
export default class GameDlgTemplate extends mixins(BaseDlgMixin) {
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    console.log('[DEBUG] onValueChange', isShow);
    if (isShow) {
    }
  }

  //#endregion

  onConfirmClick() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.emitDlgVisible(false);
  }
}
</script>
