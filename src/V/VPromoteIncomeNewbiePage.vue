<template>
  <div>
    <HeaderTop
      left-icon="icon-back"
      :bar-background="statusBarColor"
      :left-icon-click="onGoBack"
      :title="$t('VPIN.title')"
    >
    </HeaderTop>
    <section class="bg-gradient-to-b from-[#F6F2FC] to-[#F3E0FF] pb-4">
      <VPromoteIncomeHeadBlock></VPromoteIncomeHeadBlock>
    </section>
    <section
      class="bg-gradient-to-b from-[#F3E0FF] to-[#F4E2FF]"
      :style="$ss.getters.designPxsObjToReal({ paddingBottom: 56 })"
    >
      <VPromoteIncomeChatBlock class="mx-4 mb-5"></VPromoteIncomeChatBlock>
      <VPromoteIncomeIncomeSourceBlock
        class="mx-4 mb-5"
      ></VPromoteIncomeIncomeSourceBlock>
      <VPromoteIncomeArticleBlock
        class="mx-4 mb-3"
      ></VPromoteIncomeArticleBlock>
    </section>
    <div class="px-4 left-0 right-0 pb-4 fixed bottom-0 z-10">
      <i18n
        tag="button"
        path="VPIN.goToDetailText"
        @click="goToDetail"
        class="bg-gradient-to-r from-[#F767FF] to-[#C587FF] h-10 w-full rounded-[10px] flex items-center justify-center text-white text-[18px] font-rubik font-bold shadow-md active:scale-95 relative z-0"
      >
        <span
          class="vgradient-text-outline ml-1"
          :data-text="$t('VPIN.goToDetailValue')"
          :style="{
            '--v-color-from': '#FFFEF8',
            '--v-color-to': '#FFC01D',
            '--tz-shadow-from': '#C587FF',
            '--tz-shadow-to': '#84009A',
          }"
          >{{ $t('VPIN.goToDetailValue') }}</span
        >
      </i18n>
      <VHandGuide
        :style="
          $ss.getters.designPxsObjToReal({
            right: -12,
            bottom: -14,
            transform: 'scale(0.8)',
          })
        "
      >
      </VHandGuide>
    </div>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';

import { tryMergeLocalesForVPrjPromoteIncomeNewbie } from '@/locales/Page/VPrj/VPIN/init';
import VPromoteIncomeHeadBlock from '@/modules/PromoteIncomeNewbie/VPromoteIncomeHeadBlock.vue';
import VPromoteIncomeChatBlock from '@/modules/PromoteIncomeNewbie/VPromoteIncomeChatBlock.vue';
import VPromoteIncomeIncomeSourceBlock from '@/modules/PromoteIncomeNewbie/VPromoteIncomeIncomeSourceBlock.vue';
import VPromoteIncomeArticleBlock from '@/modules/PromoteIncomeNewbie/VPromoteIncomeArticleBlock.vue';
import ButtonLockController from '@/controller/ButtonLockController';
import { ROUTEPATH_V_PROMOTE_INCOME } from '@/constants/localRoutePath';
import { close_bridge } from '@/js_bridge/js_call_app_base';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import { getInvitePageUrl } from '@/modules/vRedirect';
import { overideOnWebviewBack } from '@/js_bridge/appCallJs/onWebviewBack';
import { getFirstString } from '@/utils/string';
import VHandGuide from '@/components/VHandGuide.vue';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjPromoteIncomeNewbie();
@Component({
  components: {
    HeaderTop,
    VPromoteIncomeHeadBlock,
    VPromoteIncomeChatBlock,
    VPromoteIncomeIncomeSourceBlock,
    VPromoteIncomeArticleBlock,
    VHandGuide,
  },
})
export default class VPromoteIncomeNewbiePage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#F6F2FC';
  useInited() {
    return overideOnWebviewBack(() => {
      //
      this.onGoBack();
      return false;
    });
  }

  onGoBack() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    if (this.$route.query.from === 'income') {
      //
      close_bridge();
    } else {
      this.$router.replace(ROUTEPATH_V_PROMOTE_INCOME);
    }
  }

  goToDetail() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_get_2000pr');
    openAppH5LinkPreferLocal(
      getInvitePageUrl(
        'promote_earn',
        getFirstString(
          this.$route.query.from || this.$route.query.initialfrom || ''
        )
      ),
      {}
    );
  }
}
</script>
