<template>
  <VReferMoneyTipDlgUI
    :value="value"
    v-bind="$attrs"
    @input="$emit('input', $event)"
  >
    <section
      class="text-xs leading-5 robot-bold"
      v-for="item in pList"
      :key="item.idx"
      :class="{ 'mb-5': item.idx < 3 }"
    >
      <h3 class="text-[14px] mb-2">{{ item.title }}</h3>
      <div
        class="text-[#333]"
        v-for="(descItem, idx) in item.descList"
        :key="idx"
        v-html="descItem"
      ></div>
      <div
        v-if="item.idx === 2"
        class="text-[#FC54A5] text-2xl font-rubik font-bold px-1 relative inline-block"
      >
        <div
          class="absolute left-0 right-0 bg-[red] h-1.5 bottom-2 rounded-full bg-gradient-to-l from-[#FF7DF2] to-[#FFF383]"
        ></div>
        <div class="relative">
          {{ $t('VRM.soEasy') }}
        </div>
      </div>
    </section>
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
export default class VReferMoneyInviteStepDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$trace('landingpage_invitefriend_exposure');
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    // closeDlg
    this.emitDlgVisible(false);
  }
  //#endregion
  get pList() {
    return [
      {
        title: this.$t('VRM.step1'),
        descList: [
          this.$t('VRM.step1p1'),
          this.$t('VRM.step1p2'),
          this.$t('VRM.step1p3'),
        ],
        idx: 1,
      },
      {
        title: this.$t('VRM.step2'),
        descList: [
          this.$t('VRM.step2p1'),
          this.$t('VRM.step2p2'),
          this.$t('VRM.step2p3'),
        ],
        idx: 2,
      },
      {
        title: this.$t('VRM.step3'),
        descList: [this.$t('VRM.step3p1'), this.$t('VRM.step3p2')],
        idx: 3,
      },
    ] as { title: string; descList: string[]; idx: number }[];
  }
}
</script>
