<template>
  <header
    class="mx-auto absolute -top-12 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-center bg-contain bg-no-repeat z-10"
    :style="
      $ss.getters.convertBgImageStyle(
        require('@/assets/higgs/higgs_header.png?webp'),
        true,
        $ss.getters.designPxsObjToReal({
          width: 360,
          height: 176,
        })
      )
    "
  >
    <div
      class="absolute -translate-x-1/2 left-1/2 flex items-center justify-center italic font-rubik text-xl font-extrabold"
      :style="
        $ss.getters.designPxsObjToReal({
          top: 108,
          width: 260,
          height: 40,
        })
      "
    >
      <div
        class="vgradient-text-outline"
        :style="{
          '--v-color-from': '#FFFF7A',
          '--v-color-to': '#FAC007',
          '--v-shadow-from': '#4D2760',
          '--v-shadow-to': '#4D2760',
          '--v-shadow-y': '3px',
          '--v-shadow-x': '0',
        }"
        :data-text="title"
      >
        {{ title }}
      </div>
    </div>
    <button
      @click="$emit('close')"
      class="absolute right-5 top-16 w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
      v-webp="require('@/assets/higgs/btnClose.png?webp')"
    ></button>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class HiggsHeaderUI extends Vue {
  @Prop({
    type: String,
  })
  title: string;
}
</script>
