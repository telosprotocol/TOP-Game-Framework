import { logConfig } from '../config/debug';
import {
  BIT_LOG_END,
  BIT_LOG_END_DETAIL,
  BIT_LOG_START,
  BIT_LOG_START_DETAIL,
} from './BIT_LOG_ENUMS';

// call start #57b0f7 ,end #1296ff
// push start #03a903,end #008500
function getLogStyle(isStart: boolean, globalLogType: 'bpull' | 'bpush') {
  const color = (
    isStart
      ? { bpull: '#57b0f7', bpush: '#03a903' }
      : { bpull: '#0f85e3', bpush: '#008500' }
  )[globalLogType];
  return `color:${color}`;
}
export function tryLogStart(
  logType: number | undefined,
  globalLogType: 'bpull' | 'bpush',
  part1: string,
  methodName: string,
  json: unknown
) {
  const argList = [
    `%c${part1}`,
    getLogStyle(true, globalLogType),
    methodName,
  ] as unknown[];
  if (logType & BIT_LOG_START_DETAIL || logConfig[globalLogType].start > 1) {
    argList.push(json);
    console.log.apply(null, argList);
  } else if (logType & BIT_LOG_START || logConfig[globalLogType].start > 0) {
    console.log.apply(null, argList);
  }
}
export function tryLogEnd(
  logType: number | undefined,
  globalLogType: 'bpull' | 'bpush',
  part1: string,
  methodName: string,
  json: unknown
) {
  const argList = [
    `%c${part1}`,
    getLogStyle(false, globalLogType),
    methodName,
  ] as unknown[];
  if (logType & BIT_LOG_END_DETAIL || logConfig[globalLogType].end > 1) {
    argList.push(json);
    console.log.apply(null, argList);
  } else if (logType & BIT_LOG_END || logConfig[globalLogType].end > 0) {
    console.log.apply(null, argList);
  }
}
