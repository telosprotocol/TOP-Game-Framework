<template>
  <div class="tz-tabs-holder" ref="holder">
    <div
      class="absolute h-[1px] w-full -z-[1]"
      ref="fakeTopArea"
      :style="{
        top: -fixedTop + 2 + 'px',
      }"
    ></div>
    <div
      class="tz-tabs"
      :class="{
        fixed: isFixed,
      }"
      ref="refTabWrap"
      :style="
        isFixed && {
          top: fixedTop + 'px',
        }
      "
    >
      <div
        class="tz-tab"
        v-for="(item, idx) in tabList"
        :key="idx + '_' + item.title"
        :class="{
          selected: currentTabIdx === idx,
          'tz-tab-touched': item._isTouching,
        }"
        @click="_changeTabIdx(idx, item)"
        @touchstart="_tabTouched($event, item)"
      >
        <slot :name="getSlotName(item, idx)" :item="item">
          <ib
            class="iconfont absolute -translate-x-full"
            :class="item.icon"
            v-if="item.icon"
          ></ib>
          {{ item.title }}
        </slot>
        <div class="tz-redpoint" v-if="item.redpoint"></div>
      </div>
      <div
        :style="{ transform: `translateX(${selectedBarX}px) translateX(-50%)` }"
        class="tz-tabs-selectedbar"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';

type ITabItemOption = {
  title: string;
  name?: string;
  icon?: string;
  redpoint?: boolean;
  eventName?: string;
  eventParams?: { [key: string]: string | number };

  _isTouching?: boolean;
};
const TzTabProps = Vue.extend({
  props: {
    autoFixed: {
      type: Boolean,
      default: false,
    },
    fixedTop: {
      // autoFixed=true ，        fixed
      type: Number,
      default: 0,
    },
    tabList: {
      type: Array as PropType<ITabItemOption[]>,
      default() {
        return [];
      },
    },
    currentTabIdx: {
      type: Number, //number|name?
      default: 0,
    },
  },
});

@Component<TzTab>({
  model: {
    prop: 'currentTabIdx',
    event: 'change',
  },
  watch: {
    currentTabIdx() {
      this.updateSelectedBarX();
    },
    tabList() {
      this.updateSelectedBarX();
    },
    '$store.state.base.rootFontSize'() {
      this.updateSelectedBarX();
    },
  },
})
export default class TzTab extends TzTabProps {
  isFixed = false;
  selectedBarX = 0;
  updateSelectedBarX() {
    this.$nextTick(() => {
      const tabWrap = this.$refs.refTabWrap as HTMLElement;
      if (!tabWrap) {
        return;
      }

      if (this.currentTabIdx >= 0 && this.currentTabIdx < this.tabList.length) {
        const curTab = tabWrap.children[this.currentTabIdx] as HTMLElement;
        this.selectedBarX = curTab.offsetLeft + curTab.offsetWidth / 2;
        const left = this.selectedBarX - document.body.clientWidth / 2;
        if (tabWrap.scrollTo) {
          tabWrap.scrollTo({
            left: left,
            top: 0,
            behavior: 'smooth',
          });
        } else {
          tabWrap.scrollLeft = left;
        }
      }
    });
  }
  mounted() {
    if (this.autoFixed && typeof IntersectionObserver !== 'undefined') {
      this.$_initObserveIntersection();
    }
    this.updateSelectedBarX();
    if (typeof ResizeObserver !== 'undefined') {
      const refTabWrap = this.$refs.refTabWrap as HTMLElement;
      const observer = new ResizeObserver(() => {
        // console.log('ResizeObserver', refTabWrap.offsetWidth)
        this.updateSelectedBarX();
      });
      observer.observe(refTabWrap);
    }
  }
  $_initObserveIntersection() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isFixed = entry.intersectionRatio < 1;
        });
      },
      {
        threshold: [0, 0.9, 1],
      }
    );
    observer.observe(this.$refs.fakeTopArea as Element);
  }
  _changeTabIdx(idx: number, item: ITabItemOption) {
    this.$emit('change', idx);
    this.$trace(item.eventName, item.eventParams || {});
  }
  _tabTouched(e: TouchEvent, item: ITabItemOption) {
    const el = e.currentTarget as HTMLElement;
    const oldClassName = el.className || '';
    // console.log('_tabTouched', el, oldClassName)
    if (oldClassName.indexOf('tz-tab-touched') === -1) {
      el.className = oldClassName + ' tz-tab-touched';
      item._isTouching = true; //   __isTouching，   click   
      setTimeout(() => {
        item._isTouching = false;
        el.className = (el.className || '').replace('tz-tab-touched', '');
      }, 350);
    }
  }

  getSlotName(item: ITabItemOption, idx: number) {
    if (item.name) {
      return item.name;
    } else {
      return 'tab-' + idx;
    }
  }
}
</script>
