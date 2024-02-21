<template>
  <Swipe
    @change="onChange"
    v-if="bannerList.length > 0"
    :style="{ width: bannerSize.width }"
  >
    <SwipeItem v-for="item in bannerList" :key="item.idx">
      <div
        class="bg-center bg-contain bg-no-repeat"
        :style="item.bannerStyle"
        @click="onBannerClick(item, 'click_school_center_banner')"
      ></div>
    </SwipeItem>
    <div class="flex justify-center pt-2" slot="indicator">
      <template>
        <div
          v-for="tabItem in bannerList"
          :key="tabItem.idx"
          class="rounded-full h-[9px] mx-[3px] transition-all"
          :class="{
            'bg-[#9567D1] flex items-center justify-center before:w-2 before:h-2 before:rounded-full  w-7':
              tabItem.idx === curIdx,
            'bg-[#DEDEDE]  w-[9px]': tabItem.idx !== curIdx,
          }"
        ></div>
      </template>
    </div>
  </Swipe>
</template>
<script lang="ts">
import { Swipe, SwipeItem } from 'vant';

import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';

import { Mixins, Watch } from 'vue-property-decorator';
import { createOrGetVBannerListMixin } from '@/modules/VBannerBase/vbanner.factory';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';

@Component({
  components: {
    Swipe,
    SwipeItem,
  },
})
export default class AcademyBanner extends Mixins(
  BindEventMixinDefault,
  createOrGetVBannerListMixin('COLLEGE_CENTER')
) {
  useInited() {
    this.refreshVBannerList();
    return noop;
  }
  get bannerSize() {
    return this.$ss.getters.designPxsObjToReal({
      width: 328,
      height: 108,
    });
  }

  get bannerList() {
    return (this.BannerList || []).map((item, idx) => {
      return {
        idx,
        ...item,
        bannerStyle: convertBgImageStyle(item.imageUrl, false, this.bannerSize),
      };
    });
  }

  curIdx = 0;
  onChange(index: number) {
    this.curIdx = index;
  }

  get curExposeStr() {
    const bannerList = this.bannerList;
    const bannerItem = bannerList[this.curIdx];
    if (!bannerItem) {
      return '';
    }
    return bannerItem.id;
  }

  @Watch('curExposeStr', { immediate: true })
  onExposeChange() {
    const bannerList = this.bannerList;
    const bannerItem = bannerList[this.curIdx];
    if (bannerItem) {
      this.tryTraceBannerExpose(bannerItem, 'school_center_banner_exposure');
    }
  }
}
</script>
