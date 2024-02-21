<template>
  <div>
    <div v-for="item in faqList" :key="item.type" class="mb-4 text-sm">
      <h3 class="robot-bold text-[#9567D1] mb-1">
        {{ item.typeTitle }}
      </h3>
      <div
        v-for="qItem in item.qList"
        :key="qItem.id"
        @click="onQClick(qItem)"
        class="px-4 py-2.5 flex items-center justify-between text-[#333] bg-white rounded-md mb-2"
      >
        <div>{{ qItem.title }}</div>
        <ib class="iconfont icon-right"></ib>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VFAQMixin } from './VFAQ.state';
import type { IVFAQItem } from './VFAQ.state';

import ButtonLockController from '@/controller/ButtonLockController';
import { bannerNavigation } from '@/utils/navigator';
import { BannerOpType } from '@/constants/BannerOpType';
import { ROUTENAME_INAPP_V_FAQ } from '@/constants/localRoutePath';
@Component({
  components: {},
})
export default class VFAQPanel extends mixins(VFAQMixin) {
  onQClick(qItem: IVFAQItem) {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_gamehall_problem_num', {
      problem_typename: qItem.faqType.v,
      problem_type: qItem.faqType.k,
      problem_name: qItem.title,
      problem_num: qItem.id,
      problem_content: qItem.content,
    });
    bannerNavigation({
      url: qItem.content,
      from: ROUTENAME_INAPP_V_FAQ,
      opType: BannerOpType.AppLink,
    });

    // this.$router.push({
    //   name: ROUTENAME_INAPP_V_FAQ_DETAIL,
    //   params: {
    //     title: qItem.title,
    //     content: qItem.content,
    //   },
    //   query: {
    //     backMode: 'back',
    //   },
    // });
  }
}
</script>
