<template>
  <div class="overflow-hidden">
    <div
      class="relative flex w-full h-full will-change-transform"
      ref="track"
      :style="trackStyle"
    >
      <div
        class="shrink-0 box-border w-full"
        :class="{ 'h-0 overflow-visible': currentTabIdx !== idx }"
        v-for="(item, idx) in tabList"
        :key="(item.name || idx) + '_' + item.title"
      >
        <div class="shrink-0 box-border w-full" :data-tab-idx="idx">
          <slot :name="getSlotName(item, idx)" :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Mixins, Watch } from 'vue-property-decorator';
import { TouchMixin } from '@/mixins/touch';

const MIN_SWIPE_DISTANCE = 50;
type ITabItemOption = {
  title: string;
  //            
  name?: string;
  redpoint?: boolean;
  eventName?: string;
};
const TzTabPanelProps = Vue.extend({
  props: {
    tabList: {
      type: Array as PropType<ITabItemOption[]>,
      default() {
        return [];
      },
    },
    currentTabIdx: {
      type: Number,
      default: 0,
    },
    noTouch: {
      type: Boolean,
      default: false,
    },
  },
});
@Component<TzTabPanel>({
  model: {
    prop: 'currentTabIdx',
    event: 'change',
  },
})
export default class TzTabPanel extends Mixins(
  TouchMixin,
  TzTabPanelProps
  // BindEventMixinDefault
) {
  private _lastBindOffFunc: () => void;
  // useInited() {
  //   if (!this.noTouch) {
  //     this._lastBindOffFunc = this.bindTouchEvent(this.$refs.track)
  //     return this._lastBindOffFunc
  //   }
  //   // return () => {
  //   //   this.bindOffTouchEvent(this.$refs.track)
  //   // }
  // }

  $refs: {
    track: HTMLElement;
  };
  @Watch('noTouch', {
    immediate: true,
  })
  onNoTouchChanged(v: boolean) {
    if (this._lastBindOffFunc) {
      this._lastBindOffFunc();
      this._lastBindOffFunc = null;
    }
    if (v !== true) {
      this.$nextTick(() => {
        this._lastBindOffFunc = this.bindTouchEvent(this.$refs.track);
      });
    }
  }

  get trackStyle() {
    return {
      transform: `translate3d(-${100 * this.currentTabIdx}%, 0px, 0px)`,
      'transition-duration': '0.3s',
    };
  }

  getSlotName(item: ITabItemOption, idx) {
    if (item.name) {
      return item.name;
    } else {
      return 'tab-' + idx;
    }
  }

  onTouchStart(event) {
    this.touchStart(event);
  }

  onTouchMove(event) {
    this.touchMove(event);
  }

  // watch swipe touch end
  onTouchEnd() {
    const { direction, deltaX, currentTabIdx } = this;

    /* istanbul ignore else */
    if (direction === 'horizontal' && this.offsetX >= MIN_SWIPE_DISTANCE) {
      /* istanbul ignore else */
      if (deltaX > 0 && currentTabIdx !== 0) {
        this.$emit('change', currentTabIdx - 1);
      } else if (deltaX < 0 && currentTabIdx !== this.tabList.length - 1) {
        this.$emit('change', currentTabIdx + 1);
      }
    }
  }
}
</script>
