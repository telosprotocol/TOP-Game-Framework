import { paddingLeft } from './string';
import { padStart } from './string/padString';

function normalizeDate(dt: number | Date) {
  if (typeof dt === 'number') {
    return new Date(dt);
  } else {
    return dt;
  }
}
type NumberOrDate = number | Date;

function paddingZero(strNum: number, length?: number) {
  return paddingLeft(strNum + '', length || 2, '0');
}

/**
 *  V           (   ，   )
 * @param idt     Date
 * @param _defaultStr idt
 */
export function formatFullDateTime(idt: NumberOrDate, _defaultStr?: string) {
  const dt = normalizeDate(idt);

  if (!dt) {
    return _defaultStr;
  }
  return `${formatDate(dt)} ${formatFullTime(dt)}`;
}
/**
 *
 *           :
 * 12/20/2012
 */
export function formatDate(idt: NumberOrDate, _defaultStr?: string) {
  if (idt === 0 && _defaultStr) {
    return _defaultStr;
  }
  const dt = normalizeDate(idt);
  if (!dt) {
    return _defaultStr;
  }
  return `${paddingZero(dt.getDate())}-${paddingZero(
    dt.getMonth() + 1
  )}-${dt.getFullYear()}`;
}

/**
 *
 * @param idt
 * @returns
 */
export function formatTime(idt: NumberOrDate) {
  const dt = normalizeDate(idt);
  return `${paddingZero(dt.getHours())}:${paddingZero(dt.getMinutes())}`;
}
/**
 *
 * @param idt
 * @returns
 */
function formatFullTime(idt: NumberOrDate) {
  const dt = normalizeDate(idt);
  return `${paddingZero(dt.getHours())}:${paddingZero(
    dt.getMinutes()
  )}:${paddingZero(dt.getSeconds())}`;
}

export function formatDateTime(idt: NumberOrDate) {
  const dt = normalizeDate(idt);
  return `${formatDate(dt)} ${formatTime(dt)}`;
}

export function convertSecond2Time(num: number) {
  const min = Math.floor(num / 60);
  const scd = num % 60;
  return `${paddingZero(min)}:${paddingZero(scd)}`;
}

export enum TimeUnit {
  milisecond = 0,
  second = 1,
  minute = 2,
  hour = 3,
  day = 4,

  //
  month = 5,
}

/**
 *
 */
export const PERMANENT_TIMESTAMP = 4828089600000;
export function convertMsSecond2TimeInfo(
  ms: number,
  _options?: {
    maxUnit: TimeUnit;
  }
) {
  const options = _options || { maxUnit: TimeUnit.day };
  const res = {
    second: 0,
    minute: 0,
    hour: 0,
    day: 0,
    milisecond: 0,
  };
  res.milisecond = ms % 1000;
  const leftSecond = (ms - res.milisecond) / 1000;
  res.second = leftSecond % 60;
  const leftMinutes = (leftSecond - res.second) / 60;
  res.minute = leftMinutes;
  if (options.maxUnit === TimeUnit.minute) {
    return res;
  }
  res.minute = leftMinutes % 60;
  const leftHour = (leftMinutes - res.minute) / 60;
  res.hour = leftHour;
  if (options.maxUnit === TimeUnit.hour) {
    return res;
  }
  res.hour = leftHour % 24;
  res.day = (leftHour - res.hour) / 24;
  return res;
}

export function convertSecond2TimeInfo(
  second: number,
  _options?: {
    maxUnit: TimeUnit;
  }
) {
  return convertMsSecond2TimeInfo(second * 1000, _options);
}

export function convertMSecond2Time(num: number) {
  const mscd = num % 1000;
  return (
    convertSecond2Time(Math.floor(num / 1000)) + ':' + paddingZero(mscd, 3)
  );
}

export function convertToUTCDate(dt: Date) {
  return `${dt.getUTCFullYear()}-${dt.getUTCMonth() + 1}-${dt.getUTCDate()}`;
}

const supportPerfomanceTimeNow = !!(
  typeof performance !== 'undefined' &&
  performance.now &&
  performance.timeOrigin
);
// if (supportPerfomanceTimeNow) {
//   const diffVal = Math.abs(
//     performance.timeOrigin + performance.now() - getDateTimeStamp()
//   )
//   if (diffVal > 3) {
//     //  performance
//     console.log('perfermance diffVal is to max', diffVal)
//     supportPerfomanceTimeNow = false
//   }
// }

function realPerformanceTimeNow() {
  return Math.floor(performance.timeOrigin + performance.now());
}
/**
 * performance.now        ，
 *  ：             （             ）
 *           Page
 */
export function safePerformanceTimeNow() {
  // if (supportPerfomanceTimeNow) {
  //   return realPerformanceTimeNow()
  // } else {
  return getDateTimeStamp();
  // }
}

/**
 *       safePerformanceTimeNow
 * @returns
 */
export function getDateTimeStamp() {
  return new Date().getTime();
}

/**
 *
 * @param usePerformanceTime
 */
export function getCurrentTimeStamp(usePerformanceTime: boolean) {
  if (usePerformanceTime && supportPerfomanceTimeNow) {
    return realPerformanceTimeNow();
  } else {
    return getDateTimeStamp();
  }
}

function convertToDateStr(num: number, len = 2) {
  return padStart(num + '', len, '0');
}

/**
 *
 * Y:year,M: month,D: date,h:hour,m:minute,s:second
 * */
export function dateTimeFmt(formatStr: string, dtNumber: number) {
  const dt = new Date(dtNumber);

  const Y = dt.getFullYear();
  const YS = String(Y);

  const M = dt.getMonth() + 1;
  const MS = convertToDateStr(M);

  const D = dt.getDate();
  const DS = convertToDateStr(D);

  const H = dt.getHours();
  const HS = convertToDateStr(H);

  const m = dt.getMinutes();
  const mS = convertToDateStr(m);

  const s = dt.getSeconds();
  const sS = convertToDateStr(s);

  return formatStr
    .replace(/[Yy]{1,}/, YS)
    .replace(/M{1,}/, MS)
    .replace(/[Dd]{1,}/, DS)
    .replace(/[Hh]{1,}/, HS)
    .replace(/m{1,}/, mS)
    .replace(/[Ss]{1,}/, sS);
}

const entryTime = safePerformanceTimeNow();
export function getElapsedTime() {
  const dt = safePerformanceTimeNow();
  return dt - entryTime;
}

/**
 *         dateTag,  utc      ，  hour>=endHour ，
 * @param timestamp
 * @param endHour      0  ，  24
 * @returns
 */
export function getTimeDateTagByEndHour(timestamp: number, endHour: number) {
  const dt = new Date(timestamp);

  const isTodayResetted = dt.getUTCHours() >= endHour;
  if (isTodayResetted) {
    dt.setDate(dt.getDate() + 1);
  }
  return `${dt.getUTCFullYear()}-${dt.getUTCMonth() + 1}-${dt.getUTCDate()}`;
}
