import { penetrateGBusOnly } from '@/js_bridge/jsCallApp/utilsPenetrate';
import { safePerformanceTimeNow } from '@/utils/datetime';
import { MS_SECOND } from '@/constants/time';
import { onGBus } from '@/utils/GBus';
import type { IVGameTaskItem, IVTaskItemBase } from './VTask.model';
import { reportVTaskBehavior } from './reportVTaskBehavior';
import { ROUTENAME_INAPP_VRIGHT } from '@/constants/localRoutePath';
import { BannerOpType } from '@/constants/BannerOpType';
import { bannerNavigation } from '@/utils/navigator';
import { addWebViewResumeCallback } from '@/store/modules/bridge';
import type { ITaskModuleType } from './VTask.controller';

//#region
// const navTaskInfoMap: {
//   [subCategory: number]: {
//     subCategory: number
//     clearLastClick?: () => void,
//     /**
//     * 0.
//     * 1.10s         ，    ，
//     * 2.            (   6s)
//     * 3.
//     **/
//     stage: number,
//     goToBackDt?: number,
//     startDt: number
//   }
// } = {};
type INavTaskInfo = {
  taskId: string;
  clearLastClick?: () => void;
  /**
   * 0.
   * 1.10s         ，    ，
   * 2.            (   6s)
   * 3.
   **/
  stage: number;
  goToBackDt?: number;
  startDt: number;
};
let lastNavTaskInfo = null as INavTaskInfo;
//
const NAV_GOTO_BACK_MAX_MS = 10 * MS_SECOND;
//        ，
const NAV_MIN_IN_BACK_MS = 4 * MS_SECOND;
const TAG_NAV = '[NAVTASK]';
/**
 *
 */
function startListenVNavTaskComplete(
  taskItemHold: IVGameTaskItem,
  taskModuleType?: ITaskModuleType
) {
  const taskId = taskItemHold.taskId;
  const navTaskInfo = {
    stage: 0,
    taskId: taskId,
    startDt: 0,
  } as INavTaskInfo;
  // if (!navTaskInfo) {
  //   navTaskInfo = { stage: 0, subCategory, startDt: 0 };
  //   navTaskInfoMap[subCategory] = navTaskInfo
  // }
  if (process.env.VUE_APP_ENV_SERVER === 'development') {
    console.log(TAG_NAV, '1.a startListenNavTask', 'taskId=', taskId);
  }
  //
  if (lastNavTaskInfo) {
    //          ，
    if (lastNavTaskInfo.clearLastClick) {
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        console.log(TAG_NAV, '1.b Cancel Last Task', 'taskId=', taskId);
      }
      lastNavTaskInfo.clearLastClick();
    }
  }
  lastNavTaskInfo = navTaskInfo;

  navTaskInfo.stage = 1;
  navTaskInfo.startDt = safePerformanceTimeNow();
  const offAppBgSwitch = onGBus(
    'appBgSwitch',
    function onEventBgSwitch(payload) {
      if (payload.isFront) {
        //
        if (navTaskInfo.stage === 2) {
          const dtNow = safePerformanceTimeNow();
          const inBackMs = dtNow - navTaskInfo.goToBackDt;
          if (inBackMs < NAV_MIN_IN_BACK_MS) {
            //          ,          （                ）
            if (
              inBackMs < 1 * MS_SECOND &&
              dtNow - navTaskInfo.startDt < NAV_GOTO_BACK_MAX_MS
            ) {
              if (process.env.VUE_APP_ENV_SERVER === 'development') {
                console.log(
                  TAG_NAV,
                  'onEventBgSwitch',
                  'taskId=',
                  taskId,
                  'isFront=',
                  payload.isFront,
                  'stage=',
                  navTaskInfo.stage,
                  { 1: 'wait goto background', 2: 'wait goto front' }[
                    navTaskInfo.stage
                  ],
                  'back to front interval(ms)=',
                  inBackMs,
                  'Debounce, re-enter the Stage of listening to background events.'
                );
              }
              //       1s，      ,
              navTaskInfo.stage = 1;
            } else {
              if (process.env.VUE_APP_ENV_SERVER === 'development') {
                console.log(
                  TAG_NAV,
                  'onEventBgSwitch',
                  'taskId=',
                  taskId,
                  'isFront=',
                  payload.isFront,
                  'stage=',
                  navTaskInfo.stage,
                  { 1: 'wait goto background', 2: 'wait goto front' }[
                    navTaskInfo.stage
                  ],
                  'back to front interval(ms)=',
                  inBackMs,
                  'This task has failed, end.'
                );
              }
              //       ，
              navTaskInfo.clearLastClick();
            }
            return;
          }
          if (process.env.VUE_APP_ENV_SERVER === 'development') {
            console.log(
              TAG_NAV,
              'onEventBgSwitch',
              'taskId=',
              taskId,
              'isFront=',
              payload.isFront,
              'stage=',
              navTaskInfo.stage,
              { 1: 'wait goto background', 2: 'wait goto front' }[
                navTaskInfo.stage
              ],
              'back to front interval(ms)=',
              inBackMs,
              'Task completed, start reporting.'
            );
          }
          navTaskInfo.stage = 3;
          reportVTaskBehavior(taskId, taskItemHold, taskModuleType);
          //
          if (navTaskInfo.clearLastClick) {
            navTaskInfo.clearLastClick();
          }
        } else if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(
            TAG_NAV,
            'onEventBgSwitch',
            'taskId=',
            taskId,
            'isFront=',
            payload.isFront,
            'stage=',
            navTaskInfo.stage,
            { 1: 'wait goto background', 2: 'wait goto front' }[
              navTaskInfo.stage
            ],
            'unkown stage,ignored'
          );
        }
      } else {
        //
        if (navTaskInfo.stage === 1) {
          //
          if (process.env.VUE_APP_ENV_SERVER === 'development') {
            console.log(
              TAG_NAV,
              'onEventBgSwitch',
              'taskId=',
              taskId,
              'isFront=',
              payload.isFront,
              'stage=',
              navTaskInfo.stage,
              { 1: 'wait goto background', 2: 'wait goto front' }[
                navTaskInfo.stage
              ],
              'app is background,start listen to next front event'
            );
          }
          navTaskInfo.goToBackDt = safePerformanceTimeNow();
          //
          navTaskInfo.stage = 2;
        } else if (navTaskInfo.stage === 2) {
          //
          const dtNow = safePerformanceTimeNow();
          if (dtNow - navTaskInfo.startDt > NAV_GOTO_BACK_MAX_MS) {
            if (process.env.VUE_APP_ENV_SERVER === 'development') {
              console.log(
                TAG_NAV,
                'onEventBgSwitch',
                'taskId=',
                taskId,
                'isFront=',
                payload.isFront,
                'stage=',
                navTaskInfo.stage,
                { 1: 'wait goto background', 2: 'wait goto front' }[
                  navTaskInfo.stage
                ],
                'The application is in the waiting for foreground event. At this time, it enters the background, and if the task is not clicked for more than 10 seconds, it will end directly.'
              );
            }
            navTaskInfo.clearLastClick(); //   ，    ，     ，
          } else {
            if (process.env.VUE_APP_ENV_SERVER === 'development') {
              console.log(
                TAG_NAV,
                'onEventBgSwitch',
                'taskId=',
                taskId,
                'isFront=',
                payload.isFront,
                'stage=',
                navTaskInfo.stage,
                { 1: 'wait goto background', 2: 'wait goto front' }[
                  navTaskInfo.stage
                ],
                'Debounce, background time adjustment.'
              );
            }
            //
            navTaskInfo.goToBackDt = safePerformanceTimeNow();
          }
        } else if (process.env.VUE_APP_ENV_SERVER === 'development') {
          console.log(
            TAG_NAV,
            'onEventBgSwitch',
            'taskId=',
            taskId,
            'isFront=',
            payload.isFront,
            'stage=',
            navTaskInfo.stage,
            { 1: 'wait goto background', 2: 'wait goto front' }[
              navTaskInfo.stage
            ],
            'Unknown stage, not processing it for now.'
          );
        }
      }
    }
  );
  //        ，    ,
  let timer = setTimeout(() => {
    //
    timer = null;
    if (navTaskInfo.stage === 1) {
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        console.log(
          TAG_NAV,
          'Does not enter the background for more than 10 seconds,cancel the current task',
          'taskId=',
          taskId
        );
      }
      if (navTaskInfo.clearLastClick) {
        navTaskInfo.clearLastClick();
      }
    }
  }, NAV_GOTO_BACK_MAX_MS);
  //
  navTaskInfo.clearLastClick = function clearLastClick() {
    if (timer != null) {
      clearTimeout(timer);
      timer = null;
    }
    offAppBgSwitch();
    navTaskInfo.clearLastClick = null;
    navTaskInfo.stage = 0;
  };
}

