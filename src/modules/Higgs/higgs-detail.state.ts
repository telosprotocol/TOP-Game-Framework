import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { flopDetailWashVolumeController } from '@/vservices/client/WashVolumeController';
import Vue from 'vue';
/**
 *  Higgis
 */
const stateItemVHiggsDetail = createHttpAsyncStateItem(
  () => {
    return flopDetailWashVolumeController();
  },
  null,
  'VHiggsDetail'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;
/**
 *  Higgis
 */
export const VHiggsDetailMixin = Vue.extend({
  data() {
    return {
      stateItemVHiggsDetailRef: stateItemVHiggsDetail.ref,
    };
  },
  computed: {
    VHiggsDetail() {
      return this.stateItemVHiggsDetailRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，     revalidation  ，   0
     */
    refreshVHiggsDetail(timeout?: number) {
      return stateItemVHiggsDetail.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVHiggsDetail;
