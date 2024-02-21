import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { getConfigController } from '@/vservices/restful/ConfigController';
import Vue from 'vue';
import Component from 'vue-class-component';
export type IMiniGameModel = {
  gameName: string;
  title: string;
  //
  titleId?: string;
  gameIcon: string;
  gameUrl: string;
};
const stateItemMiniGameList = createHttpAsyncStateItem(
  () => {
    return getConfigController({ code: 'miniGame' }).then((res) => {
      return {
        ...res,
        data: res.data as any as IMiniGameModel[],
      };
    });
  },
  null,
  'MiniGameList'
);
const REVALIDATION_MS = MS_MINUTE * 30;

@Component({})
export class MiniGameListMixin extends Vue {
  stateItemMiniGameListRef = stateItemMiniGameList.ref;
  get MiniGameList() {
    return this.stateItemMiniGameListRef.current;
  }
  /**
   *
   * @param timeout     ，     revalidation  ，   0
   */
  refreshMiniGameList(timeout?: number) {
    return stateItemMiniGameList.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemMiniGameList;
