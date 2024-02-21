import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { itemPagePointController } from '@/vservices/client/PointController';
import Vue from 'vue';

/**
 * Higgs
 */
const stateItemVHiggsRedeem = createHttpAsyncStateItem(
  () => {
    return itemPagePointController({ pageIndex: 1, pageSize: 100 });
  },
  null,
  'VHiggsRedeem'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;

/**
 * Higgs
 */
export const VHiggsRedeemMixin = Vue.extend({
  data() {
    return {
      stateItemVHiggsRedeemRef: stateItemVHiggsRedeem.ref,
    };
  },
  computed: {
    VHiggsRedeem() {
      return this.stateItemVHiggsRedeemRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVHiggsRedeem(timeout?: number) {
      return stateItemVHiggsRedeem.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVHiggsRedeem;
