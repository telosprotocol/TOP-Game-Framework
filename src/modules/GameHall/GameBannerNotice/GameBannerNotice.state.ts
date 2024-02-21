import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { getWithdrawRechargeScrollDisplayPayOrderController } from '@/vservices/restful/PayOrderController';
import Vue from 'vue';
import Component from 'vue-class-component';

/**
 *
 */
const stateItemGameBannerNotice = createHttpAsyncStateItem(
  () => {
    return getWithdrawRechargeScrollDisplayPayOrderController({ count: 20 });
  },
  null,
  'GameBannerNotice'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 10;

@Component({})
export class GameBannerNoticeMixin extends Vue {
  stateItemGameBannerNoticeRef = stateItemGameBannerNotice.ref;
  get GameBannerNotice() {
    return this.stateItemGameBannerNoticeRef.current;
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  refreshGameBannerNotice(timeout?: number) {
    return stateItemGameBannerNotice.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemGameBannerNotice;
