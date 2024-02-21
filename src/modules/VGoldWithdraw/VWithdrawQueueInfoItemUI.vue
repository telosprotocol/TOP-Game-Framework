<template>
  <div
    class="rounded-md bg-[#F6F6F6] p-3 px-2 flex items-center justify-center"
  >
    <div
      class="w-10 h-10 bg-cover bg-center bg-no-repeat mr-1 shrink-0"
      :style="$ss.getters.convertBgImageStyle(info.webpIcon, true)"
    ></div>
    <div
      class="flex-1 text-[#333] text-sm tz-ellipsis-break-2 mr-2"
      v-html="info.nameText"
    ></div>
    <button
      v-if="info.onClick"
      @click="info.onClick()"
      class="shrink-0 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF832C] to-[#FFC658] text-white font-semibold text-xs min-w-[78px] px-3 active:scale-95"
    >
      {{ $t('V.UNDERWAY') }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class VWithdrawQueueInfoItemUI extends Vue {
  @Prop({
    type: Object,
  })
  info: {
    nameText: string;
    onClick?: () => void;
    webpIcon: string;
  };
}
</script>
