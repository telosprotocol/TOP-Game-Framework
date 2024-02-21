<template>
  <div ref="wrap">
    <div
      :style="leftSwitch"
      v-if="navigation"
      :class="leftSwitchClass"
      @click="leftSwitchClick"
    >
      <slot name="left-switch"></slot>
    </div>
    <div
      :style="rightSwitch"
      v-if="navigation"
      :class="rightSwitchClass"
      @click="rightSwitchClick"
    >
      <slot name="right-switch"></slot>
    </div>
    <div
      ref="realBox"
      :style="pos"
      @mouseenter="enter"
      @mouseleave="leave"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <div ref="slotList" :style="float">
        <slot></slot>
      </div>
      <div v-html="copyHtml" :style="float"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '~@/styles/utils.less';
</style>

<script lang="ts">
{
  HTMLDivElement;
  HTMLDivElement;
  HTMLDivElement;
}

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

const DEFAULT_OPTIONS = {
  step: 1, //
  limitMoveNum: 5, //
  hoverStop: true, //      hover
  direction: 1, // 0    1    2   3
  openTouch: true, //     touch
  singleHeight: 0, //        hoverStop
  singleWidth: 0, //        hoverStop
  waitTime: 1000, //
  switchOffset: 30,
  autoPlay: true,
  navigation: false,
  switchSingleStep: 134,
  switchDelay: 400,
  switchDisabledClass: 'disabled',
  isSingleRemUnit: false, // singleWidth/singleHeight     rem
};

@Component({
  components: {},
})
export default class SeemlessScroll<T> extends Vue {
  $refs: {
    wrap: HTMLDivElement;
    realBox: HTMLDivElement;
    slotList: HTMLDivElement;
  };
  xPos = 0;
  yPos = 0;
  delay = 0;
  copyHtml = '';
  height = 0;
  ease = '';
  /**
   *
   */
  width = 0; // ;
  /**
   *
   */
  realBoxWidth = 0;

  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  data: T[];

  @Prop({
    type: Object,
    default() {
      return {};
    },
  })
  classOption: {
    /**
     * @default:1
     */
    step: number;
    /**
     *
     * @default: 5
     */
    limitMoveNum: number;
    /**
     *       hover
     * @default: true
     */
    hoverStop: boolean;
    /**
     * 0    1    2   3
     * @default: 1
     */
    direction: 0 | 1 | 2 | 3;
    /**
     *      touch
     * @default: true
     */
    openTouch: boolean;
    /**
     *         hoverStop
     * @default: 0
     */
    singleHeight: number;

    /**
     *         hoverStop
     * @default: 0
     */
    singleWidth: number;
    /**
     *
     * @default: 1000
     */
    waitTime: number;
    /**
     * @default: 30
     */
    switchOffset: number;
    /**
     * @default: true
     */
    autoPlay: boolean;
    /**
     * @default false
     */
    navigation: boolean;
    /**
     * @default:134
     */
    switchSingleStep: number;
    /**
     * @default:400
     */
    switchDelay: number;
    /**
     * @default: 'disabled'
     */
    switchDisabledClass: 'disabled' | '';
    /**
     * singleWidth/singleHeight     rem
     * @default :false
     */
    isSingleRemUnit: boolean;
  };

  @Watch('data')
  onDataUpdate(newData, _oldData) {
    this._dataWarm(newData);
    // //  data
    // if (!arrayEqual(newData, oldData)) {
    //   this.reset();
    // }
  }

  get leftSwitchState() {
    return this.xPos < 0;
  }
  get rightSwitchState() {
    return Math.abs(this.xPos) < this.realBoxWidth - this.width;
  }
  get leftSwitchClass() {
    return this.leftSwitchState ? '' : this.options.switchDisabledClass;
  }
  get rightSwitchClass() {
    return this.rightSwitchState ? '' : this.options.switchDisabledClass;
  }
  get leftSwitch() {
    return {
      position: 'absolute',
      margin: `${this.height / 2}px 0 0 -${this.options.switchOffset}px`,
      transform: 'translate(-100%,-50%)',
    };
  }
  get rightSwitch() {
    return {
      position: 'absolute',
      margin: `${this.height / 2}px 0 0 ${
        this.width + this.options.switchOffset
      }px`,
      transform: 'translateY(-50%)',
    };
  }
  get float() {
    return this.isHorizontal
      ? { float: 'left', overflow: 'hidden' }
      : { overflow: 'hidden' };
  }

  get pos() {
    return {
      transform: `translate(${this.xPos}px,${this.yPos}px)`,
      transition: `all ${this.ease} ${this.delay}ms`,
      overflow: 'hidden',
    };
  }

