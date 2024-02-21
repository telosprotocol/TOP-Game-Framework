<template>
  <div
    class="relative text-[18px] robot-bold shrink-0"
    :class="[skin === 'dark' ? 'text-white' : 'text-[#333]']"
    :style="{ height: $__headFullHeight + 'px' }"
  >
    <div
      :class="{
        'w-[360px]': true,
        'fixed bg-white z-20': !dontFixed,
      }"
      :style="{
        height: $__headFullHeight + 'px',
        background: barBackground,
        paddingTop: $__headFullHeight - $__headHeight + 'px',
      }"
    >
      <slot name="beforeInner"></slot>
      <div
        class="relative w-full"
        :style="{
          height: $__headHeight + 'px',
        }"
      >
        <div class="h-full flex items-center px-4 leading-none">
          <slot name="leftIcon" v-bind="$__slotProps" :header-top="headerTop">
            <div
              v-if="leftIcon"
              class="iconfont w-[30px] h-[30px] text-2xl leading-none mr-2 -ml-2 inline-flex justify-center items-center rounded-full"
              :class="$__leftIconClass"
              @click="$__leftIconHandler"
              v-trace:[leftIconEvent]="leftIconEventData"
            ></div>
          </slot>
          <div
            class="flex-1 w-0 overflow-hidden h-full items-center flex"
            @click="disableDebug ? null : showVersion()"
          >
            <slot name="default" :header-top="headerTop">
              {{ title }}
            </slot>
          </div>
          <slot name="right" :header-top="headerTop"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { goBackForAppBrowser } from '@/js_bridge/appCallJs/onWebviewBack';
import { hideDelayLoading, showDelayLoading } from '@/utils/loadingTool';
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

const MAIN_HEIGHT = 56;

/**
 *     （  fixed)
 *  ：
 */

const HeaderTopPropComp = Vue.extend({
  props: {
    //     statusBar
    hasStatusBar: {
      type: Boolean,
      default: false,
    },
    disableDebug: {
      type: Boolean,
      default: false,
    },
    designHeight: {
      type: Number,
      default: MAIN_HEIGHT,
    },
    /**
     *   skin
     * dark:
     * default:
     * -lightimg:
     * -darkimg:        ，
     */
    skin: {
      type: String as PropType<'dark' | 'default'>,
      default: 'default',
    },

    //      ，    ，fixed
    barBackground: {
      type: String,
      default: '',
    },
    leftIcon: {
      //    slot:leftIcon
      type: String,
      default: undefined,
    },
    /**
     *        ，    ，    back
     */
    leftIconClick: {
      type: Function,
      default: undefined,
    },
    leftIconEvent: {
      type: String,
      default: undefined,
    },
    leftIconEventData: {
      type: Object,
      default: undefined,
    },
    title: {
      //       slot
      type: String,
      default: undefined,
    },
    /**
     *
     */
    dontFixed: {
      type: Boolean,
      default: false,
    },
  },
});
@Component
export default class HeaderTop extends HeaderTopPropComp {
  get $__leftIconClass() {
    return this.leftIcon;
  }

  get headerTop() {
    return this;
  }

  get statusBarHeight() {
    return this.$ss.getters.statusBarHeight;
  }

  @Watch('$__headFullHeight', { immediate: true })
  onHeaderFullHeightChange(height: number) {
    this.$emit('heightUpdate', height);
  }

  get $__headFullHeight() {
    if (this.hasStatusBar) {
      //16=1rem
      return this.$__headHeight + this.statusBarHeight;
    } else {
      return this.$__headHeight;
    }
  }
  get $__headHeight() {
    return this.$ss.getters.designPxToReal(this.designHeight);
  }
  get $__leftIconHandler() {
    if (this.leftIconClick) {
      return this.leftIconClick;
    }
    return this.goBack;
  }
  get $__slotProps() {
    return {
      goBack: this.goBack,
    };
  }
  getHeadTopBarHeight() {
    return this.$__headFullHeight;
  }
  goBack() {
    goBackForAppBrowser();
  }

  //#region DebugTool
  /**
   *
   */
  versionClickCnt = 0;
  lastVersionCodeTimer: ReturnType<typeof setTimeout> = null;
  showVersion() {
    this.versionClickCnt++;
    const versionEl = document.getElementById('version');
    const showCount = process.env.VUE_APP_ENV_SERVER !== 'production' ? 3 : 10;
    if (versionEl.style.display === 'block') {
      if (process.env.VUE_APP_ENV_SERVER !== 'production') {
        //
        showDelayLoading(false);
        import('@/components/Biz/DebugTool/index').then((debugTool) => {
          hideDelayLoading();
          debugTool.showDebugTool();
        });
      }
    }
    if (this.versionClickCnt >= showCount) {
      this.versionClickCnt = 0;
      versionEl.style.display = 'block';
      versionEl.style.color = this.skin === 'dark' ? 'white' : 'black';
      const GC = window.GC;
      let hv = this.$route.query.hv || '';
      if (hv) {
        hv = '-' + hv;
      }
      versionEl.innerHTML = `${GC.h5Version}-${GC.buildNum}-${GC.appName}${hv}`;
    }
    if (this.lastVersionCodeTimer) {
      clearTimeout(this.lastVersionCodeTimer);
    }
    this.lastVersionCodeTimer = setTimeout(() => {
      this.lastVersionCodeTimer = null;
      this.versionClickCnt = 0;
    }, 3000);
  }
  //#endregion
}
</script>
