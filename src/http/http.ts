import BrandName from '@/constants/BrandName';
import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import { logConfig } from '@/config/debug';
import { dotting_bridge } from '@/js_bridge/jsCallApp/dotting';
import {
  getDeviceInfoBridgeWithCache,
  getSignHeaders_bridge,
  notifyAppUserTokenFailure,
} from '@/js_bridge/js_call_app';
import type { AppState } from '@/store/modules/app/app';
import { waitHttpParamsInited } from '@/store/modules/base';
import { getStore } from '@/store/util';
import { longNumberStrFormat } from '@/utils/';
import { safePerformanceTimeNow } from '@/utils/datetime';
import axios, {
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosTransformer,
} from 'axios';
import { startsWith } from 'lodash-es';
import { getCurrentLang, TransTool } from '../init/i18n';
import httpProxyAdapter from '../js_bridge/httpProxyAdapter';
import { createHttpResponse, getHttpCurrentTime } from './createHttpResponse';
async function normalizeDataOrParams(dataOrParams?: Record<string, any>) {
  function needInjectKey(key: string) {
    const val = dataOrParams[key];
    //TODO:     ''
    return val === null || val === '';
  }
  const store = getStore();
  if (dataOrParams && typeof dataOrParams === 'object') {
    //
    if (needInjectKey('userId') && window.GC.isInApp) {
      const storeUserId = store.state.user.userId;
      if (store.state.user.isLogined && storeUserId) {
        dataOrParams.userId = storeUserId;
      } else {
        dataOrParams.userId = '1';
      }
    }
    if (needInjectKey('lang')) {
      dataOrParams.lang = getCurrentLang();
    }
    if (needInjectKey('deviceId') && window.GC.isInApp) {
      //   clientInfo，appType,countryCode(     ，      )
      if (window.GC.isInApp) {
        await getDeviceInfoBridgeWithCache(); //
      }
      dataOrParams.deviceId = store.state.app.deviceId;
    }
    // const fieldList = ['deviceId'].filter(appKey => {
    //   return needInjectKey(appKey)
    // })
    // if (fieldList.length > 0) {
    //   if (window.GC.isInApp) {
    //     await getDeviceInfoBridgeWithCache() //
    //   }
    //   fieldList.forEach(appKey => {
    //     dataOrParams[appKey] = store.state.app[appKey]
    //   })
    // }
  }
  return dataOrParams;
}

const DEBUG_MOCK_MAP: { [key: string]: string } = {};

const APP_NAME = BrandName.replace(/ /g, '');
/*       */
const requestHandle = async (config: AxiosRequestConfig) => {
  // config.headers['User-Agent'] = '111'
  // console.log('requestHandle start')
  if (process.env.VUE_APP_ENV_SERVER === 'development') {
    //     ，         mock
    if (config.url) {
      for (const key in DEBUG_MOCK_MAP) {
        if (startsWith(config.url, '/' + key)) {
          config.baseURL = DEBUG_MOCK_MAP[key];
        }
      }
    }
  }
  if (!config.noExtraHeader && window.GC.isInApp) {
    waitHttpParamsInited(); //  await(          await)
  }
  if (config.params) {
    config.params = await normalizeDataOrParams(config.params);
  }
  if (config.data) {
    config.data = await normalizeDataOrParams(config.data);
  }

  if (!config.noExtraHeader) {
    const store = getStore();
    const auth = store.state.user.auth;
    if (auth) {
      config.headers['Authorization'] = auth;
    }
    const lang = getCurrentLang();
    if (config.isV) {
      config.headers['language'] = lang;
      config.headers['appName'] = APP_NAME;
      if (window.GC.isInApp) {
        const versionName = store.state.app.versionName;
        if (versionName) {
          config.headers['versionName'] = versionName;
        }
        const pkgChannelName = window.GC.pkgChannelName;
        if (pkgChannelName) {
          config.headers['channelName'] = pkgChannelName;
        }
      }
    } else {
      //     ，    ，
      ['buildNum', 'appType', 'versionName'].forEach((fKey) => {
        const fVal = store.state.app[fKey as keyof AppState];
        if (fVal) {
          config.headers[fKey] = fVal;
        }
      });
      const countryCode = store.state.universe.countryCode;
      if (countryCode) {
        config.headers['countryCode'] = countryCode;
      }
      config.headers['lang'] = lang;
    }
    //
    if (window.GC.isInApp) {
      const method = (config.method || 'get').toLowerCase();
      const dataToSign = method === 'get' ? config.params : config.data;
      const signHeaders = await getSignHeaders_bridge(dataToSign || {});
      const shObj = JSON.parse(signHeaders.data);
      // config.headers['a'] = shObj.a
      config.headers['sign'] = shObj.sign;
      config.headers['nonceStr'] = shObj.nonceStr;
      config.headers['timestamp'] = shObj.timestamp;
      // if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      //   if (config.url.indexOf('/lottery/getCurrentLottery') != -1) {
      //     console.log('[SIGN]-Result', tmpData, shObj);
      //   }
      // }
    }
  }

  return config;
};

