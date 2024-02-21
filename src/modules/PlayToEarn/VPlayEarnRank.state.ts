import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { userPlayGameWeekRankingForuneCenterController } from '@/vservices/restful/ForuneCenterController';
import Vue from 'vue';

/**
 *  V
 */
const stateItemVPlayEarnWeekRank = createHttpAsyncStateItem(
  () => {
    return userPlayGameWeekRankingForuneCenterController();
  },
  null,
  'VPlayEarnWeekRank'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;
/**
 * V
 */
export const VPlayEarnWeekRankMixin = Vue.extend({
  data() {
    return {
      stateItemVPlayEarnWeekRankRef: stateItemVPlayEarnWeekRank.ref,
    };
  },
  computed: {
    PlayEarnWeekRank() {
      return this.stateItemVPlayEarnWeekRankRef.current;
    },
  },
  methods: {
    /**
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVPlayEarnWeekRank(timeout?: number) {
      return stateItemVPlayEarnWeekRank.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVPlayEarnWeekRank;
