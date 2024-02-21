import { TransTool } from '@/init/i18n';
import { Toast } from 'vant';
import { MS_SECOND_5 } from '../constants/time';
import { safePerformanceTimeNow } from '../utils/datetime';

/**
 *      toast       
 */
enum ToastType {
  RefreshDataError = 1,
}
type IToastConfig = {
  /**
   *          
   */
  interval?: number;
};
const ToastConfigMap: { [type in ToastType]: IToastConfig } = {
  [ToastType.RefreshDataError]: {
    interval: MS_SECOND_5,
  },
};
/**
 *           
 */
export class NotificationCtrl {
  private static _Instance: NotificationCtrl;
  static get Instance() {
    if (!NotificationCtrl._Instance) {
      NotificationCtrl._Instance = new NotificationCtrl();
    }
    return this._Instance;
  }

  //#region intervalCtrl
  private _lastToastShowDtMap: { [key: number]: number } = {
    [ToastType.RefreshDataError]: 0,
  };

  private trySetShowToastInfo(toastType: ToastType) {
    const info = this._lastToastShowDtMap[toastType];
    const config = ToastConfigMap[toastType];
    if (!config.interval) {
      return true; //      
    }
    const dtNow = safePerformanceTimeNow();
    if (dtNow - info < config.interval) {
      return false; //     ，   
    }
    return true;
  }

  //#endregion

  /**
   *       ( 5sthrottle)
   */
  showDataRefreshError() {
    if (this.trySetShowToastInfo(ToastType.RefreshDataError)) {
      Toast(TransTool.Instance.$t('Base.dataRefreshError') as string);
    }
  }

  /**
   *         （ null|Result!==1       ）, 5s throttle
   * @param refreshResult
   * @returns hasError
   */
  tryShowDataRefreshError(refreshResult?: { Result: number }) {
    if (!refreshResult || refreshResult.Result !== 1) {
      NotificationCtrl.Instance.showDataRefreshError();
      return true;
    }
    return false;
  }
}
