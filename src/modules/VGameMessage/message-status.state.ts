import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { getReadMessageController } from '@/vservices/client/MessageController';
import Vue from 'vue';

/**
 *
 */
const stateItemVMessageStatus = createHttpAsyncStateItem(
  () => {
    // return getHasReadMessagePreReq().then(() => {
    return getReadMessageController();
    //});
  },
  null,
  'VMessageStatus'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 2;
/**
 * V
 */
export const VMessageStatusMixin = Vue.extend({
  data() {
    return {
      stateItemVMessageStatusRef: stateItemVMessageStatus.ref,
    };
  },
  computed: {
    VMessageStatus() {
      return this.stateItemVMessageStatusRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVMessageStatus(timeout?: number) {
      return stateItemVMessageStatus.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVMessageStatus;
