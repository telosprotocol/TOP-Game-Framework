import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { getCheckInfoCheckInRewardController } from '@/vservices/client/CheckInRewardController';
import Vue from 'vue';
/**
 *
 */
const stateItemVCheckinStatus = createHttpAsyncStateItem(
  () => {
    return getCheckInfoCheckInRewardController();
  },
  null,
  'VCheckinStatus'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;
/**
 *
 */
export const VCheckinStatusMixin = Vue.extend({
  data() {
    return {
      stateItemVCheckinStatusRef: stateItemVCheckinStatus.ref,
    };
  },
  computed: {
    VCheckinStatus() {
      return this.stateItemVCheckinStatusRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVCheckinStatus(timeout?: number) {
      return stateItemVCheckinStatus.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVCheckinStatus;
