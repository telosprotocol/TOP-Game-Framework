import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { listWangzhuanPageGamesGameHallController } from '@/vservices/restful/GameHallController';
import Vue from 'vue';

const stateItemVEarnCashGameList = createHttpAsyncStateItem(
  () => {
    return listWangzhuanPageGamesGameHallController();
  },
  null,
  'GameList'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE;

export const VEarnCashGameListMixin = Vue.extend({
  data() {
    return {
      stateItemVEarnCashGameListRef: stateItemVEarnCashGameList.ref,
    };
  },
  computed: {
    EarnCashGameList() {
      return this.stateItemVEarnCashGameListRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVEarnCashGameList(timeout?: number) {
      return stateItemVEarnCashGameList.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVEarnCashGameList;
