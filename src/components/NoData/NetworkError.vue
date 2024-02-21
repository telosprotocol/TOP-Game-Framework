<template>
  <NoData :type="type" class="nodata">
    <div class="tip">{{ $t('Base.FailLoad') }}</div>
    <button
      class="tz-btn-pblock"
      :class="{ disabled: isLoading }"
      @click="onRetryClick"
    >
      {{ isLoading ? $t('Loading') : $t('Base.Refresh') }}
    </button>
  </NoData>
</template>

<style lang="less" scoped>
@import '~@/styles/utils.less';
.nodata {
  padding: 16px;
  ::v-deep .img /*EOFDEEP*/ {
    margin-bottom: 16px;
  }
  .tip {
    margin-bottom: 16px;
  }
}
</style>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import NoData from './index.vue';
const NetworkErrorProps = Vue.extend({
  props: {
    //      img,
    type: {
      type: String as PropType<'default' | 'nodata'>,
      default: 'default',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
});
@Component({
  components: {
    NoData,
  },
})
export default class NetworkError extends NetworkErrorProps {
  onRetryClick() {
    if (this.isLoading) {
      return;
    }
    this.$emit('retry');
  }
}
</script>
