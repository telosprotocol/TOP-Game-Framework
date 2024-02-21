import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { queryUserQueueInfoWithdrawQueueController } from '@/vservices/client/WithdrawQueueController';
import Vue from 'vue';
import Component from 'vue-class-component';

/**
 *
 */
const stateItemVWithdrawQueue = createHttpAsyncStateItem(
  () => {
    return queryUserQueueInfoWithdrawQueueController();
  },
  null,
  'VWithdrawQueue'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;

@Component({})
export class VWithdrawQueueMixin extends Vue {
  stateItemVWithdrawQueueRef = stateItemVWithdrawQueue.ref;
  get WithdrawQueue() {
    return this.stateItemVWithdrawQueueRef.current;
  }

  get sWithdrawQueue() {
    return this.WithdrawQueue || ({} as Partial<API.WithdrawQueueUserVO>);
  }
  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  refreshVWithdrawQueue(timeout?: number) {
    return stateItemVWithdrawQueue.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVWithdrawQueue;
