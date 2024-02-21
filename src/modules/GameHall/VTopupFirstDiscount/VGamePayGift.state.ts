import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { hallGetPayGiftController } from '@/vservices/client/PayGiftController';
import Vue from 'vue';
import Component from 'vue-class-component';

/**
 *
 */
const stateItemVGamePayGift = createHttpAsyncStateItem(
  hallGetPayGiftController,
  null,
  'HallPayGift'
);

//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;

@Component({})
export class VGamePayGiftMixin extends Vue {
  stateItemVGamePayGiftRef = stateItemVGamePayGift.ref;

  get PayGiftInfo() {
    return this.stateItemVGamePayGiftRef.current;
  }

  /**
   * @param timeout     ，       revalidation  ，   0
   */
  refreshVGamePayGift(timeout?: number) {
    return stateItemVGamePayGift.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVGamePayGift;
