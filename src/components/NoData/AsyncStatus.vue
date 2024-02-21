<template>
  <div
    class="relative min-h-64 px-4 py-12 text-sm text-center"
    :style="{ color: color }"
    v-if="status !== 'ok' && !!status"
  >
    <slot name="loading-wrap" v-if="status === 'loading'">
      <slot name="loading-icon">
        <div
          class="mx-auto mb-4 flex items-center justify-center text-[2.5em]"
          :style="iconStyle"
        >
          <div class="iconfont icon-loading"></div>
        </div>
      </slot>
      <slot name="loading-text">
        {{ loadingText || text || $t('Base.Loading') }}
      </slot>
    </slot>
    <slot name="nodata-wrap" v-else-if="status === 'nodata'">
      <slot name="nodata-icon">
        <div
          class="mx-auto mb-1 flex items-center justify-center text-[3em]"
          :style="iconStyle"
        >
          <div class="iconfont icon-empty"></div>
        </div>
      </slot>
      <slot name="nodata-text">
        {{ noDataText || text || $t('Base.NoData') }}
      </slot>
    </slot>
    <slot name="error-wrap" v-else-if="status === 'error'">
      <slot name="error-icon">
        <div
          class="mx-auto mb-1 flex items-center justify-center text-[3em]"
          :style="iconStyle"
        >
          <div class="iconfont icon-empty"></div>
        </div>
      </slot>
      <slot name="error-text">
        {{ errText || text || $t('Base.FailLoad') }}
      </slot>
      <slot name="retry-btn">
        <button class="tz-btn-pblock mt-4" @click="onRetryClick">
          {{ $t('Base.Refresh') }}
        </button>
      </slot>
    </slot>
  </div>
</template>

<script lang="ts">
import { webpFilter } from '@/directives/webp';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { convertBgImageStyle } from '@/utils/styles';
import { noop } from 'lodash-es';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import NetworkError from './NetworkError.vue';
export const IMG_DEFAULT = require('@/assets/illustration/default.png?webp');
export const IMG_DEFAULT_WEBP = webpFilter(IMG_DEFAULT);

export type IAsyncStatusType = 'loading' | 'error' | 'nodata' | 'ok';
@Component({
  components: {
    NetworkError,
  },
})
export default class AsyncStatus extends BindEventMixinDefault {
  useInited() {
    return noop;
  }

  @Prop({
    type: String,
    default: null,
  })
  status: IAsyncStatusType;

  @Prop({
    type: String,
    default: null,
  })
  errText: string;

  @Prop({
    type: String,
    default: '#999',
  })
  color: string;

  @Prop({
    type: String,
    default: null,
  })
  noDataText: string;

  @Prop({
    type: String,
    default: null,
  })
  loadingText: string;

  /**
   *    text,   <noDataText|errText|loadingText,      text
   */
  @Prop({
    type: String,
    default: null,
  })
  text: string;

  @Prop({
    type: String,
    default: null,
  })
  iconStyle: Partial<CSSStyleDeclaration>;

  get imgErrorStyle() {
    return convertBgImageStyle(IMG_DEFAULT_WEBP);
  }
  onRetryClick() {
    if (this.status !== 'error') {
      return;
    }
    this.$emit('retry');
  }
}
</script>
