<template>
  <section class="flex items-center justify-center mt-8">
    <button
      class="w-10 h-10 bg-contain bg-no-repeat bg-center text-white font-3xl"
      v-webp="require('@/assets/bag_props/btnIconPurple.png?webp')"
      @click="onMinusClick"
      :class="{
        'opacity-50': !canMinus,
        'active:scale-95': canMinus,
      }"
    >
      <ib class="iconfont icon-minus font-bold"></ib>
    </button>
    <div
      class="rounded-[4px] h-10 text-center mx-3.5 flex items-center justify-center text-[#333] text-[18px] font-semibold"
      :style="
        $ss.getters.designPxsObjToReal({
          boxShadow: 'inset 0px 1px 3px 0px rgba(0, 0, 0, 0.18)',
          background: '#e5d4fa',
          width: 170,
        })
      "
    >
      {{ value }}
    </div>
    <button
      class="w-10 h-10 bg-contain bg-no-repeat bg-center text-white font-3xl"
      :class="{
        'opacity-50': !canPlus,
        'active:scale-95': canPlus,
      }"
      v-webp="require('@/assets/bag_props/btnIconPurple.png?webp')"
      @click="onPlusClick"
    >
      <ib class="iconfont icon-plus font-bold"></ib>
    </button>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class VStepNumber extends Vue {
  @Prop({
    type: Number,
    required: true,
  })
  value: number;
  @Prop({
    type: Number,
    required: true,
  })
  maxValue: number;

  get canPlus() {
    return this.value < this.maxValue;
  }

  onPlusClick() {
    if (this.canPlus) {
      this.$emit('input', this.value + 1);
    }
  }
  get canMinus() {
    return this.value >= 2;
  }

  onMinusClick() {
    if (this.canMinus) {
      this.$emit('input', this.value - 1);
    }
  }
}
</script>
