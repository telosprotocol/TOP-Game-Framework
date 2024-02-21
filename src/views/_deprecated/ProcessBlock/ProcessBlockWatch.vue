<template>
  <ProcessBlock
    :icon="icon"
    :right-btn="$t('Base.Rules')"
    :current-value="currentValue"
    v-bind="$attrs"
    v-trace:wallet_bonus_watch_rules
  >
    <template v-slot:title>
      <div
        style="display: inline-block"
        v-html="
          $t('Watched {xxx} Minutes Today', {
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
const icon = require('./imgs/icon-banner-eye.png') as string;
const ProcessBlockWatch = Vue.extend({
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
export default ProcessBlockWatch;
</script>

<style lang="less" scoped>
@import '~@/styles/utils.less';
</style>
