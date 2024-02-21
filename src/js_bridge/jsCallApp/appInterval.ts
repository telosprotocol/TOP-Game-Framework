import { callBridge } from '../jsCallAppBaseUtils';

//#region app
function _startAppInterval(interval: number, timerId: number) {
  callBridge('startTimer', { interval, timerId: timerId });
}

function _clearAppInterval(timerId: number) {
  callBridge('clearTimer', { timerId });
}
//#endregion
//     10000  ,        ，    Wallet      ...
// <100000 timerId      Id
let nextTimerId = Math.floor(Math.random() * 10000 + 10) * 10000;

// if (process.env.VUE_APP_ENV_SERVER === 'development') {
//   console.log('onTimerHandle currentPageTimerId', nextTimerId);
// }

const appIntervalHandlerMap: {
  // true:  ,false:
  [timerId: number]: () => boolean;
} = {};

/**
 *
 * @param handler   true:     ，  ：
 * @param interval   :ms
 * @returns
 */
export function setAppInterval(handler: () => boolean, interval: number) {
  const curTimerId = ++nextTimerId;
  appIntervalHandlerMap[curTimerId] = handler;
  _startAppInterval(interval, curTimerId);
  return curTimerId;
}

export function clearAppInterval(timerId: number) {
  _clearAppInterval(timerId);
  delete appIntervalHandlerMap[timerId];
}

export function _onAppIntervalHandler(payload: { timerId: number }) {
  const handler = appIntervalHandlerMap[payload.timerId];
  if (!handler) {
    return null;
  }
  return !!handler();
}
