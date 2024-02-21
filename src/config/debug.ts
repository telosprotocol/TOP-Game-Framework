import { BIT_LOG_END, BIT_LOG_START } from '../js_bridge/BIT_LOG_ENUMS';
export const logConfig = {
  // 1:log,2:detail
  bpush: {
    start: 0,
    end: 0,
  },
  bpull: {
    start: 0,
    end: 0,
  },
  debugMap: {} as {
    httpProxy?: 1 | 0;
    http?: 1 | 0;
    penetrateData?: 1 | 0;
    trace?: 1 | 0;
  }, //dn

  bCallIgnore: {} as {
    [methodName: string]: 0 | 1 | 2 | 3;
  },
  bPushIgnore: {} as {
    [methodName: string]: 0 | 1 | 2 | 3;
  },
  //
  //  ，
  perfOptimize: 0,
  /**
   *  subCategory
   */
  showTaskId: 0,
};

export const DEBUG_LOG_KEY = '__DEBUG_LOG';
try {
  let debugMode = localStorage.getItem(DEBUG_LOG_KEY);
  // localStorage.setItem('__DEBUG_LOG',JSON.stringify({
  //   bpush:{
  //     start:2,end:2
  //   },
  //   bpull:{
  //     start:2,end:2
  //   },trace:1,showTaskId:1
  // }))
  if (process.env.VUE_APP_ENV_SERVER === 'development') {
    if (!debugMode) {
      // debug
      debugMode = JSON.stringify({
        debugMap: {
          http: 0,
          httpProxy: 0,
          penetrateData: 0,
          trace: 0,
        },
        bCallIgnore: {
          getInfo: BIT_LOG_END | BIT_LOG_START,
          setLocalLog: BIT_LOG_END | BIT_LOG_START,
          penetrateData: BIT_LOG_END | BIT_LOG_START,
          updateTaskInfo: BIT_LOG_END | BIT_LOG_START,
          dotting: BIT_LOG_END | BIT_LOG_START,
          httpProxy: BIT_LOG_START | BIT_LOG_END,
          startTimer: BIT_LOG_START | BIT_LOG_END,
          clearTimer: BIT_LOG_START | BIT_LOG_END,
          addPushListener: BIT_LOG_START | BIT_LOG_END,
        },
        bPushIgnore: {
          updateTaskInfo: BIT_LOG_START | BIT_LOG_END,
          penetrateData: BIT_LOG_START | BIT_LOG_END,
          onWalletTabChecked: BIT_LOG_END,
          netChanged: BIT_LOG_END,
          onPaidViewRewardsReceiveEnd: BIT_LOG_END,
        },
      });
    }
  }
  if (debugMode) {
    const newConfig = JSON.parse(debugMode);
    for (const key in newConfig) {
      (logConfig as any)[key] = newConfig[key];
    }
    ['debugMap', 'bCallIgnore', 'bPushIgnore'].forEach((key) => {
      if (!(logConfig as any)[key]) {
        const initialData = {};
        (logConfig as any)[key] = initialData;
      }
    });
  }
} catch (ex) {}

// type ILogConfig = typeof logConfig;
