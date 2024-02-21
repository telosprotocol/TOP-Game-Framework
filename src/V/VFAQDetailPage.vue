<template>
  <div class="flex flex-col h-screen">
    <HeaderTop
      skin="dark"
      disable-debug
      :design-height="50"
      :bar-background="statusBarColor"
      ><template v-slot:leftIcon="{ goBack }">
        <button
          class="w-[34px] h-[34px] flex items-center justify-center text-white bg-[rgba(0,0,0,0.3)] rounded-[40%] iconfont icon-back text-xl active:scale-95"
          @click="goBack"
        ></button
      ></template>
      <div slot="default" class="tz-ellipsis-break-1 flex-1 text-center px-1">
        {{ title }}
      </div>
    </HeaderTop>
    <main class="flex-1 px-6 py-4">
      <div v-html="content" class="text-base"></div>
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
import VFAQPanel from '@/modules/FAQ/VFAQPanel.vue';
import { tryMergeLocalesForVPrjFAQ } from '@/locales/Page/VPrj/VFAQ/init';
import VFeedbackPanel from '@/modules/FAQ/VFeedbackPanel.vue';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjFAQ(); //
@Component({
  components: { HeaderTop, VFAQPanel, VFeedbackPanel },
})
export default class VFAQDetailPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#914EC9';
  useInited() {
    // console.log('Debug', this.$route.params.title, this.$route);
    return () => {
      //    destroy
    };
  }

  get title() {
    return this.$route.params.title;
  }

  get content() {
    return this.$route.params.content;
  }
}
</script>
