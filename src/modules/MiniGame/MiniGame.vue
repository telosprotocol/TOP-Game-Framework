<template>
  <div class="w-screen h-screen overflow-hidden">
    <iframe
      seamless="seamless"
      allowtransparency="true"
      frameborder="0"
      style="width: 100%; height: 100%; border: 0px"
      :src="url"
    ></iframe>
    <DragableBtn class="right-6 bottom-1/2 z-50" :max-y="dragMaxY">
      <button
        @click="onClose"
        class="w-12 h-12 rounded-full border border-solid bg-[rgba(0,0,0,0.6)] border-[#999] text-white active:scale-95 cursor-pointer"
      >
        Close
      </button>
    </DragableBtn>
  </div>
</template>

<script lang="ts">
import { close_bridge } from '@/js_bridge/js_call_app_base';
import Vue from 'vue';
import Component from 'vue-class-component';
import DragableBtn from '@/components/DragableBtn/DragableBtn.vue';
@Component({
  components: { DragableBtn },
})
export default class MiniGame extends Vue {
  onClose() {
    close_bridge();
  }

  get url() {
    return this.$route.query.url;
  }

  mounted() {
    this.dragMaxY = this.$el.getBoundingClientRect().height - 60;
  }
  dragMaxY = 1000;
}
</script>
