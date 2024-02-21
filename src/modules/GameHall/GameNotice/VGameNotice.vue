<template>
  <div
    class="flex items-center h-5 text-xs pl-1.5 pr-2 rounded-full bg-black bg-opacity-10"
  >
    <div
      class="shrink-0 w-5 h-5 bg-center bg-contain bg-no-repeat"
      v-webp="require('@/assets/gameHall/noticeSpeaker.png?webp')"
    ></div>
    <NoticeBar
      ref="notice"
      class="flex-1"
      color="#053F33"
      style="padding: 0"
      background="transparent"
      @replay="onReplay"
    >
      <div class="flex flex-nowrap font-robot-medium font-medium">
        <div :style="$ss.getters.designPxsObjToReal({ width: 300 })"></div>
        <div
          v-for="(item, idx) in list"
          v-html="item.message"
          :style="
            $ss.getters.designPxsObjToReal({
              minWidth: 240,
              paddingRight: 80,
            })
          "
          :key="item.id + idx"
        ></div>
      </div>
    </NoticeBar>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VGameNoticeMixin } from './VGameNotice.state';
import { NoticeBar, Swipe, SwipeItem } from 'vant';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import type { IGameRollMessageItem } from './VGameNotice.state';
import { Watch } from 'vue-property-decorator';

@Component({
  components: { NoticeBar, Swipe, SwipeItem },
})
export default class VGameNotice extends mixins(
  VGameNoticeMixin,
  BindEventMixinDefault
) {
  $refs: {
    notice: NoticeBar;
  };
  useInited() {
    return () => {};
  }

  nextList: IGameRollMessageItem[];
  @Watch('gameNotice')
  onGameNoticeChange(list: IGameRollMessageItem[]) {
    let nextList = this.nextList;
    if (!nextList) {
      nextList = this.nextList = [];
    }
    list.map((item) => {
      nextList.push(item);
    });
    if (nextList.length > 100) {
      //   100 ，
      nextList.splice(0, nextList.length - 100);
    }
    this.nextList = nextList;
    if (this.list.length === 0) {
      this.onReplay();
    }
  }

  list: IGameRollMessageItem[] = [];

  onReplay() {
    this.list = this.nextList || [];
    this.nextList = [];
    (this.$refs.notice as any)?.reset();
  }
}
</script>
