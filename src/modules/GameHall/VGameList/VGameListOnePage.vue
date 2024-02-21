<template>
  <div
    class="flex content-start items-start justify-around flex-wrap"
    :style="
      $ss.getters.normalizeCss({
        minHeight: 106 * 3,
      })
    "
  >
    <div
      v-for="gameItem in gameList"
      :key="gameItem.id"
      class="shrink-0 bg-contain bg-no-repeat mb-1 bg-center active:scale-95 relative"
      @click="onGameItemClicked(gameItem)"
      :style="
        $ss.getters.normalizeCss(
          {
            width: 106,
            height: 106,
          },
          gameItem.icon
        )
      "
    >
      <div
        v-if="getAnchorTag(gameItem)"
        class="bg-contain bg-center bg-no-repeat absolute animate-heartBeat animate-infinite"
        :style="
          $ss.getters.normalizeCss(
            { width: 50, height: 26, left: 6, top: 3 },
            getAnchorTag(gameItem),
            true
          )
        "
      ></div>
      <div v-if="showNewGuide" class="absolute -bottom-4 -right-2">
        <div
          class="bg-contain bg-center bg-no-repeat arrowScale animated infinite"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 48,
                height: 48,
                '--animate-y-from': -2,
                '--animate-y-to': 2,
                'transform-origin': '20% top',
              },
              require('@/assets/gameHall/gameGuide/hand.png?webp'),
              true
            )
          "
        ></div>
      </div>
    </div>
    <ib
      v-for="idx in 2"
      :key="idx"
      class="shrink-0"
      :style="
        $ss.getters.normalizeCss({
          width: 106,
        })
      "
    ></ib>
  </div>
</template>
<style scoped>
@keyframes heartBeat {
  5.6%,
  14% {
    transform: scale3d(1, 1, 1);
  }
  4.8%,
  8.4% {
    transform: scale3d(1.3, 1.3, 1.3);
  }
}
.animate-heartBeat {
  animation: 4.3s ease-in-out heartBeat;
  animation-iteration-count: infinite;
  animation-direction: normal;
}
</style>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import type { IVGameIconInfoItem } from './GameList.state';
import { openVGame } from './openGame';
const TAG_ICON_MAP = {
  NEW: require('@/assets/gameHall/gameList/new.png?webp'),
  HOT: require('@/assets/gameHall/gameList/hot.png?webp'),
  NONE: '',
};
@Component({
  components: {},
})
export default class VGameListOnePage extends Vue {
  @Prop({
    type: Array,
  })
  gameList: IVGameIconInfoItem[];
  getAnchorTag(item: IVGameIconInfoItem) {
    return TAG_ICON_MAP[item.subscriptType];
  }
  @Prop({
    type: Boolean,
  })
  showNewGuide?: boolean;
  @Prop({
    type: String,
    default: null,
  })
  from?: 'gamehall_guideclaim';

  async onGameItemClicked(gameItem: IVGameIconInfoItem) {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    const openSource = this.from || 'gamehall';
    this.$tracev('click_game_play', {
      game_name: gameItem.name,
      openSource,
      game_id: gameItem.id,
    });
    openVGame(gameItem.id, gameItem.orientation, openSource);
    this.$emit('gameOpened', gameItem);
  }
}
</script>
