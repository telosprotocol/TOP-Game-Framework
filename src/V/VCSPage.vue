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
      <div class="flex items-center mx-2 overflow-auto relative z-10 -mb-[1px]">
        <div
          v-for="item in tabList"
          @click="changeTabIdx(item.idx)"
          :key="item.idx"
          class="flex-1 mx-1 h-10 items-center justify-center flex rounded-t-md border-0.5 border-solid p-0.5 px-1 border-b-0 text-center leading-3 text-[13px]"
          :class="{
            'bg-[#F1EDF6] border-white text-[#9567D1] robot-bold':
              item.idx === curTabIdx,
            'bg-[#A46DD2] border-[rgba(255,255,255,0.5)] text-[rgba(255,255,255,0.8)]':
              item.idx !== curTabIdx,
          }"
        >
          {{ item.title }}
        </div>
      </div>
      <div class="h-3 rounded-t-xl bg-[#F1EDF6] relative z-10 -mb-[1px]"></div>
    </header>
    <main class="flex-1 z-20 bg-[#F1EDF6] px-6 overflow-y-auto">
      <OnlineCSPanel v-if="curTabIdx === 1"></OnlineCSPanel>
      <VFeedbackPanel v-if="curTabIdx === 0"></VFeedbackPanel>
    </main>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjFAQ } from '@/locales/Page/VPrj/VFAQ/init';
import VFeedbackPanel from '@/modules/FAQ/VFeedbackPanel.vue';
import ButtonLockController from '@/controller/ButtonLockController';
import { goBackForAppBrowser } from '@/js_bridge/appCallJs/onWebviewBack';
import VPurpleCircleBgUI from '@/components/VPurpleCircleBgUI.vue';
import OnlineCSPanel from '@/modules/FAQ/OnlineCSPanel.vue';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjFAQ(); //
@Component({
  components: { VFeedbackPanel, VPurpleCircleBgUI, OnlineCSPanel },
})
export default class VCSPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#914EC9';
  useInited() {
    if (this.tab === 'cs') {
      this.curTabIdx = 1;
    } else {
      this.curTabIdx = 0;
    }
    return () => {
      //    destroy
    };
  }

  get tab() {
    return this.$route.query.tab;
  }

  goBack() {
    if (!ButtonLockController.Instance.tryGetLock('back', 1)) {
      return;
    }
    goBackForAppBrowser();
  }
  curTabIdx = 0;
  changeTabIdx(idx: number) {
    this.curTabIdx = idx;
    if (idx === 1) {
      this.$tracev('click_gamehall_onlinecs');
    } else if (idx === 0) {
      this.$tracev('click_gamehall_feedback');
    }
  }

  get tabList() {
    const list = [
      { title: this.$t('VFAQ.Feedback'), idx: 0 },
      { title: this.$t('VFAQ.OnlineCS'), idx: 1 },
    ];
    return list;
  }
}
</script>
