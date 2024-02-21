<template>
  <div class="flex flex-col w-screen h-screen">
    <header class="shrink-0 relative z-0">
      <div
        class="absolute z-0 left-0 right-0 top-0 overflow-hidden"
        :style="
          $ss.getters.designPxsObjToReal({
            height: 220,
          })
        "
      >
        <VPurpleCircleBgUI></VPurpleCircleBgUI>
      </div>
      <div class="h-[50px] flex items-center mx-2 mb-1 relative z-10">
        <button
          class="w-[34px] h-[34px] flex items-center justify-center text-white bg-[rgba(0,0,0,0.3)] rounded-[40%] iconfont icon-back text-xl active:scale-95"
          @click="goBack"
        ></button>
      </div>
      <!-- TabSelect -->
      <div class="h-3 rounded-t-xl bg-[#F1EDF6] relative z-10 -mb-[1px]"></div>
    </header>
    <main class="flex-1 z-20 bg-[#F1EDF6] px-6 py-4 overflow-y-auto">
      <VFAQPanel></VFAQPanel>
    </main>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { VFAQMixin } from '@/modules/FAQ/VFAQ.state';
import VFAQPanel from '@/modules/FAQ/VFAQPanel.vue';
import { tryMergeLocalesForVPrjFAQ } from '@/locales/Page/VPrj/VFAQ/init';
import ButtonLockController from '@/controller/ButtonLockController';
import { goBackForAppBrowser } from '@/js_bridge/appCallJs/onWebviewBack';
import VPurpleCircleBgUI from '@/components/VPurpleCircleBgUI.vue';
import { noop } from 'lodash-es';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjFAQ(); //
@Component({
  components: { VFAQPanel, VPurpleCircleBgUI },
})
export default class VFAQPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  VFAQMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#914EC9';
  useInited() {
    this.refreshVFAQ();
    return noop;
  }

  goBack() {
    if (!ButtonLockController.Instance.tryGetLock('back', 1)) {
      return;
    }
    goBackForAppBrowser();
  }
}
</script>
