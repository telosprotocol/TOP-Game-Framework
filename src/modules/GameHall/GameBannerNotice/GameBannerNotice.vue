<template>
  <div
    class="px-4 pt-[1px] bg-contain bg-center bg-no-repeat"
    v-if="list && list.length > 0"
    :style="
      $ss.getters.normalizeCss(
        { width: 330, height: 58 },
        require('@/assets/gameHall/banner/bg.png?webp'),
        true
      )
    "
  >
    <div
      class="text-xs w-full overflow-hidden"
      :style="
        $ss.getters.normalizeCss({
          padding: 0,
          height: 58,
        })
      "
      color="#333"
    >
      <div class="flex flex-col" ref="wrap">
        <transition-group name="list" tag="div">
          <i18n
            class="flex flex-nowrap font-robot-medium font-medium text-white leading-5 listItem"
            :path="item.i18nName"
            tag="div"
            v-for="item in list"
            :key="item.id"
          >
            <span class="text-[#33EC97] mr-1">{{ item.name }}</span>
            <span class="text-[#FFF070] ml-1">Rp{{ item.amount }}</span>
          </i18n>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<style>
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  margin-top: -20px;
}
</style>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { GameBannerNoticeMixin } from './GameBannerNotice.state';
@Component({
  components: {},
})
export default class GameBannerNotice extends mixins(
  BindEventMixinDefault,
  GameBannerNoticeMixin
) {
  $refs: {
    wrap: HTMLDivElement;
  };
  useInited() {
    return noop;
  }

  @Prop({
    type: Boolean,
  })
  isActive: boolean;

  get sList() {
    return (this.GameBannerNotice || []).map((item) => {
      return {
        id: item.id,
        name: item.name,
        i18nName: item.recharge ? 'VG.userTopuped' : 'VG.userWithdrawed',
        amount: this.$ss.getters.formatFloat(Number(item.amount)),
      };
    });
  }

  get list() {
    const newList = this.sList;
    const newListLength = newList.length;
    const curIdx = this.curIdx;
    if (newListLength <= 3) {
      return newList;
    }
    const newList2: typeof newList = [];
    for (let i = 0; i < 4; i++) {
      const idx = (curIdx + i) % newListLength;
      newList2.push(newList[idx]);
    }
    return newList2;
  }

  @Watch('GameBannerNotice')
  onListChange() {
    this.curIdx = 0;
    this.reset();
  }

  @Watch('isActive', { immediate: true })
  onActiveChange(isActive: boolean) {
    if (isActive) {
      this.resume();
    } else {
      this.stop();
    }
  }

  @Watch('isBoundsVisible')
  onBoundsVisibleChange(isBoundsVisible: boolean) {
    if (isBoundsVisible) {
      if (this.isActive) {
        this.resume();
      }
    } else {
      this.stop();
    }
  }
  get isBoundsVisible() {
    const isCurBounds = this.$ss.state.bridge.appTabName === 'bounds';
    return this.$ss.getters['bridge/isMainActivityActive'] && isCurBounds;
  }

  curIdx = 0;

  timer: ReturnType<typeof setTimeout>;
  reset() {
    this.resume();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  resume() {
    this.stop();
    const len = this.GameBannerNotice?.length;
    if (len > 3) {
      this.timer = setInterval(() => {
        this.curIdx = (this.curIdx + 1) % len;
        // console.log('[DEBUG] play', this.curIdx, len);
      }, 1500);
    }
  }
}
</script>
