import { MS_MINUTE } from '@/constants/time';
import Vue from 'vue';
import Component from 'vue-class-component';
import { stateItemVActivityPageList } from './activity-page.state';

@Component({})
export class VActivityHallEntryStatusMixin extends Vue {
  stateItemVActivityPageList = stateItemVActivityPageList.ref;

  get VActivityRedDot() {
    const list = this.stateItemVActivityPageList.current;
    if (list) {
      return list.some((item) => item.hasRedDot);
    } else {
      return false;
    }
  }
  refreshVActivityRedDot(timeout?: number) {
    return stateItemVActivityPageList.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;
