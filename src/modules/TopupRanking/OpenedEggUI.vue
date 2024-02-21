<template>
  <div
    class="relative"
    :style="
      $ss.getters.normalizeCss({
        width: 354 / 2,
        height: 294 / 2,
      })
    "
  >
    <div
      class="bg-contain bg-center bg-no-repeat absolute inset-0"
      v-webp="'/online/topupRanking/bonus/egg_open_back.png?webp'"
    ></div>
    <div
      class="bg-contain bg-center bg-no-repeat absolute inset-0 left-1/2 -translate-x-1/2"
      :style="
        $ss.getters.normalizeCss(
          {
            width: 118,
            height: 96,
            top: 26,
          },
          image
        )
      "
    ></div>
    <div
      class="bg-contain bg-center bg-no-repeat absolute inset-0"
      v-webp="'/online/topupRanking/bonus/egg_open_front.png?webp'"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class OpenedEggUI extends Vue {
  @Prop({
    type: String,
  })
  image: string;
}
</script>
