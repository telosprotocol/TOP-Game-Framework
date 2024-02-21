import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import { userAccountUserController } from '@/vservices/client/UserController';
export type IUserAccountVO = Required<API.UserAccountVO> & {
  /**
   * h5
   */
  turnTableTag?: string;
};

// function getVUserAccount() {
//   return userAccountUserController().then((resRaw) => {
//     const res = resRaw as IHttpResponse<IUserAccountVO>;
//     if (!res.success) {
//       return res;
//     }
//     const dailyTaskEndHour = res.data.dailyTaskEndHour;
//     return {
//       ...res,
//       data: {
//         ...res.data,
//         // UTC + 17
//         turnTableTag: getTimeDateTagByEndHour(res.servertime, dailyTaskEndHour),
//       },
//     };
//   });
// }

/**
 *  V
 */
const stateItemVUserAccount = createHttpAsyncStateItem(
  () => {
    return userAccountUserController();
  },
  null,
  'VUserAccount'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;
/**
 * V
 */
export const VUserAccountMixin = Vue.extend({
  data() {
    return {
      stateItemVUserAccountRef: stateItemVUserAccount.ref,
    };
  },
  computed: {
    UserAccount() {
      return this.stateItemVUserAccountRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVUserAccount(timeout?: number) {
      return stateItemVUserAccount.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVUserAccount;
