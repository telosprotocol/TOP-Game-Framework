import { TouchMixin } from '@/mixins/touch';
import { off, on, preventDefault } from '@/utils/dom/event';
import { getScroller } from '@/utils/dom/scroll';
import { mixins } from 'vue-class-component';
import { Component, Watch } from 'vue-property-decorator';
import BaseDlgMixin from './BaseDlgMixin';

let lockCount = 0;

@Component<PopupMixin>({})
export default class PopupMixin extends mixins(TouchMixin, BaseDlgMixin) {
  private popupOpened: boolean;

  @Watch('value', {
    immediate: true,
  })
  __ValueWatch(isOpen: boolean) {
    if (isOpen) {
      this.openPopup();
    } else {
      this.closePopup();
    }
  }

  private openPopup() {
    if (this.popupOpened) {
      return;
    }
    this.popupOpened = true;
    this.$emit('input', true);
    this.addLock();
  }
  private closePopup() {
    if (!this.popupOpened) {
      return;
    }
    this.popupOpened = false;
    this.$emit('input', false);
    this.removeLock();
  }

  private onTouchMove(event: TouchEvent) {
    // vant
    this.touchMove(event);
    const el = getScroller(
      event.target as HTMLElement,
      this.$el as HTMLElement
    );
    const { scrollHeight, offsetHeight, scrollTop } = el as HTMLElement;
    // Start to prevent Default
    if (this.direction !== 'vertical') {
      return;
    }
    //
    const isDown = this.deltaY > 0;
    if (scrollTop === 0) {
      const noScrollContent = offsetHeight >= scrollHeight;
      if (!noScrollContent && !isDown) {
        //      ，    ，   prevent
        return;
      }
      //    ，
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      if (isDown) {
        return;
      }
      //     ，
    }
    preventDefault(event, true);
    return false;
  }

  private removeLock() {
    if (lockCount) {
      lockCount--;
    }
    if (!lockCount) {
      document.body.classList.remove('overflow-hidden');
    }
    off(document, 'touchstart', this.touchStart);
    off(document, 'touchmove', this.onTouchMove);
  }
  private addLock() {
    on(document, 'touchstart', this.touchStart);
    on(document, 'touchmove', this.onTouchMove);
    if (!lockCount) {
      document.body.classList.add('overflow-hidden');
      lockCount++;
    }
  }

  beforeDestroy() {
    if (this.popupOpened) {
      this.removeLock();
    }
  }
}
