import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItemWithLSCache } from '@/controller/AsyncStateItemWithLsCache';
import {
  hallV4GameHallController,
  hallV5GameHallController,
} from '@/vservices/restful/GameHallController';
import Vue from 'vue';
export type IVGameIconInfoItem = RAPI.GameInfoV2VO;

/**
 *       -
 */
const stateItemVGameList = createHttpAsyncStateItemWithLSCache(
  'VGameList',
  () => {
    if (checkMinVersionName('2.9.1.0')) {
      return hallV5GameHallController();
    }
    return hallV4GameHallController();
  },
  null
);

//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;
/**
 *
 */
export const VGameListMixin = Vue.extend({
  data() {
    return {
      stateItemVGameListRef: stateItemVGameList.ref,
    };
  },
  computed: {
    GameList() {
      return this.stateItemVGameListRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVGameList(timeout?: number) {
      return stateItemVGameList.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVGameList;