const transformResponse = (str: string | unknown) => {
  if (typeof str === 'string') {
    const newStr = longNumberStrFormat(str);
    try {
      return JSON.parse(newStr);
    } catch (ex) {
      return JSON.parse(str);
    }
  }
  return str;
};

const transformResponseV = (str: string | unknown) => {
  if (typeof str === 'string') {
    try {
      return JSON.parse(str);
    } catch (ex) {}
  }
  return str;
};
//#region Concurrent Adapter
/**
 * {
 *  [sign:string]:Promise<Response>
 * }
 */

type IHttpTaskContext = {
  createAt: number;
  // updateAt: undefined,
  status: 'pending' | 'rejected' | 'fulfilled';
  result: AxiosPromise<any>;
  updateAt?: number;
};
const httpUnFinishedTask: {
  [key: string]: IHttpTaskContext;
} = {};
const realAdapter = axios.defaults.adapter;
// if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
//   //   [AXIOS]
//   httpUnFinishedTask[`_debug_b_opendebug`] = false
// }

/**
 *  header   sign   ，
 *         ，
 *   concurrentTimeout,cacheTimeout
 * 1.  concurrentTimeout：     ，
 * 2.  cacheTimeout: promise    ，      ，
 * 3.    :
 * useCacheCb:          ，         useCacheCb
 * @param  config
 */
