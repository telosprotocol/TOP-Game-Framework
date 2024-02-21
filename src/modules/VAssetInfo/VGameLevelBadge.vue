<template>
  <div
    class="h-4 pr-1.5 relative inline-flex items-center text-white robot-medium text-[10px] leading-none rounded-sm"
    :style="badgeStyle"
    :class="customConfig.className"
  >
    <div
      class="absolute left-0 w-9 h-9 mt-[1px] bg-contain bg-center bg-no-repeat -translate-x-1/2"
      :style="gameLevelConfig.iconStyle"
    ></div>
    <div>{{ gameLevelConfig.title }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { getVGameLevelConfigByGameLevel } from '@/modules/VAssetInfo/VLevels.config';

const GAMELEVEL_CONFIG = {
  0: {
    //#D58562
    bg: 'linear-gradient(180deg, #D58562 0%, #C56C47 100%)',
    className: 'pl-4',
  },
  1: {
    bg: 'linear-gradient(180deg, #878BEF 0%, #6866BA 100%)',
    className: 'pl-4',
  },
  2: {
    bg: 'linear-gradient(180deg, #FBCC63 0%, #F2A42E 100%)',
    className: 'pl-4',
  },
  3: {
    bg: 'linear-gradient(180deg, #8247BD 0%, #6830C4 100%)',
    className: 'pl-4',
  },
  4: {
    bg: 'linear-gradient(#f59786 0%, #f57619 100%)',
    className: 'pl-4',
  },
} as Record<string, { bg: string; className: string }>;
@Component({
  components: {},
})
export default class VGameLevelBadge extends Vue {
  @Prop({
    type: [String, Number],
    required: true,
  })
  level: string | number;

  get gameLevelConfig() {
    return getVGameLevelConfigByGameLevel(this.level);
  }

  get customConfig() {
    const config = GAMELEVEL_CONFIG[this.level] || GAMELEVEL_CONFIG[3];
    return config;
  }

  get badgeStyle() {
    return {
      background: this.customConfig.bg,
    };
  }
}
</script>
