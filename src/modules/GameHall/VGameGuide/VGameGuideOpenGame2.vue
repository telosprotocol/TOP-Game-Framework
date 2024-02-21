<template>
  <div class="absolute inset-0 z-[1000]" v-if="value">
    <div class="absolute rounded-md" :style="holeStyle"></div>
    <template v-if="info && info.bounding">
      <div
        class="absolute"
        :style="{
          top: info.bounding.top + 'px',
          left: info.bounding.left + 'px',
          width: info.bounding.width + 'px',
          height: info.bounding.height + 'px',
        }"
      >
        <VGameListOnePage
          :game-list="info.gameList"
          @gameOpened="onGameOpened"
          from="gamehall_guideclaim"
          :show-new-guide="true"
        ></VGameListOnePage>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import PopupMixin from '@/components/Modal/PopupMixin';

import { webpFilter } from '@/directives/webp';
import VGameListOnePage from '../VGameList/VGameListOnePage.vue';
import type { IVGameIconInfoItem } from '../VGameList/GameList.state';

@Component({
  components: { VGameListOnePage },
})
export default class VGameGuideOpenGame2 extends mixins(PopupMixin) {
  @Prop({
    type: Object,
    required: false,
  })
  info: {
    bounding: DOMRect;
    gameList: IVGameIconInfoItem[];
  };
  dontUpdateZIndex = true;
  cantReturn = true;

  get handImage() {
    return webpFilter(require('@/assets/gameCommon/hand.png?webp'));
  }
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('gamenovice_guidance_play_exposure');
    }
  }

  get tipList() {
    return [this.$t('VG.welcomeClickGameTip')];
  }

  get holeStyle() {
    const bounding = this.info?.bounding;
    const padding = 2;
    const paddingY = 4;

    if (!bounding) {
      return {};
    }
    return {
      top: bounding.top - padding + 'px',
      left: bounding.left - padding + 'px',
      width: bounding.width + padding * 2 + 'px',
      height: bounding.height + paddingY * 2 + 'px',
      boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.7)',
      background: 'transparent',
    };
  }

  onGameOpened(gameItem: IVGameIconInfoItem) {
    this.$tracev('vgame_click_gamenovice_guidance_play', {
      game_id: gameItem.id,
      game_name: gameItem.name,
    });
    this.emitDlgVisible(false);
  }
}
</script>
