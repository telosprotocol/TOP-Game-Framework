<template>
  <div ref="lottieWrap" v-show="value"></div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';

import type { AnimationItem } from 'lottie-web';
import { getLottieReady } from '@/utils/lottieTool';

/**
 *  ：lottie-web type
 */
@Component({})
export default class Lottie extends Vue {
  @Prop({
    type: Boolean,
    required: false,
  })
  value: boolean;
  @Prop({
    type: Function,
    default: null,
  })
  animationDataFunc: () => Promise<any>;
  @Prop({
    type: Object,
    default: null,
  })
  animationData: any;
  @Prop({
    type: Boolean,
    default: true,
  })
  autoplay: boolean;
  @Prop({
    type: Boolean,
    default: true,
  })
  autoInit: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  loop: boolean;

  isLottieLoaded = false;

  anim: AnimationItem | null = null;

  loadedAnimationData: any = null;

  get animData() {
    return this.animationData || this.loadedAnimationData;
  }
  mounted() {
    this.$nextTick(() => {
      this.loadAnimData();
    });
    this.$on('hook:beforeDestroy', this.tryDestory);
  }
  //#region Watch

  @Watch('value', {
    immediate: true,
  })
  onValueChanged(isShow: boolean) {
    if (this.anim) {
      //
      if (isShow) {
        if (this.autoplay) {
          this.anim.goToAndPlay(0);
        }
      } else {
        this.anim.pause();
      }
    } else if (isShow) {
      //  ，
      if (!this.isLottieLoaded) {
        //
        this.$nextTick(() => {
          getLottieReady(() => {
            this.isLottieLoaded = true;
          });
        });
      }
      if (!this.animData) {
        this.$nextTick(() => {
          this.loadAnimData();
        });
      }
    }
  }

  waitNextAnim = false;
  get needInitAnim() {
    return (
      this.isLottieLoaded &&
      this.value &&
      this.animData &&
      (this.autoInit || this.waitNextAnim)
    );
  }
  @Watch('needInitAnim', {
    immediate: true,
  })
  onNeedInitAnim(needInitAnim: boolean) {
    if (needInitAnim && !this.anim) {
      //  ，
      this._resetAnimtaion(false);
    }
  }
  //#endregion

  loadAnimData() {
    if (this.animationDataFunc) {
      this.animationDataFunc()
        .then((res) => {
          if (res) {
            this.loadedAnimationData = res;
          }
        })
        .catch((ex) => {
          console.log('anim data load error', ex);
        });
    }
  }

  tryDestory() {
    if (this.anim) {
      try {
        this.anim.destroy();
        this.anim = null;
      } catch (ex) {}
    }
  }

  /**
   *  anim
   */
  lastAnimateData: any;
  /**
   *  anim
   * @param forceDestroy  init( )
   */
  private _resetAnimtaion(forceDestroy: boolean) {
    if (this.anim && !forceDestroy) {
      return;
    }
    this.tryDestory();
    const animData = this.animData;

    const anim = (this.anim = window.lottie.loadAnimation({
      container: this.$refs.lottieWrap as HTMLDivElement,
      renderer: 'svg',
      loop: this.loop,
      autoplay: this.autoplay,
      animationData: animData,
    }));
    this.lastAnimateData = animData;
    this.$emit('ready', anim);
  }

  reloadAnimation() {
    if (this.isLottieLoaded) {
      this._resetAnimtaion(true);
    } else {
      this.tryDestory(); //  ， ready init
      this.waitNextAnim = true;
    }
  }

  replay() {
    if (this.anim) {
      //
      this.value = true; //show
      this.anim.goToAndPlay(0);
    } else {
      this.reloadAnimation();
    }
  }
}
</script>
