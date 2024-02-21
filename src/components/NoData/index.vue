<template>
  <div class="nodata">
    <div class="img" :style="imgStyle"></div>
    <slot>{{ $t('Base.NoData') }}</slot>
  </div>
</template>

<script lang="ts">
import { convertBgImageStyle } from '@/utils/styles';
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { webpFilter } from '@/directives/webp';

const IMG_NODATA = require('@/assets/illustration/common-empty.png?webp');

const IMG_DEFAULT = require('@/assets/illustration/default.png?webp');

export const IMG_NODATA_WEBP = webpFilter(IMG_NODATA);
export const IMG_DEFAULT_WEBP = webpFilter(IMG_DEFAULT);
const NoDataProp = Vue.extend({
  props: {
    img: {
      type: String,
      default: null,
    },
    //      img,
    type: {
      type: String as PropType<'default' | 'nodata'>,
      default: 'nodata',
    },
  },
});
@Component({})
export default class NoData extends NoDataProp {
  get imgStyle() {
    let url = this.img;
    if (!url) {
      switch (this.type) {
        case 'default':
          url = IMG_DEFAULT_WEBP;
          break;
        case 'nodata':
          url = IMG_NODATA_WEBP;
          break;
      }
    }
    return convertBgImageStyle(url);
  }
}
</script>

<style lang="less" scoped>
.nodata {
  position: relative;
  padding: 48px 16px;
  color: #999;
  color: #999;
  font-size: 1;
  line-height: 1.333;
  text-align: center;
}
.img {
  top: 0;
  width: 160px;
  height: 120px;
  margin: auto auto 32px auto;
  background-size: 100% auto;
}
</style>
