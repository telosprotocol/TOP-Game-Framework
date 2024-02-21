import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { getCheckInDaysCheckInRewardController } from '@/vservices/client/CheckInRewardController';
import Vue from 'vue';
/**
 *
 */
const stateItemVCheckinList = createHttpAsyncStateItem(
  () => {
    return getCheckInDaysCheckInRewardController();
  },
  null,
  'VCheckinList'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 2;
/**
 *
 */
export const VCheckinListMixin = Vue.extend({
  data() {
    return {
      stateItemVCheckinListRef: stateItemVCheckinList.ref,
    };
  },
  computed: {
    VCheckinList() {
      return this.stateItemVCheckinListRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVCheckinList(timeout?: number) {
      return stateItemVCheckinList.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVCheckinList;
