import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { getWithdrawScrollDisplayWithdrawalController } from '@/vservices/restful/WithdrawalController';
import Vue from 'vue';
import Component from 'vue-class-component';

const stateItemGoldWithdrawMarqueue = createHttpAsyncStateItem(
  () => {
    return getWithdrawScrollDisplayWithdrawalController({ count: 20 });
  },
  null,
  'GoldWithdrawMarqueue'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE;

@Component({})
export class GoldWithdrawMarqueueMixin extends Vue {
  stateItemGoldWithdrawMarqueueRef = stateItemGoldWithdrawMarqueue.ref;
  get GoldWithdrawMarqueue() {
    return this.stateItemGoldWithdrawMarqueueRef.current;
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  refreshGoldWithdrawMarqueue(timeout?: number) {
    return stateItemGoldWithdrawMarqueue.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemGoldWithdrawMarqueue;
