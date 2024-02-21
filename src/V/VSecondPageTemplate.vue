<template>
  <div>
    <HeaderTop left-icon="icon-back" :bar-background="statusBarColor">
      <div slot="default">VSecondPageTemplate</div>
      <template slot="right">
        <button
          class="w-[30px] h-[30px] flex items-center justify-center -mr-1 active:scale-95"
        >
          <div
            class="w-7 h-7 box-content bg-contain bg-center bg-no-repeat"
            v-webp="require('@/assets/vcommon/CoinVToken.png?webp')"
          ></div>
        </button>
      </template>
    </HeaderTop>
    <main>OtherInfo</main>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
// import { tryMergeLocalesForVPrjCheckin } from '@/locales/Page/VPrj/VC/init';
tryMergeLocalesForVPrjCommon();

// tryMergeLocalesForVPrjCheckin();//
@Component({
  components: { HeaderTop },
})
export default class VSecondPageTemplate extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#ffffff';
  useInited() {
    return () => {
      //    destroy
    };
  }
}
</script>
