import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { baseListActivitiesManagementController } from '@/vservices/restful/ActivitiesManagementController';
import Component from 'vue-class-component';
import Vue from 'vue';

export const stateItemRankActivityTime = createHttpAsyncStateItem(
  async () => {
    return baseListActivitiesManagementController({
      types: ['RANKING_LIST'],
    });
  },
  null,
  'RankActivityTime'
);

//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;

@Component({})
export class RankActivityTimeMixin extends Vue {
  stateItemRankActivityTimeRef = stateItemRankActivityTime.ref;

  get RankActivityInfo() {
    return this.stateItemRankActivityTimeRef.current?.[0];
  }

  get RankActivityEndTime() {
    const info = this.RankActivityInfo;
    if (info) {
      return Number(info.validEndTime);
    } else {
      return null;
    }
  }
  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  refreshRankActivityTime(timeout?: number) {
    return stateItemRankActivityTime.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemRankActivityTime;
