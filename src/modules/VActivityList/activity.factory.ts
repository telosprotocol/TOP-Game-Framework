import { createHttpAsyncStateItemWithLSCache } from '@/controller/AsyncStateItemWithLsCache';
import { MS_MINUTE } from '@/constants/time';
import { listActivitiesManagementController } from '@/vservices/client/ActivitiesManagementController';
import Vue from 'vue';

export function createActivityMixin(
  lsKey: 'VActivityHallListMixin' | 'VActivityPageListMixin',
  query: API.UserActivitiesManagementListAO,
  defaultValue?: API.ActivitiesManagementVO[] | null
) {
  /**
   *
   */
  const stateItemVActivityList = createHttpAsyncStateItemWithLSCache(
    lsKey,
    () => {
      return listActivitiesManagementController(query);
    },
    defaultValue || null
  );
  //   revalidation for tab active
  const REVALIDATION_MS = MS_MINUTE * 3;
  /**
   *
   */
  const VActivityListMixin = Vue.extend({
    data() {
      return {
        stateItemVActivityListRef: stateItemVActivityList.ref,
      };
    },
    computed: {
      VActivityList() {
        return this.stateItemVActivityListRef.current;
      },
    },
    methods: {
      /**
       *
       * @param timeout     ，     revalidation  ，   0
       */
      refreshVActivityList(timeout?: number) {
        return stateItemVActivityList.tryUpdate(
          timeout == null ? REVALIDATION_MS : timeout
        );
      },
    },
  });

  return {
    VActivityListMixin,
    stateItemVActivityList,
  };
}