function defaultAdapter(config: AxiosRequestConfig) {
  if (config.adapterCb) {
    config.adapterCb(config, {
      convertRequestKey,
    });
  }
  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    if (logConfig.debugMap.http) {
      const logList = [
        '[http]-axios',
        'before',
        config.url,
        config.method,
      ] as any[];
      if (config.params) {
        logList.push('params:', config.params);
      }
      if (config.data) {
        logList.push('data:', config.data);
      }
      console.log.apply(null, logList);
    }
  }
  const doInterupt = config.method === 'get';
  if (!doInterupt) {
    return realAdapter(config);
  }

  function convertRequestKey(config: AxiosRequestConfig) {
    const list = [config.baseURL, config.url];
    const store = getStore();

    if (config.customRequestKeyConvertor) {
      config.customRequestKeyConvertor(config, list);
    } else {
      const params = config.params;
      const headers = config.headers;
      if (headers) {
        if (headers.Authorization) {
          //  userId,deviceId
          // todo user
          list.push(store.state.user.userId);
        } else {
          list.push('0');
        }
        if (headers.countryCode) {
          list.push(headers.countryCode);
        }
      }
      if (params) {
        if (config.paramsSerializer) {
          list.push(config.paramsSerializer(params));
        }
        // else if (
        //   typeof URLSearchParams !== 'undefined' &&
        //   params instanceof URLSearchParams
        // ) {
        //   list.push(params.toString())
        // }
        else {
          list.push(JSON.stringify(params));
        }
      }
    }
    return list.join('|');
  }
  const taskKey = convertRequestKey(config);
  // console.log('[AXIOS]', taskKey)
  const dtStart = safePerformanceTimeNow();
  if (config.disableLastCache) {
    delete httpUnFinishedTask[taskKey];
  }
  //    sign
  let lastUnFinishedTask = httpUnFinishedTask[taskKey];
  function deleteAdapterResponse() {
    if (httpUnFinishedTask[taskKey] === lastUnFinishedTask) {
      delete httpUnFinishedTask[taskKey];
    }
  }
  const { concurrentTimeout, useCacheCb } = config;
  let { cacheTimeout } = config;
  if (concurrentTimeout) {
    cacheTimeout = 0;
  }

  if (!lastUnFinishedTask) {
    let timerToClear: ReturnType<typeof setTimeout>;
    const adapterPromise = realAdapter(config).then(
      (response) => {
        currentTask.status = 'fulfilled';
        const curTimeStamp = getHttpCurrentTime();
        currentTask.updateAt = curTimeStamp;
        let doClearTimer = false;
        if (cacheTimeout) {
          doClearTimer = true;
          setTimeout(deleteAdapterResponse, cacheTimeout);
        } else if (!concurrentTimeout) {
          doClearTimer = true;
          deleteAdapterResponse();
        }
        //         ，
        response.__updateAt = curTimeStamp;
        response.data = doTransformResponse(
          response.data,
          response.headers,
          config.transformResponse
        );
        if (
          response.data &&
          typeof response.data === 'object' &&
          response.data.Result !== 1 &&
          response.data.code !== 1
        ) {
          //     app-log
          console.error(
            '[AXIOS] response.data.Result !== 1:',
            config.url,
            response.data
          );

          doClearTimer = true;
          deleteAdapterResponse(); //     ，
        }
        if (timerToClear && doClearTimer) {
          clearTimeout(timerToClear);
        }
        config.transformResponse = [];
        return response;
      },
      (err) => {
        if (timerToClear) {
          clearTimeout(timerToClear);
        }
        currentTask.status = 'rejected';
        currentTask.updateAt = safePerformanceTimeNow();
        deleteAdapterResponse();
        throw err;
      }
    );
    const currentTask = {
      createAt: dtStart,
      // updateAt: undefined,
      status: 'pending',
      result: adapterPromise,
      updateAt: undefined,
    } as IHttpTaskContext;
    lastUnFinishedTask = currentTask;
    if (concurrentTimeout) {
      timerToClear = setTimeout(deleteAdapterResponse, concurrentTimeout);
    } else if (cacheTimeout) {
      timerToClear = setTimeout(deleteAdapterResponse, cacheTimeout);
    } else {
      timerToClear = setTimeout(deleteAdapterResponse, 0);
    }
    httpUnFinishedTask[taskKey] = currentTask;
    // if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    //   //
    //   httpUnFinishedTask[`_debug_tj_${taskKey}`] = dtStart
    // }
    return adapterPromise;
  } else {
    useCacheCb && useCacheCb({ ...lastUnFinishedTask });

    //#region
    const debugTaskKey = taskKey.substr(
      config.baseURL ? config.baseURL.length + 1 : 0
    );
    //               status==pending，

    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log(
        `[AXIOS] UseCache,span=${
          dtStart - lastUnFinishedTask.createAt
        }ms,cacheStatus=${lastUnFinishedTask.status} key=${debugTaskKey}`,
        lastUnFinishedTask,
        config
      );
    }
    //#endregion

    // aviod transform twice
    config.transformResponse = [];
    return lastUnFinishedTask.result;
  }

  function doTransformResponse(
    data: any,
    headers: any,
    fns: AxiosTransformer | AxiosTransformer[]
  ) {
    if (!fns) {
      return data;
    }
    const fnsList = typeof fns === 'function' ? [fns] : fns;
    fnsList.forEach((fn) => {
      data = fn(data, headers);
    });
    return data;
  }
}
//#endregion

