<template>
  <div
    class="flex items-center justify-between px-3 bg-white rounded-md py-3 text-[13px] leading-4"
  >
    <div class="flex-1 mr-4">{{ $t('VGW.youHasPendingOrder') }}</div>
    <div class="text-[#3D79F2]">
      {{ $t('VGW.viewDetail') }}

      <ib class="iconfont icon-right"></ib>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
@Component({
  components: {},
})
export default class VQueueItemBlock extends Vue {}
</script>
