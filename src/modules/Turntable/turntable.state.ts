import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { luckWheelListUserLuckyWheelLogController } from '@/vservices/client/UserLuckyWheelLogController';
import Vue from 'vue';
import Component from 'vue-class-component';

/**
 *
 */
const stateItemVTurntableList = createHttpAsyncStateItem(
  () => {
    return luckWheelListUserLuckyWheelLogController();
  },
  null,
  'VTurntableList'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;

@Component({})
export class VTurntableListMixin extends Vue {
  stateItemVTurntableListRef = stateItemVTurntableList.ref;
  get VTurntableList() {
    return this.stateItemVTurntableListRef.current?.filter((item) => {
      return item.luckyWheelType !== 'DIAMOND';
    });
  }
  /**
   *
   * @param timeout     ，     revalidation  ，   0
   */
  refreshVTurntableList(timeout?: number) {
    return stateItemVTurntableList.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVTurntableList;