function createAxios(config?: {
  adapter?: typeof defaultAdapter;
  baseUrl?: string;
  isV?: boolean;
}) {
  const { adapter = defaultAdapter, isV } = config || {};
  const httpInstance = axios.create({
    baseURL: config?.baseUrl || process.env.VUE_APP_BASEURL_API,
    transformResponse: isV ? [transformResponseV] : [transformResponse],
    adapter,
    isV,
    timeout: process.env.VUE_APP_ENV_SERVER === 'development' ? 20000 : 10000,
  });
  httpInstance.interceptors.request.use(requestHandle, (err) => {
    console.error('[AXIOS] requestHandle reject', err);
    return Promise.reject(err);
  });
  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    if (logConfig.debugMap.http) {
      httpInstance.interceptors.response.use((res) => {
        const config = res.config;
        const logList = ['[http]-axios', 'after', config.url] as any[];
        logList.push('result:', res.data, res.status, res.statusText);
        if (config.params) {
          logList.push('params:', config.params);
        }
        if (config.data) {
          logList.push('data:', config.data);
        }
        console.log.apply(null, logList);
        return res;
      });
    }
  }
  return httpInstance;
}

function dealHttpResponseCommon(res: AxiosResponse<IHttpResponse<unknown>>) {
  if (res.data) {
    res.data.success = res.data.success ?? res.data.Result === 1;
    if (res.data.ErrCode === -4) {
      const store = getStore();
      store.dispatch('user/refreshUserAuthInfoFromBridge', {});
    }
    if (res.data.status === undefined) {
      res.data.status = res.status;
    }
    res.data.code = res.data.code ?? res.data.ErrCode ?? res.status;
    //
    if (!res.data.success) {
      res.data.message = res.data.Reason = transformErrorMsg(
        res.data.Reason ?? res.data.message,
        res.status
      );
    }
    const servertime =
      res.data.servertime || res.__updateAt || getHttpCurrentTime();
    res.data.servertime = servertime;
  }
  return res;
}

/**
 * Promise reject
 */
export const standardSafeHttp = createAxios();
standardSafeHttp.interceptors.response.use(
  dealHttpResponseCommon,
  function standardSafeErrorDeal(err: AxiosError) {
    preprocessError(err);
    const msg = transformErrorMsg(err.message, err.response?.status);

    return Promise.resolve({
      data: createHttpResponse({
        success: false,
        code: err.response?.status || 500,
        message: msg,
      }),
    });
  }
);
function preprocessError(err: AxiosError) {
  if (err.response && err.response.status) {
    const errorFullUrl = err.response.config.url;
    const errorUrlPath = errorFullUrl.split('?')[0].replace(/:\//, '_');
    const errorResCode = err.response.status;
    setTimeout(() => {
      dotting_bridge(
        'h5_ajax_error',
        {
          errorFullUrl,
          errorUrlPath,
          errorResCode,
        },
        errorUrlPath + '_' + errorResCode
      );
    });
  }
  const errConfig = err.config;
  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    console.error('[AXIOS] ResponseError', errConfig?.url, { ...err }, err);
  } else {
    console.error('[AXIOS] ResponseError', errConfig?.url, err.response);
  }
}

function transformErrorMsg(errMsg: string, status: number) {
  switch (errMsg) {
    case 'Network Error':
      return TransTool.Instance.$t(`Base.NETWORK_ERROR`) as string;
    case 'Request aborted':
      return TransTool.Instance.$t(`Base.REQUEST_ABORT`) as string;
    default:
      if (startsWith('Request failed with status code')) {
        if (status) {
          return TransTool.Instance.$t(`Base.requestFailedWithStatus`, {
            code: status,
          }) as string;
        }
      } else if (startsWith(errMsg, 'timeout')) {
        return TransTool.Instance.$t(`Base.Timeout`) as string;
      }
      return errMsg || (TransTool.Instance.$t('Base.RequestError') as string);
  }
}
function transformErrorMsgForV(errMsg: string, errCode: number) {
  if (errCode >= 0 && errCode <= 2000) {
    return TransTool.Instance.$t(`Base.RequestError`) as string;
  } else {
    return transformErrorMsg(errMsg, errCode);
  }
}

const VBASE_URL = process.env.VUE_APP_VPRJURL_API;

/**
 * v   http
 */
