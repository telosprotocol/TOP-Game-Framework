<template>
  <img :src="realSrc" ref="img" @error="errorCb" v-bind="$attrs" />
</template>

<script lang="ts">
//  <FallbackImage
//       :src="imageUrl"
//       :fallback="require('@/xxx')"
//       loading="lazy"
//     ></FallbackImage>
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
@Component
export default class FallbackImage extends Vue {
  @Prop({
    type: String,
    default: undefined,
  })
  src: string;

  @Prop({
    type: String,
    default: undefined,
  })
  fallback: string;

  @Prop({
    type: Number,
    default: 3,
  })
  maxRetryCount: number;

  loadErrCount = 0;

  @Watch('src')
  onSrcChanged() {
    this.loadErrCount = 0; //   loadErrorCount
  }

  get realSrc() {
    if (this.loadErrCount < this.maxRetryCount) {
      return this.src;
    } else {
      return this.fallback;
    }
  }

  $refs: {
    img: HTMLImageElement;
  };

  errorCb(e: Event) {
    this.loadErrCount++;
    if (this.loadErrCount < this.maxRetryCount) {
      //
      this.$refs.img.src = this.src;
    }
    this.$emit('error', e);
  }
}
</script>
