<template>
  <button
    class="flex w-[240px] mx-auto items-center justify-center vbtn vbtn--green relative z-0"
    :class="{
      'active:scale-95': isTuranableAble,
    }"
    :disabled="!isTuranableAble"
  >
    <slot name="btnContent">
      {{ $t('V_T.spin') }}
    </slot>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class ButtonSpinUI extends Vue {
  @Prop({
    type: Boolean,
  })
  isTuranableAble: boolean;
}
</script>
