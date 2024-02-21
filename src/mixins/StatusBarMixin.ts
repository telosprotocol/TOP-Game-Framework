import Vue from 'vue';
import store from '../store/index';
import { BindEventMixin } from './BindEventMixin';

export function getIsDark(color: string) {
  const colorList = [1, 3, 5].map((startIdx) => {
    const colorStr = color.substring(startIdx, startIdx + 2);
    const iColor = parseInt(colorStr, 16);
    return iColor;
  });
  const grayLevel =
    colorList[0] * 0.299 + colorList[1] * 0.589 + colorList[2] * 0.114;
  return grayLevel < 192;
}
function refreshStatusColor(color: string, isDark: boolean) {
  if (color) {
    store.commit('bridge/setStatusColor', { color, isDark });
  }
}

const bindEventMixin = BindEventMixin<any>(function (_bind, isBind) {
  if (isBind) {
    if (this.statusBarColor) {
      refreshStatusColor(this.statusBarColor, this.isDark);
    }
  }
});

/**
 *  ：     Page
 */
const StatusBarMixin = Vue.extend({
  mixins: [bindEventMixin],
  data() {
    return {
      statusBarColor: '#ffffff',
      isDark: false,
    };
  },
  watch: {
    statusBarColor: {
      handler(color) {
        refreshStatusColor(color, this.isDark);
      },
    },
  },
});
// type StatusBarMixinType = typeof StatusBarMixin

/**
 *
 */
export default StatusBarMixin;
