import Vue from 'vue';
import GameToast from './GameToast.vue';
interface LocaleMessageArray {
  [index: number]: LocaleMessage;
}
type MessageFunction = (ctx: any) => string;
type LocaleMessage =
  | string
  | MessageFunction
  | LocaleMessageObject
  | LocaleMessageArray;
interface LocaleMessageObject {
  [key: string]: LocaleMessage;
}
const queue: GameToast[] = [];
function createInstance() {
  // queue = queue.filter(
  //   (item) => !item.$el.parentNode || isInDocument(item.$el)
  // );

  if (!queue.length) {
    const toastEl = document.createElement('div');
    document.body.appendChild(toastEl);
    const GameToastConstructor = Vue.extend(GameToast);
    const toast = new GameToastConstructor().$mount(toastEl) as GameToast;
    toast.$on('input', (value: boolean) => {
      toast.value = value;
    });

    queue.push(toast);
  }

  return queue[queue.length - 1];
}

export default function createGameToast(
  msg: string | { [key: string]: LocaleMessageObject },
  options?: { duration: number }
) {
  const { duration = 2000 } = options || {};
  const toast = createInstance();
  toast.message = msg as string;
  toast.duration = 0;
  toast.value = true;
  // should add z-index if previous toast has not disappeared
  if (toast.value) {
    toast.updateZIndex();
  }
  if ((toast as any).timer) {
    clearTimeout((toast as any).timer);
  }
  if (duration > 0) {
    (toast as any).timer = setTimeout(() => {
      toast.value = false;
    }, duration);
  }
}
