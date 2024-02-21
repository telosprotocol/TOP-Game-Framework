<template>
  <GameDlgUI
    :value="value"
    @input="emitDlgVisible"
    :img-title="require('@/assets/gameProfile/WSP.png')"
  >
    <main>
      <div class="flex flex-col items-center">
        <div
          class="bg-center bg-contain bg-no-repeat mt-3"
          :style="dstIntroStyle"
        ></div>
        <h3 class="font-robot-bold font-bold text-xl mb-3">
          {{ $t('VG.introDST') }}
        </h3>
      </div>
      <section class="rounded-md px-2.5 text-[14px] leading-4 overflow-auto">
        <div
          :class="{ 'mb-2': idx < ruleList.length - 1 }"
          v-for="(item, idx) in ruleList"
          :key="item"
        >
          {{ $t(item) }}
        </div>
      </section>
    </main>
  </GameDlgUI>
</template>
<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import GameDlgUI from '../UI/GameDlgUI.vue';
@Component({
  components: { GameDlgUI },
})
export default class VIntroDSTDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
  }
  //#endregion

  get dstIntroStyle() {
    return this.$ss.getters.normalizeCss(
      {
        width: 120,
        height: 109,
      },
      require('@/assets/gameProfile/iconDSTIntro.png?webp'),
      true
    );
  }

  get ruleList() {
    return ['VG.introDSTContent[0]', 'VG.introDSTContent[1]'];
  }
}
</script>