//#endregion

/**
 *   Center Tab
 * @param taskItemHold
 */
function emitToCenterStartListenVNavTaskComplete(
  taskItemHold: IVGameTaskItem,
  taskModuleType: ITaskModuleType
) {
  penetrateGBusOnly(
    'startWatchNavTaskComplete',
    { holdItem: taskItemHold, taskModuleType },
    ROUTENAME_INAPP_VRIGHT
  );
}

export function onStartListenVNavTaskCompleteForCenter() {
  return onGBus('startWatchNavTaskComplete', (payload) => {
    startListenVNavTaskComplete(payload.holdItem, payload.taskModuleType);
  });
}

export function dealVNavTask(
  taskInfo: IVTaskItemBase | undefined,
  taskModuleType: ITaskModuleType
) {
  const res = bannerNavigation({
    url: taskInfo.url,
    from: 'tasklist',
    opType:
      {
        APP_LINK: BannerOpType.AppLink,
        OUTER_LINK: BannerOpType.OuterLink,
        DOWNLOAD_WEBVIEW_LINK: BannerOpType.DownloadWebviewLink,
        DOWNLOAD_WEBVIEW_LINK_NO_DOWNLOAD_ICON:
          BannerOpType.DownloadWebviewLinkNoDownloadIcon,
      }[taskInfo.opType] || BannerOpType.AppLink,
  });

  if (taskInfo.autoReport && taskInfo.behaviorType === 'NAVIGATION') {
    if (taskInfo.opType === 'OUTER_LINK') {
      emitToCenterStartListenVNavTaskComplete(taskInfo, taskModuleType);
    } else {
      //
      //  ：   webviewResume
      addWebViewResumeCallback(async () => {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log(`start report task by webviewresume`, taskInfo.taskId);
        }
        setTimeout(() => {
          reportVTaskBehavior(taskInfo.taskId, taskInfo, taskModuleType);
        }, 3000);
      });
    }
  }

  return res;
}
