<template>
  <div
    class="h-7 w-16 relative flex items-center"
    @click="onSwitch"
    :class="{ 'pl-4 justify-end': !value, 'pr-4 justify-start': value }"
  >
    <div
      :style="switchButtonStyle"
      class="bg-contain bg-center bg-no-repeat w-9"
    ></div>
    <div
      class="h-5 w-12 flex items-center text-white robot-bold text-xs leading-none rounded-[4px]"
      :class="{
        'bg-[#888] justify-end pr-1': !value,
        'bg-[#FF6119] justify-start pl-2': value,
      }"
    >
      {{ value ? 'ON' : 'OFF' }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { convertBgImageStyle } from '@/utils/styles';
@Component({
  components: {},
})
export default class VSwitchButton extends Vue {
  @Prop({
    type: Boolean,
  })
  value: boolean;

  get switchButtonStyle() {
    const isOn = this.value;
    return convertBgImageStyle(
      isOn
        ? require('@/assets/gameHall/setting/switch_on.png?webp')
        : require('@/assets/gameHall/setting/switch_off.png?webp'),
      true,
      {
        position: 'absolute',
        ...(isOn ? { right: '0' } : { left: '0' }),
        ...this.$ss.getters.designPxsObjToReal({
          height: 27,
        }),
      }
    );
  }

  onSwitch() {
    this.$emit('input', !this.value);
  }
}
</script>
