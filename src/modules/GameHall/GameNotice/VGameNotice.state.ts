import { onGBus } from '@/utils/GBus';
import Vue from 'vue';

export type IGameRollMessageItem = {
  message: string;
  id: string;
};
/**
 *     (      )
 */
export const VGameNoticeMixin = Vue.extend({
  mounted() {
    onGBus('onRollMessage', (json) => {
      this.gameNotice = json;
    });
  },
  data() {
    return {
      gameNotice: [] as IGameRollMessageItem[],
    };
  },
  methods: {},
});
