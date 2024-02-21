import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItemWithLSCache } from '@/controller/AsyncStateItemWithLsCache';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { statUserFissionController } from '@/vservices/client/UserFissionController';
import { noLoginStatUserFissionController } from '@/vservices/restful/UserFissionController';
import Vue from 'vue';
/**
 *
 */
const stateItemVUserFissionStat = createHttpAsyncStateItemWithLSCache(
  'VUserFissionStat',
  async () => {
    const isLogined = await waitUserIsLoginedAuth();
    if (!isLogined) {
      return noLoginStatUserFissionController().then((res) => {
        if (res.success) {
          res.data.userGoldAmount =
            (res.data.smallWithdrawAmountLimit || 0) + '';
          // res.data.unclaimedGoldAmount = res.data.smallWithdrawAmountLimit || 0;
        }
        return res;
      });
    }
    return statUserFissionController();
  },
  null
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;
/**
 *
 */
export const VUserFissionStatMixin = Vue.extend({
  data() {
    return {
      stateItemVUserFissionStatRef: stateItemVUserFissionStat.ref,
    };
  },
  computed: {
    VUserFissionStat() {
      return this.stateItemVUserFissionStatRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVUserFissionStat(timeout?: number) {
      return stateItemVUserFissionStat.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVUserFissionStat;
