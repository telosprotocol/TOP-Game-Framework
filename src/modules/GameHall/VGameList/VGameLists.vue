<template>
  <div class="mx-0.5">
    <Swipe @change="onChange" ref="swipe">
      <SwipeItem v-for="tabItem in tabList" :key="tabItem.idx">
        <VGameListOnePage
          ref="swipeChildWrap"
          :game-list="tabItem.gameList"
          :class="{ invisible: showNewGuide }"
        >
        </VGameListOnePage>
      </SwipeItem>
      <template slot="indicator">
        <div></div>
      </template>
    </Swipe>
    <!-- swipeIndicator -->
    <div v-if="tabList.length > 1" class="flex justify-center py-2">
      <div
        v-for="tabItem in tabList"
        :key="tabItem.idx"
        class="rounded-full h-1.5 mx-0.5 transition-all"
        :class="{
          'w-3 bg-[#FFE5AB]': tabItem.idx === curIdx,
          'w-2 bg-[#A36C2F]': tabItem.idx !== curIdx,
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Swipe, SwipeItem } from 'vant';
import { MS_MINUTE_5 } from '@/constants/time';
import type { IVGameIconInfoItem } from './GameList.state';
import VGameListOnePage from './VGameListOnePage.vue';

const GROUP_SIZE = 9;
@Component({
  components: {
    Swipe,
    SwipeItem,
    VGameListOnePage,
  },
})
export default class VGameLists extends Vue {
  $refs: {
    swipeChildWrap: VGameListOnePage[];
    swipe: Swipe;
  };
  @Prop({
    type: Array,
  })
  gameList?: IVGameIconInfoItem[];

  curIdx = 0;
  onChange(index: number) {
    this.curIdx = index;
  }

  @Prop({
    type: Boolean,
  })
  showNewGuide?: boolean;
  //#region

  get curVisibleGameList() {
    const tabList = this.tabList;
    const curIdx = this.curIdx;
    const tabItem = tabList[curIdx];
    if (!tabItem) {
      return [];
    }
    return tabItem.gameList;
  }

  get curVisibleGameListStr() {
    return this.curVisibleGameList.map((item) => item.id).join(',');
  }

  gameExposeMapByGameId: { [gameId: string]: number };

  @Watch('curVisibleGameListStr')
  onExposeChange() {
    const list = this.curVisibleGameList;
    const dtNow = new Date().getTime();
    list.forEach((item) => {
      if (!this.gameExposeMapByGameId) {
        this.gameExposeMapByGameId = {};
      }
      const lastTraceDt = this.gameExposeMapByGameId[item.id] || 0;
      if (dtNow - lastTraceDt > MS_MINUTE_5) {
        this.gameExposeMapByGameId[item.id] = dtNow;
        this.$tracev('game_exposure', {
          game_id: item.id,
          open_source: 'gamehall',
        });
      }
    });
  }
  //#endregion

  get tabList() {
    const gameList = this.gameList || [];
    const groupLength = Math.ceil(gameList.length / GROUP_SIZE);
    const tabList: { idx: number; gameList: typeof gameList }[] = [];
    for (let i = 0; i < groupLength; i++) {
      tabList.push({
        idx: i,
        gameList: gameList.slice(i * GROUP_SIZE, i * GROUP_SIZE + GROUP_SIZE),
      });
    }
    return tabList;
  }
}
</script>
