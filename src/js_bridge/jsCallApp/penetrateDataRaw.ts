import {
  PENETRATE_TIMEOUT,
  removePenetrateDataLs,
  setPenetrateDataLs,
} from '@/controller/CommonLocalStorage';
import uniqueString from '@/utils/string/uniqueString';
import { logConfig } from '../../config/debug';
import { CUR_WEBVIEW_ID } from '../CUR_WEBVIEW_ID';
import { callBridgePromise } from '../jsCallAppBaseUtils';
import type { ICommitInfoItem, IPenetrateDataModel } from '../js_call_app.d';
import { setAppInterval } from './appInterval';

//#region
/**
 *      */
export function penetrateDataRaw(data: Omit<IPenetrateDataModel, 'wid'>) {
  const { to = '', ...others } = data;
  //     module
  const moduleNameList: string[] = [];
  function addModuleName(item: ICommitInfoItem) {
    const mName = (item.type || '').split('/')[0] || '-';
    if (moduleNameList.indexOf(mName) === -1) {
      moduleNameList.push(mName);
    }
  }
  if (data.commitInfo) {
    data.commitInfo.forEach(addModuleName);
  }
  if (data.dispatchInfo) {
    data.dispatchInfo.forEach(addModuleName);
  }
  if (data.gBus) {
    moduleNameList.push('gBus');
    moduleNameList.push('-');
  }
  // wid|to|from|moduleNames|payload
  const from = window.vue205.$route?.name || '';
  const moduleNames = moduleNameList.join(':');
  let str = '';
  if (process.env.VUE_ENV_HAS_PENETRATE_USECACHE) {
    const lsKey = uniqueString();
    const useLs = setPenetrateDataLs(lsKey, others);
    if (useLs) {
      // 15s
      setAppInterval(() => {
        // 15s
        removePenetrateDataLs(lsKey);
        return true;
      }, PENETRATE_TIMEOUT);
    }
    str = `${CUR_WEBVIEW_ID}|${to}|${from}|${moduleNames}|${
      useLs ? lsKey : ''
    }|${useLs ? '' : JSON.stringify(others)}`;
  } else {
    str = `${CUR_WEBVIEW_ID}|${to}|${from}|${moduleNames}||${JSON.stringify(
      others
    )}`;
  }
  // const str = `${CUR_WEBVIEW_ID}|${to}|${from}|${moduleNames}|${useLs ? lsKey : }|${useLs ? '' : JSON.stringify(others)}`;
  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    if (logConfig.debugMap['penetrateData']) {
      const logList = ['[JsCall]-Call', 'penetrate', 'to', to] as any[];
      if (data.commitInfo?.length > 0) {
        logList.push('commit', data.commitInfo[0].type, data.commitInfo);
      }
      if (data.dispatchInfo?.length > 0) {
        logList.push('dispatch', data.dispatchInfo[0].type, data.dispatchInfo);
      }
      if (data.gBus?.length > 0) {
        logList.push('gBus', data.gBus[0].eventName, data.gBus);
      }
      console.log.apply(null, logList);
    }
  }

  return callBridgePromise<boolean>('penetrateData', str, {
    dontStringify: true,
    // logType: BIT_LOG_START_DETAIL
    // doLogDetail: true,
  }).then((res) => {
    return res;
  });
}
