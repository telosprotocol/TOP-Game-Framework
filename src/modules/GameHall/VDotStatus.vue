<template>
  <div
    class="absolute w-2.5 h-2.5 border border-white border-solid rounded-full shadow-md shadow-[rgba(0,0,0,0.5)] box"
    :class="{
      'left-0 top-0': position === 'left',
      'right-0 top-0': position === 'right',
    }"
    v-if="status"
    :style="iconStyle"
  ></div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class VDotStatus extends Vue {
  @Prop({
    type: String,
  })
  status: 'red' | 'green' | '';
  @Prop({
    type: String,
    default: 'left',
  })
  position: 'left' | 'right';
  get iconStyle() {
    const status = this.status;
    switch (status) {
      case 'red':
        return {
          background: 'linear-gradient(180deg, #FFAEAE 0%, #FF0000 100%)',
        };
      case 'green': {
        return {
          background: 'linear-gradient(180deg, #74FC79 0%, #11C219 100%)',
        };
      }
    }
    return {};
  }
}
</script>