export const vSafeHttp = createAxios({
  adapter: (config) => {
    config.headers['Content-Type'] = 'application/json';
    return realAdapter(config);
  },
  baseUrl: VBASE_URL,
  isV: true,
  // headers: { 'Content-Type': 'text/json' },
});
vSafeHttp.interceptors.response.use(
  function dealHttpResponseVCommon(
    res: AxiosResponse<IHttpResponseRawV<unknown>>
  ) {
    const resData = res.data;
    if (resData) {
      const {
        code,
        data: subData,
        servertime,
        success,
        name,
        message,
        logno,
        total,
      } = resData;
      const msg = success ? message : transformErrorMsgForV(message, code);
      const newResData = createHttpResponse({
        success,
        code,
        message: msg,
        data: subData,
        servertime,
        name,
        logno,
        total: total,
      });
      return dealHttpResponseCommon({
        ...res,
        data: newResData,
      });
    }
    return res;
  },
  function standardSafeErrorDeal(err: AxiosError) {
    preprocessError(err);
    const response = err.response;
    const resData = response?.data;

    if (resData) {
      const { code, servertime, name, message, logno } = resData;
      if (code === 401) {
        notifyAppUserTokenFailure();
      }
      const msg = transformErrorMsgForV(message, code);
      return Promise.resolve({
        data: createHttpResponse({
          success: false,
          code: code,
          message: msg,
          name,
          servertime,
          logno,
        }),
      });
    }
    const errCode = response?.status || 500;
    if (errCode === 401) {
      notifyAppUserTokenFailure();
    }
    const msg = transformErrorMsgForV(err.message, errCode);
    return Promise.resolve({
      data: createHttpResponse({
        success: false,
        code: errCode,
        message: msg,
      }),
    });
  }
);

/**
 *   V     httpProxy
 */
export const bridgeSafeHttp = createAxios({
  adapter: httpProxyAdapter,
  baseUrl: VBASE_URL,
  isV: true,
});
bridgeSafeHttp.interceptors.response.use(dealHttpResponseCommon); //    error

const getVHttpSafeInsForAll = function () {
  if (process.env.VUE_APP_ENV_SIM) {
    return vSafeHttp;
  }
  if (window.GC.isCenter) {
    const store = getStore();
    //   Wallet、bounds
    if (store.getters['bridge/isCurWalletTabActive'] === false) {
      // Wallet、bounds    ，  app bridge（           ）
      return bridgeSafeHttp;
    }
  }

  return vSafeHttp;
};

export function getVHttpSafeInsForMainActivity() {
  if (process.env.VUE_APP_ENV_SIM) {
    return vSafeHttp;
  }
  if (window.GC.mainActivityTab && checkMinVersionName('2.9.2.0')) {
    const store = getStore();
    //   Wallet、bounds
    if (
      !(
        store.getters['bridge/isMainActivityActive'] &&
        store.state.bridge.appTabName === window.GC.mainActivityTab
      )
    ) {
      // Wallet、bounds    ，  app bridge（           ）
      return bridgeSafeHttp;
    }
  }

  return vSafeHttp;
}

/**
 * V
 */
export function requestVRaw<T>(
  url: string,
  config?: AxiosRequestConfig & { requestType?: 'form' }
) {
  return getVHttpSafeInsForAll()
    .request<T>({ ...config, url })
    .then((res) => {
      return res.data;
    });
}

/**
 * V
 */
function requestVData<T>(url: string, config?: AxiosRequestConfig) {
  return getVHttpSafeInsForAll()
    .request<IHttpResponse<T>>({ ...config, url })
    .then((res) => {
      return res.data;
    });
}
/**
 * V
 */
export function requestVPostData<T>(
  config: Omit<AxiosRequestConfig, 'method'>
) {
  return requestVData<T>(config.url, {
    ...config,
    method: 'POST',
  });
}
/**
 * V
 */
export function requestVPutData<T>(config: Omit<AxiosRequestConfig, 'method'>) {
  return requestVData<T>(config.url, {
    ...config,
    method: 'PUT',
  });
}
/**
 * V
 */
export function requestVGetData<T>(config: Omit<AxiosRequestConfig, 'method'>) {
  return requestVData<T>(config.url, {
    ...config,
    method: 'GET',
  });
}
