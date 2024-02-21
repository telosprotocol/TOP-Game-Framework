import { noop } from 'lodash-es';
import { getStore } from '@/store/util';
/**app       */
import { dotting_bridge } from '@/js_bridge/jsCallApp/dotting';
import { logConfig } from '../config/debug';
import { isNative } from '@/js_bridge/isNative';
import { H5Version } from '@/config/version';

const CUR_H5_VERSION = `${H5Version}.${window.GC.buildNum}`;

type TraceDataType = { [key: string]: string | number };

function overideObj(target: Record<string, any>, from: Record<string, any>) {
  for (const key in from) {
    const v = from[key];
    if (target[key] === undefined) {
      target[key] = v;
    }
  }
}
function normalizeDottingData(data: TraceDataType) {
  const store = getStore();
  data = data || {};
  data.h5version = CUR_H5_VERSION;
  if (store.state.app.versionName) {
    data.appversion = store.state.app.versionName;
  }
  //   coins,referrals,checkins
  // data.coins = store.state.user.point || 0;
  // data.referrals = store.state.user.realInviteCount || 0;
  data.url = window.location.href;
  let perf_time;
  if (performance && performance.now) {
    perf_time = performance.now();
  }
  overideObj(data, {
    source: '1',
    local_timestamp: new Date().getTime() + '',
    perf_time,
    language: navigator.language,
    user_agent: navigator.userAgent,
    href: window.location.href,
    time_zone_offset: `GMT+${new Date().getTimezoneOffset() / -60}:00`,
    evn: process.env.VUE_APP_BUILD_ENV_MODE,
  });
  // data.checkins = store.state.user.signInCount || 0
  return data;
}

/**
 *   （    app  /     )
 * @param {*} eventName
 * @param {*} data
 * @param {boolean} _forceNative true:        ,false:         ，other:
 */
export function tryTraceEvent(
  eventName: string,
  data?: TraceDataType,
  _forceNative?: boolean
) {
  data = normalizeDottingData({ ...(data || {}) });
  let bIsNative = false;
  if (_forceNative === true) {
    bIsNative = true;
  } else if (_forceNative === false) {
    bIsNative = false;
  } else {
    bIsNative = isNative();
  }
  let label: string | null, value: string | null;
  if (data.label != null) {
    label = data.label + '';
    delete data.label;
  }
  if (data.value != null) {
    value = data.value + '';
    delete data.value;
  }
  // console.log('dotting_bridge pre', bIsNative)
  if (bIsNative) {
    let iValue;
    if (value) {
      iValue = Number(value);
    }
    if (logConfig.debugMap.trace > 0) {
      console.log('trace', eventName, data, label, iValue);
    }
    dotting_bridge(eventName, data, label, iValue);
  } else {
    //TODO other trace?
  }
}

/**
 *   ForV
 * @param {*} eventName
 * @param {*} data
 * @param {boolean} _forceNative true:        ,false:         ，other:
 */
export function tryTraceEventV(eventName: string, data?: TraceDataType) {
  const newData = data || ({} as any);

  newData.vgame = '1';
  // console.log("tryTraceEventV: ", eventName, newData);
  tryTraceEvent(eventName, newData);
}
// function traceElementVisibility(element: HTMLElement, cb: () => {}) {
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.intersectionRatio > 0) {
//         cb();
//         observer.unobserve(element);
//       }
//     });
//   });

//   observer.observe(element);
// }

export function traceElementExpose(
  element: HTMLElement,
  eventName: string,
  data?: TraceDataType
) {
  if (typeof IntersectionObserver === 'undefined') {
    return noop;
  }
  let observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // console.log(
        //   '[DEBUG]-intersectionRatio',
        //   entry.intersectionRatio,
        //   entry.intersectionRect.height,
        //   eventName,
        //   data
        // );
        if (
          entry.intersectionRatio >= 0.28 ||
          entry.intersectionRect.height > 50
        ) {
          tryTraceEvent(eventName, data);
          if (observer) {
            observer.unobserve(element);
            observer = null;
          }
        }
      });
    },
    {
      threshold: [0, 0.3],
    }
  );

  observer.observe(element);
  return () => {
    if (observer) {
      observer.unobserve(element);
    }
  };
}
