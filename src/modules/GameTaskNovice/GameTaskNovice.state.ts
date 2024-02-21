import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { vGameNoviceFiveDaysTaskController } from '@/vservices/client/TaskController';
import Vue from 'vue';

const stateItemVGameTaskNovice = createHttpAsyncStateItem(
  () => {
    return vGameNoviceFiveDaysTaskController();
  },
  null,
  'GameTaskNovice'
);
const REVALIDATION_MS = MS_MINUTE * 2;

/**
 *
 */
export const VGameTaskNoviceMixin = Vue.extend({
  data() {
    return {
      stateItemVGameTaskNoviceRef: stateItemVGameTaskNovice.ref,
    };
  },
  computed: {
    GameTaskNovice() {
      return this.stateItemVGameTaskNoviceRef?.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVGameTaskNovice(timeout?: number) {
      return stateItemVGameTaskNovice.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVGameTaskNovice;
