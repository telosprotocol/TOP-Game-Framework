<template>
  <section
    class="flex justify-between items-center rounded-full bg-[#A58464] border-[#A87F4E] border border-solid h-8 mb-3"
    :class="{ 'pl-1': isLarge, 'pl-2': !isLarge }"
  >
    <div
      class="bg-contain shrink-0 bg-left bg-no-repeat flex items-center"
      :style="
        $ss.getters.normalizeCss({
          width: isLarge ? 30 : 22,
          height: 30,
          marginRight: isLarge ? 36 : 40,
        })
      "
      v-webp="iconLeftWebp"
    >
      <slot name="iconInner"></slot>
    </div>
    <div class="flex-1"><slot></slot></div>
    <button
      class="w-9 h-9 bg-contain bg-center shrink-0 bg-no-repeat active:scale-95 -mr-1"
      v-if="iconRightWebp"
      v-webp="iconRightWebp"
      @click="$emit('clickRight')"
    ></button>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class VGameProfileInfoBlockUI extends Vue {
  @Prop({
    type: String,
  })
  iconLeftWebp: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isLarge: boolean;
  @Prop({
    type: String,
    required: false,
  })
  iconRightWebp: string;
}
</script>
