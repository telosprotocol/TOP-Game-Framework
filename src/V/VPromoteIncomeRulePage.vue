<template>
  <div class="h-screen flex flex-col">
    <HeaderTop
      left-icon="icon-back"
      skin="dark"
      :bar-background="statusBarColor"
      left-icon-event="close_invite_grade_slide"
    >
      <div
        slot="default"
        class="text-center flex-1 font-rubik font-bold font-base leading-5"
      >
        {{ $t('VPI.gameLevel_rt_rtl_desc') }}
      </div>
      <template slot="right">
        <button class="w-[30px] h-[30px]"></button>
      </template>
    </HeaderTop>
    <main
      class="flex-1 bg-gradient-to-b overflow-auto from-[#9363D1] to-[#8153DD]"
    >
      <VPromoteIncomeDesc></VPromoteIncomeDesc>
    </main>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjPromoteIncome } from '@/locales/Page/VPrj/VPI/init';
import VPromoteIncomeDesc from '@/modules/VPromoteIncome/VPromoteIncomeDesc.vue';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjPromoteIncome();

@Component({
  components: { HeaderTop, VPromoteIncomeDesc },
})
export default class VPromoteIncomeRulePage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#9363D1';
  useInited() {
    this.$tracev('invite_grade_slide_exposure', {});

    return () => {
      //    destroy
    };
  }
}
</script>