  get options() {
    return Object.assign({}, DEFAULT_OPTIONS, this.classOption);
  }
  get navigation() {
    return this.options.navigation;
  }
  get autoPlay() {
    if (this.navigation) return false;
    return this.options.autoPlay;
  }
  get scrollSwitch() {
    return this.data.length >= this.options.limitMoveNum;
  }
  get hoverStopSwitch() {
    return this.options.hoverStop && this.autoPlay && this.scrollSwitch;
  }
  get canTouchScroll() {
    return this.options.openTouch;
  }
  get isHorizontal() {
    return this.options.direction > 1;
  }
  get baseFontSize() {
    return this.options.isSingleRemUnit
      ? parseInt(
          window.getComputedStyle(document.documentElement, null).fontSize
        )
      : 1;
  }
  get realSingleStopWidth() {
    return this.options.singleWidth * this.baseFontSize;
  }
  get realSingleStopHeight() {
    return this.options.singleHeight * this.baseFontSize;
  }
  get step() {
    let singleStep;
    let step = this.options.step;
    if (this.isHorizontal) {
      singleStep = this.realSingleStopWidth;
    } else {
      singleStep = this.realSingleStopHeight;
    }
    if (singleStep > 0 && singleStep % step > 0) {
      console.error('         ,step         ,                   。~~~~~');
    }
    return step;
  }

