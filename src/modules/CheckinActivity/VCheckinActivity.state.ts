import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { checkinActivityUserFissionController } from '@/vservices/client/UserFissionController';
import { noLoginCheckinActivityUserFissionController } from '@/vservices/restful/UserFissionController';
import Vue from 'vue';

/**
 *
 */
const stateItemVCheckinActivity = createHttpAsyncStateItem(
  async () => {
    const isLogined = await waitUserIsLoginedAuth();
    if (!isLogined) {
      return noLoginCheckinActivityUserFissionController();
    }
    return checkinActivityUserFissionController();
  },
  null,
  'VCheckinActivity'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;
/**
 * V
 */
export const VCheckinActivityMixin = Vue.extend({
  data() {
    return {
      stateItemVCheckinActivityRef: stateItemVCheckinActivity.ref,
    };
  },
  computed: {
    VCheckinActivity() {
      return this.stateItemVCheckinActivityRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVCheckinActivity(timeout?: number) {
      return stateItemVCheckinActivity.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVCheckinActivity;
