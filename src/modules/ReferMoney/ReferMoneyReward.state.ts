import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import Component from 'vue-class-component';
import { queryInviteRewardUserFissionController } from '@/vservices/client/UserFissionController';

const stateItemInviteRewardInfo = createHttpAsyncStateItem(
  () => {
    return queryInviteRewardUserFissionController();
  },
  null,
  'InviteRewardInfo'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;

@Component({})
export class InviteRewardInfoMixin extends Vue {
  stateItemInviteRewardInfoRef = stateItemInviteRewardInfo.ref;

  get InviteRewardInfoInfo() {
    return this.stateItemInviteRewardInfoRef.current;
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  async refreshInviteRewardInfo(timeout?: number) {
    return stateItemInviteRewardInfo.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemInviteRewardInfo;
