import GlobalAudioController from '@/controller/audio/GlobalAudioController';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { GlobalDlgStack } from './GlobalDlgStack';
let curZIndex = 1001;
@Component<BaseDlgMixin>({
  model: {
    prop: 'value',
    event: 'input',
  },
})
export default class BaseDlgMixin extends Vue {
  dlgSound?: boolean;

  /**
   *     ，
   */
  cantReturn?: boolean;

  dontUpdateZIndex?: boolean;

  beforeDestroy() {
    GlobalDlgStack.Instance.delete(this);
  }
  /**
   *             ，
   */
  declare $refs: { dlgWrap?: HTMLDivElement };
  @Prop({
    type: Boolean,
    required: false,
  })
  value: boolean;
  emitDlgVisible(value: boolean) {
    this.$emit('input', value);
  }
  private __dlgValueFalseCbList: ((v: unknown) => void)[];

  @Watch('value')
  __ValueWatchBase(isOpen: boolean) {
    // console.log('[DEBUG]-base', isOpen, this.$vnode.tag, this.$el, this);
    if (isOpen) {
      GlobalDlgStack.Instance.push(this);
      if (this.dlgSound) {
        GlobalAudioController.Instance.tryPlayAudio('dlgOpen');
      }
      if (!this.dontUpdateZIndex) {
        this.$nextTick(() => {
          // console.log('[DEBUG]-tick', isOpen, this.$vnode.tag, this.$el, this);
          this.updateZIndex();
        });
      }
    } else {
      GlobalDlgStack.Instance.delete(this);
      if (this.dlgSound) {
        GlobalAudioController.Instance.tryPlayAudio('dlgClose');
      }
      dealCallback(this.__dlgValueFalseCbList);
      this.__dlgValueFalseCbList = null;
    }

    function dealCallback(cbList: ((v?: unknown) => void)[]) {
      if (!cbList) {
        return;
      }
      cbList.forEach((item) => {
        if (item) {
          item();
        }
      });
    }
  }

  /**
   *
   * @returns
   */
  waitDlgClose() {
    return new Promise((resolve) => {
      if (!this.__dlgValueFalseCbList) {
        this.__dlgValueFalseCbList = [];
      }
      this.__dlgValueFalseCbList.push(resolve);
    });
  }
  updateZIndex(value = 0) {
    const dlgWrap = this.$refs.dlgWrap;
    const el = this.$el as HTMLDivElement;
    const realWrap = dlgWrap || el;

    if (!dlgWrap && el) {
      if (el.nodeType === Node.ELEMENT_NODE) {
        if (getComputedStyle(el).position === 'static') {
          //      div
          el.style.position = 'relative'; //   （      zIndex   static ）
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.error('Your dlg is not config ref=dlgWrap!!!');
          }
        }
      }
      // else if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      //   console.log('el is not a elementNode', el);
      // }
    }
    if (realWrap && realWrap.style) {
      const toZIndex = String(++curZIndex + value);
      realWrap.style.zIndex = toZIndex;
    }
  }
}
