<template>
  <div
    class="flex items-center justify-between py-2 border-b border-solid border-[#F6F2FC] relative"
  >
    <ib
      @click="onSelectClick"
      class="iconfont text-[#9567D1] mr-1"
      :class="{
        ' icon-check-circle': !!checked,
        'icon-radio-empty': !checked,
      }"
    ></ib>
    <img
      @click="onSelectClick"
      :src="info.icon"
      :alt="info.name"
      class="object-contain object-left block"
      :style="
        $ss.getters.designPxsObjToReal({
          width: 85,
          height: 34,
        })
      "
    />
    <div
      class="flex-1 text-right"
      @click="onSetClick"
      :class="{ 'text-[#999]': needBind }"
    >
      {{ needBind ? $t('VGW.setAccount') : txtAccountNo }}
    </div>
    <div class="iconfont icon-right" @click="onSetClick"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { Radio } from 'vant';
import { stringShield } from '@/utils/string';
@Component({
  components: {
    Radio,
  },
})
export default class VSelectableAccountItem extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  info: API.WithdrawalForAccountViewVO;

  @Prop({
    type: Boolean,
    default: false,
  })
  checked: boolean;

  get needBind() {
    return !this.info.channelNumber;
  }

  get txtAccountNo() {
    const info = this.info;
    const { channelNumber } = info;

    return stringShield(channelNumber);
  }

  onSelectClick() {
    this.$emit('selected', this.info);
    if (this.needBind) {
      const verifySource = 'check';
      this.$tracev('click_game_tarikdana_verify', {
        channel: this.info.type,
        verify_source: verifySource,
      });
      this.$emit('startBind', this.info, verifySource);
    }
  }

  onSetClick() {
    const verifySource = 'edit';
    this.$tracev('click_game_tarikdana_verify', {
      channel: this.info.type,
      verify_source: verifySource,
    });
    this.$emit('startBind', this.info, verifySource);
  }
}
</script>
