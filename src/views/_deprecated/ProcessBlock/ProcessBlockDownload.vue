<template>
  <ProcessBlock
    :icon="icon"
    :right-btn="$t('Base.Rules')"
    :current-value="currentValue"
    skin="down"
    v-bind="$attrs"
    v-trace:wallet_bonus_download_rules
  >
    <template v-slot:title>
      <div
        style="display: inline-block"
        v-html="
          $t('Downloaded {xxx} Videos Today', {
            xxx: `<span>${currentValue}</span>`,
          })
        "
      ></div>
    </template>
  </ProcessBlock>
</template>

<script lang="ts">
import Vue from 'vue';
import ProcessBlock from './ProcessBlock.vue';
const icon = require('./imgs/icon-banner-cloud.png') as string;
const ProcessBlockDownload = Vue.extend({
  props: {
    currentValue: {
      type: Number,
      default: 0,
    },
  },
  components: {
    ProcessBlock,
  },
  data() {
    return {
      icon: icon,
    };
  },
});
export default ProcessBlockDownload;
</script>

<style lang="less" scoped>
@import '~@/styles/utils.less';
</style>
