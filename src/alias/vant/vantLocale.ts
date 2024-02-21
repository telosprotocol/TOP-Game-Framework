/**
 *
 */

import Vue from 'vue';
import { deepAssign } from 'vant/es/utils/deep-assign';

const proto = Vue.prototype;
const { defineReactive } = (Vue as any).util;
defineReactive(proto, '$vantLang', 'en-US');
defineReactive(proto, '$vantMessages', {
  'en-US': {
    loading: 'Loading...',
    vanPullRefresh: {
      pulling: 'Pull to refresh...',
      loosing: 'Loose to refresh...',
    },
  },
});

export default {
  messages() {
    return proto.$vantMessages[proto.$vantLang];
  },

  use(lang: string, messages?: any) {
    proto.$vantLang = lang;
    this.add({ [lang]: messages });
  },

  add(messages = {}) {
    deepAssign(proto.$vantMessages, messages);
  },
};
