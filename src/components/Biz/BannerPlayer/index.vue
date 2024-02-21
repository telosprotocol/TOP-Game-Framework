<template>
  <Swipe
    v-if="hasBanner"
    :autoplay="autoplay"
    class="swipe h-full"
    :class="{
      'rounded-md': !noRadius,
      'bottom-right': indicatorPos === 'bottom-right',
    }"
    :style="
      indicatorPos === 'bottom-right'
        ? {
            '--v-swipe-indicator-left': 'auto',
            '--v-swipe-indicator-bottom': '1rem',
            '--v-swipe-indicator-right': '1rem',
          }
        : {}
    "
    indicator-color="white"
  >
    <SwipeItem
      v-for="(item, idx) in banners"
      :key="idx"
      @click="onSwipeClicked(item)"
    >
      <img
        :src="item.image"
        :alt="getItemTitle(item)"
        class="w-full h-full object-cover"
      />
    </SwipeItem>
  </Swipe>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { getCurrentLang } from '@/init/i18n';
import type { IBannerConfigItem } from '@/store/modules/config/lazyConfigs/tryInitConfigBanner';
import { bannerNavigation } from '@/utils/navigator/index';
import { replaceDeviceInfoHolderForListAsync } from '@/utils/navigator/replaceDeviceInfoHolderForList';
import { Swipe, SwipeItem } from 'vant';
import Vue, { PropType } from 'vue';

import Component from 'vue-class-component';

const BannerPlayerProps = Vue.extend({
  props: {
    banners: {
      type: Array as PropType<IBannerConfigItem[]>,
      default() {
        return [];
      },
    },
    autoplay: {
      type: Number,
      default: 3000,
    },
    noRadius: {
      type: Boolean,
      default: false,
    },
    indicatorPos: {
      type: String,
      default: null, //'bottom-right'
    },
  },
});

/**
 * Banner
 */
@Component({
  components: { Swipe, SwipeItem },
})
export default class BannerPlayer extends BannerPlayerProps {
  get hasBanner() {
    return this.banners && this.banners.length > 0;
  }

  getItemTitle(item: IBannerConfigItem) {
    const titleLocales = item.titleLocales || {};
    return (
      titleLocales[getCurrentLang() || 'en'] ||
      titleLocales.en ||
      item.title ||
      ''
    );
  }

  async onSwipeClicked(item: IBannerConfigItem) {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return; //
    }
    //
    this.$trace('h5-banner-click', {
      type: item.traceType,
      tag: item.traceTag,
      url: item.url,
    });
    if (!item.url) {
      return;
    }
    const [url] = await replaceDeviceInfoHolderForListAsync([item.url]);
    if (url) {
      //
      bannerNavigation({
        url,
        opType: item.opType,
      });
    }
  }
}
</script>
