<template>
  <div class="flex flex-col items-center py-4">
    <div class="mx-auto mb-4 flex items-center justify-center text-[3em]">
      <div class="iconfont icon-empty"></div>
    </div>
    <slot>{{ $t('Base.NoData') }}</slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
@Component({
  components: {},
})
export default class NoDataIcon extends Vue {}
</script>
