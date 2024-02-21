<template>
  <VReferMoneyTipDlgUI
    :value="value"
    v-bind="$attrs"
    @input="$emit('input', $event)"
  >
    <h3 class="font-rubik font-semibold text-lg mb-3 text-[#333]">
      {{ $t('VRM.rule') }}
    </h3>
    <main class="px-3 text-[14px] text-[#333]">
      <div class="mb-1" v-for="(item, idx) in ruleList" :key="idx">
        {{ item }}
      </div>
    </main>
  </VReferMoneyTipDlgUI>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import VReferMoneyTipDlgUI from './VReferMoneyTipDlgUI.vue';
@Component({
  components: { VReferMoneyTipDlgUI },
})
export default class VReferTeamRuleDlg extends mixins(PopupMixin) {
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

    this.emitDlgVisible(false);
  }
  //#endregion

  get ruleList() {
    return Array.from({ length: 5 }).map((_, idx) => {
      return this.$t('VRM.ruleP' + (idx + 1));
    });
  }
}
</script>
