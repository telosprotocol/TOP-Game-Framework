<template>
  <div class="absolute" :style="$ss.getters.designPxsObjToReal(designStyle)">
    <div
      :class="[
        'absolute w-10 h-10 rounded-full arrowCircle animated infinite',
        circleClassName,
      ]"
      :style="{
        background:
          'radial-gradient(rgba(255,255,255,0) 0%,rgba(255,255,255,0.3) 50%, white 100%)',
      }"
    ></div>
    <div
      class="arrowScale animated infinite translate-x-2 w-full h-full"
      :style="
        $ss.getters.designPxsObjToReal({
          '--animate-y-from': -2,
          '--animate-y-to': 2,
          'transform-origin': '20% top',
        })
      "
    >
      <div
        class="bg-contain bg-center bg-no-repeat w-full h-full"
        :style="$ss.getters.convertBgImageStyle(img)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { webpFilter } from '../directives/webp';
@Component({
  components: {},
})
export default class VHandGuide extends Vue {
  @Prop({
    type: String,
    default() {
      return webpFilter('/online/common/btnHand.png?webp');
    },
  })
  img: string;

  /**
   *       
   */
  @Prop({
    type: Object,
    default() {
      return {
        width: 71,
        height: 61,
      };
    },
  })
  designStyle: { width: number; height: number } & Record<
    string,
    number | string
  >;
  @Prop({
    type: String,
    default() {
      return '-top-3';
    },
  })
  circleClassName: string;
}
</script>