  reset() {
    this._cancle();
    this._initMove();
  }
  leftSwitchClick() {
    if (!this.leftSwitchState) return;
    //
    if (Math.abs(this.xPos) < this.options.switchSingleStep) {
      this.xPos = 0;
      return;
    }
    this.xPos += this.options.switchSingleStep;
  }
  rightSwitchClick() {
    if (!this.rightSwitchState) return;
    //
    if (
      this.realBoxWidth - this.width + this.xPos <
      this.options.switchSingleStep
    ) {
      this.xPos = this.width - this.realBoxWidth;
      return;
    }
    this.xPos -= this.options.switchSingleStep;
  }
  _cancle() {
    if (this.reqFrame != null) {
      cancelAnimationFrame(this.reqFrame);
    }
  }
  touchStart(e) {
    if (!this.canTouchScroll) return;
    let timer;
    const touch = e.targetTouches[0]; //touches            touch，    touch
    const { waitTime, singleHeight, singleWidth } = this.options;
    this.startPos = {
      x: touch.pageX,
      y: touch.pageY,
    }; //    touch
    this.startPosY = this.yPos; //  touchStart   posY
    this.startPosX = this.xPos; //  touchStart   posX
    if (!!singleHeight && !!singleWidth) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        this._cancle();
      }, waitTime + 20);
    } else {
      this._cancle();
    }
  }
  startPosX: number;
  startPosY: number;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  realBoxHeight: number;
  touchMove(e) {
    //      touch        ，    move
    if (
      !this.canTouchScroll ||
      e.targetTouches.length > 1 ||
      (e.scale && e.scale !== 1)
    )
      return;
    const touch = e.targetTouches[0];
    const { direction } = this.options;
    this.endPos = {
      x: touch.pageX - this.startPos.x,
      y: touch.pageY - this.startPos.y,
    };
    event.preventDefault(); //           ，
    const dir = Math.abs(this.endPos.x) < Math.abs(this.endPos.y) ? 1 : 0; //dir，1      ，0
    if (dir === 1 && direction < 2) {
      //        &&
      this.yPos = this.startPosY + this.endPos.y;
    } else if (dir === 0 && direction > 1) {
      //       &&
      this.xPos = this.startPosX + this.endPos.x;
    }
  }
  touchEnd() {
    if (!this.canTouchScroll) return;
    let timer;
    const direction = this.options.direction;
    this.delay = 50;
    if (direction === 1) {
      if (this.yPos > 0) this.yPos = 0;
    } else if (direction === 0) {
      let h = (this.realBoxHeight / 2) * -1;
      if (this.yPos < h) this.yPos = h;
    } else if (direction === 2) {
      if (this.xPos > 0) this.xPos = 0;
    } else if (direction === 3) {
      let w = this.realBoxWidth * -1;
      if (this.xPos < w) this.xPos = w;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      this.delay = 0;
      this._move();
    }, this.delay);
  }
  enter() {
    if (this.hoverStopSwitch) this._stopMove();
  }
  leave() {
    if (this.hoverStopSwitch) this._startMove();
  }
  isHover: boolean;
  reqFrame: number;
  singleWaitTime: number;
  _move() {
    //        _move()
    if (this.isHover) return;
    this._cancle(); //  move            touchMove
    this.reqFrame = requestAnimationFrame(() => {
      const h = this.realBoxHeight / 2; //
      const w = this.realBoxWidth / 2; //
      let { direction, waitTime } = this.options;
      let { step } = this;
      if (direction === 1) {
        //
        if (Math.abs(this.yPos) >= h) {
          this.$emit('ScrollEnd');
          this.yPos = 0;
        }
        this.yPos -= step;
      } else if (direction === 0) {
        //
        if (this.yPos >= 0) {
          this.$emit('ScrollEnd');
          this.yPos = h * -1;
        }
        this.yPos += step;
      } else if (direction === 2) {
        //
        if (Math.abs(this.xPos) >= w) {
          this.$emit('ScrollEnd');
          this.xPos = 0;
        }
        this.xPos -= step;
      } else if (direction === 3) {
        //
        if (this.xPos >= 0) {
          this.$emit('ScrollEnd');
          this.xPos = w * -1;
        }
        this.xPos += step;
      }
      if (this.singleWaitTime) clearTimeout(this.singleWaitTime);
      if (this.realSingleStopHeight) {
        //
        if (Math.abs(this.yPos) % this.realSingleStopHeight < step) {
          //       waitTime
          this.singleWaitTime = setTimeout(() => {
            this._move();
          }, waitTime);
        } else {
          this._move();
        }
      } else if (this.realSingleStopWidth) {
        if (Math.abs(this.xPos) % this.realSingleStopWidth < step) {
          //       waitTime
          this.singleWaitTime = setTimeout(() => {
            this._move();
          }, waitTime);
        } else {
          this._move();
        }
      } else {
        this._move();
      }
    });
  }
  _initMove() {
    this.$nextTick(() => {
      const { switchDelay } = this.options;
      const { autoPlay, isHorizontal } = this;
      this._dataWarm(this.data);
      this.copyHtml = ''; //  copy
      if (isHorizontal) {
        this.height = this.$refs.wrap.offsetHeight;
        this.width = this.$refs.wrap.offsetWidth;
        let slotListWidth = this.$refs.slotList.offsetWidth;
        //       warp width
        if (autoPlay) {
          //   offsetWidth
          slotListWidth = slotListWidth * 2 + 1;
        }
        this.$refs.realBox.style.width = slotListWidth + 'px';
        this.realBoxWidth = slotListWidth;
      }

      if (autoPlay) {
        this.ease = 'ease-in';
        this.delay = 0;
      } else {
        this.ease = 'linear';
        this.delay = switchDelay;
        return;
      }

      //
      if (this.scrollSwitch) {
        let timer;
        if (timer) clearTimeout(timer);
        this.copyHtml = this.$refs.slotList.innerHTML;
        setTimeout(() => {
          this.realBoxHeight = this.$refs.realBox.offsetHeight;
          this._move();
        }, 0);
      } else {
        this._cancle();
        this.yPos = this.xPos = 0;
      }
    });
  }
  _dataWarm(data) {
    if (data.length > 100) {
      console.warn(`     ${data.length}     ~,              。`);
    }
  }
  _startMove() {
    this.isHover = false; //  _move
    this._move();
  }
  _stopMove() {
    this.isHover = true; //  _move
    //     hover      ,
    if (this.singleWaitTime) clearTimeout(this.singleWaitTime);
    this._cancle();
  }

  mounted() {
    this._initMove();
  }

  beforeCreate() {
    this.reqFrame = null; // move   animationFrame
    this.singleWaitTime = null; // single
    this.isHover = false; // mouseenter mouseleave   this._move()
    this.ease = 'ease-in';
  }
  beforeDestroy() {
    this._cancle();
    clearTimeout(this.singleWaitTime);
  }

  @Watch('autoPlay')
  onAutoPlay(bol: boolean) {
    if (bol) {
      this.reset();
    } else {
      this._stopMove();
    }
  }
}
</script>
<!--
<i18n>
{
  "en":{
  }
  "id":{
  }
}
</i18n>
-->
<!--
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
@Component({
  components: {}
})
export default class SeemlessScroll extends Vue {
  beforeCreate() {
    this.reqFrame = null; // move   animationFrame   
    this.singleWaitTime = null; // single         
    this.isHover = false; // mouseenter mouseleave   this._move()   
    this.ease = 'ease-in';
  }

  beforeDestroy() {
    this._cancle();
    clearTimeout(this.singleWaitTime);
  }
}
</script>
-->
