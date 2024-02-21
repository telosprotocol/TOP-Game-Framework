<template>
  <div v-once>
    <div
      class="absolute left-0 top-0 right-0 bg-gradient-to-b"
      :class="wrapperClass"
      :style="$ss.getters.designPxsObjToReal({ height: 787 })"
    ></div>
    <div
      class="rounded-full absolute opacity-60"
      :style="
        $ss.getters.designPxsObjToReal({
          width: 226,
          height: 226,
          top: -73,
          left: -46,
          background:
            'linear-gradient(117.82deg, rgba(188, 137, 254, 8e-05) 39.89%, rgba(141, 89, 192, 0.8) 84.43%)',
        })
      "
    ></div>
    <div
      class="rounded-full absolute opacity-60"
      :style="
        $ss.getters.designPxsObjToReal({
          width: 226,
          height: 226,
          top: 11,
          right: -94,
          background:
            'linear-gradient(254.46deg, rgba(195, 137, 254, 5e-05) 33.93%, rgba(104, 41, 168, 0.5) 80.85%)',
        })
      "
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
export default class VPurpleCircleBgUI extends Vue {
  @Prop({
    type: String,
    default: 'from-[#9161CF] to-[#B294DE]',
  })
  wrapperClass: string;
}
</script>
