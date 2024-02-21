import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import Component from 'vue-class-component';
import { getInfoSmashEggController } from '@/vservices/client/SmashEggController';
import { visitorGetInfoSmashEggController } from '@/vservices/restful/SmashEggController';

function wrapWithLogined(isLogined: boolean) {
  return function (res: API.ObjectVOSmashEggActivityVO) {
    return {
      ...res,
      data: res.data
        ? {
            ...res.data,
            isLogined,
          }
        : null,
    };
  };
}
export const stateItemSmashEgg = createHttpAsyncStateItem(
  async () => {
    const isLogined = await waitUserIsLoginedAuth();
    if (isLogined) {
      return getInfoSmashEggController().then(wrapWithLogined(isLogined));
    } else {
      return visitorGetInfoSmashEggController().then(
        wrapWithLogined(isLogined)
      );
    }
  },
  null,
  'SmashEgg'
);

//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;

@Component({})
export class SmashEggMixin extends Vue {
  stateItemSmashEggRef = stateItemSmashEgg.ref;

  get SmashEgg() {
    return this.stateItemSmashEggRef.current;
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  refreshSmashEgg(timeout?: number) {
    return stateItemSmashEgg.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemSmashEgg;
