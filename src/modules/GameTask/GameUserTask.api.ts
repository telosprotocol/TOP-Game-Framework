import { selfTaskListGameTaskCenterController } from '@/vservices/client/GameTaskCenterController';

/**
 *
 */
export type IUserGameTaskGroupVO = API.GameCenterTaskSeriesVO & {
  /**
   * h5    :
   */
  expirationClientTime?: number;
};

/**
 *   V
 * @returns
 */
export function getVGameUserTask() {
  return selfTaskListGameTaskCenterController().then((rawRes) => {
    const res = rawRes as IHttpResponse<IUserGameTaskGroupVO[]>;
    if (res.success) {
      res.data.forEach((item) => {
        if (item.expirationTime) {
          const expirationTime = Number(item.expirationTime);
          const leftMsSecond = Math.max(expirationTime - res.servertime, 0);
          if (!isNaN(leftMsSecond) && leftMsSecond) {
            item.expirationClientTime = leftMsSecond + new Date().getTime();
          }
        }
      });
    }
    return res;
  });
}
