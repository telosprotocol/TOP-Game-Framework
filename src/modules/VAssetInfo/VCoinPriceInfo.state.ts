import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { priceInfoDailyCoinPriceLogController } from '@/vservices/restful/DailyCoinPriceLogController';

import Vue from 'vue';

/**
 *     (         )
 */
const stateItemVCoinPriceInfo = createHttpAsyncStateItem(
  () => {
    return priceInfoDailyCoinPriceLogController();
  },
  null,
  'VCoinPriceInfo'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;
/**
 *          （            ）
 */
export const VCoinPriceInfoMixin = Vue.extend({
  data() {
    return {
      stateItemVCoinPriceInfoRef: stateItemVCoinPriceInfo.ref,
    };
  },
  computed: {
    CoinPriceInfo() {
      return this.stateItemVCoinPriceInfoRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVCoinPriceInfo(timeout?: number) {
      return stateItemVCoinPriceInfo.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVCoinPriceInfo;
