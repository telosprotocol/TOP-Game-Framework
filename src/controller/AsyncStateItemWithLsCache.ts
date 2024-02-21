import { MS_DAY } from '@/constants/time';
import LocalStorage from './LocalStorage';
import AsyncStateItem, { IGetValue } from './AsyncStateItem';
import { getStore } from '../store/util';

const lsForStateItem = new LocalStorage({
  prefix: 'VD1ST_',
  version: 1,
  timeout: MS_DAY * 3,
});
type IStateItemLocalStorgeModel<T> = {
  userId?: string;
  data: T;
};

type LSKey =
  | 'VUserFissionStat'
  | 'VGameList'
  | 'VActivityHallListMixin'
  | 'VActivityPageListMixin'
  | 'VBannerList_GAME_HOME' // banner VBannerList_ showScene
  | 'VBannerList_PROMOTION'
  | 'VBannerList_COLLEGE_CENTER';

/**
 * stateItem
 * @param lsKey  key, LSKey ， LSKey
 * @param updateValue
 * @param defaultValue
 * @param logName
 * @returns
 */
export function createHttpAsyncStateItemWithLSCache<T, TCustomData = undefined>(
  lsKey: LSKey,
  updateValue: IGetValue<IHttpVResponse<T>>,
  defaultValue?: T,
  logName?: string
) {
  const lsItem = lsForStateItem.getItem<IStateItemLocalStorgeModel<T>>(lsKey);
  let curDefaultValue = defaultValue;
  if (lsItem) {
    if (lsItem.userId == getStore().state.user.userId) {
      curDefaultValue = lsItem.data;
    }
  }
  console.log('[AsyncState]', lsKey, 'defaultValue', curDefaultValue);
  const stateItem = new AsyncStateItem<T, TCustomData, IHttpResponse<T>>(
    function updateValueWrap() {
      return updateValue().then((res) => {
        if (res && ((res as any).Result === 1 || res.success)) {
          stateItem.ref.lastServerDt = res.servertime;
          lsForStateItem.setItem<IStateItemLocalStorgeModel<T>>(lsKey, {
            userId: getStore().state.user.userId,
            data: res.data,
          });
          return res.data;
        }
        throw res;
      });
    },
    curDefaultValue,
    logName || lsKey
  );
  return stateItem;
}
