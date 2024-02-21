<template>
  <section
    class="rounded-2xl bg-gradient-to-b from-[#FE7F5D] to-[#FF639C] p-[5px] relative"
  >
    <div
      class="absolute left-0 right-0 -top-2.5 h-8 flex items-center justify-center"
    >
      <div
        class="h-full bg-gradient-to-b from-[#FC7C00] to-[#F84600] rounded-full border-[3px] px-4 border-solid border-[#FFD1AA] flex items-center justify-center font-rubik font-extrabold italic text-white vshadow-stroke shadow-[#C3711E] text-sm"
        :style="$ss.getters.designPxsObjToReal({ minWidth: 192 })"
      >
        <slot name="title"></slot>
      </div>
    </div>
    <div class="rounded-2xl bg-gradient-to-b from-[#FFCDA4] to-[#FFE7CA] p-3">
      <div class="p-[3px] bg-white rounded-2xl">
        <slot> </slot>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
@Component({
  components: {},
})
export default class VPlayEarnBlockUI extends Vue {}
</script>
