<template>
  <div
    :style="bannerSizeStyle"
    v-if="bannerList && bannerList.length > 0"
    class="mx-auto"
  >
    <Swipe
      @change="onChange"
      class="w-full h-full"
      indicator-color="#fff"
      :style="{
        '--v-swipe-indicator-bottom': '0.5rem',
      }"
    >
      <SwipeItem v-for="item in bannerList" :key="item.id">
        <div
          class="bg-center bg-[length:100%_auto] bg-no-repeat"
          :style="item.bannerStyle"
          @click="onBannerClick(item, 'click_playearn_new_banner')"
        ></div>
      </SwipeItem>
    </Swipe>
  </div>
</template>

<script lang="ts">
import { Swipe, SwipeItem } from 'vant';
import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';
import { Mixins, Watch } from 'vue-property-decorator';
import { noop } from 'lodash-es';
import { createOrGetVBannerListMixin } from '@/modules/VBannerBase/vbanner.factory';
import BindEventMixinDefault from '@/mixins/BindEventMixin';

@Component({
  components: { Swipe, SwipeItem },
})
export default class VPlayEarnNewbieBanner extends Mixins(
  BindEventMixinDefault,
  createOrGetVBannerListMixin('GAME_PLAYER_CENTER_NOVICE')
) {
  useInited() {
    this.refreshVBannerList();
    return noop;
  }
  get bannerSizeStyle() {
    return this.$ss.getters.designPxsObjToReal({
      width: 328,
      height: 108,
    });
  }
  get bannerList() {
    //||
    return (this.BannerList || []).map((item, idx) => {
      return {
        ...item,
        idx,
        bannerStyle: convertBgImageStyle(
          item.imageUrl,
          false,
          this.bannerSizeStyle
        ),
      };
    });
  }

  // @Watch('bannerList')
  // onBannerListChange(bannerList) {
  //   console.log('[Debug]', 'bannerListChange', bannerList);
  // }
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
    return this.getBannerUniqueKey(bannerItem);
  }

  @Watch('curExposeStr', { immediate: true })
  onExposeChange() {
    const bannerList = this.bannerList;
    const bannerItem = bannerList[this.curIdx];
    if (bannerItem) {
      this.tryTraceBannerExpose(
        bannerItem,
        'playearn_new_banner_exposure',
        '1'
      );
    }
  }
}
</script>
