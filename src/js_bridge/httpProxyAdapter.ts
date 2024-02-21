import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import { logConfig } from './../config/debug';

import type { AxiosRequestConfig } from 'axios';
import { buildFullPath, buildURL } from './axioUtils';
import { httpProxy } from './js_call_app_base';
import { createHttpResponse } from '../http/createHttpResponse';

export default function httpProxyAdapter(config: AxiosRequestConfig) {
  const requestData = config.data;
  config.headers['Content-Type'] = 'application/json';
  const requestHeaders: Record<string, string> = {};
  const reqHeaderObj = config.headers || {};
  Object.keys(reqHeaderObj).forEach((headerKey) => {
    const v = config.headers[headerKey];
    requestHeaders[headerKey] = v == null ? '' : v + '';
  });
  const fullPath = buildFullPath(config.baseURL, config.url) as string;
  const reqInfo = {
    method: config.method.toUpperCase() as 'GET' | 'POST' | 'PUT',
    url: buildURL(fullPath, config.params, config.paramsSerializer),
    timeout: config.timeout || 10000,
    headers: requestHeaders,
    data: requestData,
  };
  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    if (logConfig.debugMap.httpProxy) {
      const logList = [
        '[http]-Proxy',
        'before',
        config.url,
        reqInfo.method,
      ] as any[];
      if (config.params) {
        logList.push('params:', config.params);
      }
      if (requestData) {
        logList.push('data:', requestData);
      }
      logList.push(reqInfo);
      console.log.apply(null, logList);
    }
  }
  const result = httpProxy(reqInfo).then((res) => {
    const response = {
      data: undefined as IHttpResponse<unknown>,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config,
      // request: request
    };
    if (res.Result === 1) {
      let httpResponseStr = res.data;
      if (!checkMinVersionName('2.9.2.0') && !httpResponseStr) {
        // fix: app  2920
        httpResponseStr = JSON.stringify({
          success: false,
          code: 500,
          message: 'Network Error',
        });
      }
      try {
        response.data = JSON.parse(httpResponseStr) as IHttpResponse<unknown>;
      } catch (ex) {
        response.status = 500;
        response.statusText = 'error';
        response.data = createHttpResponse({
          success: false,
          code: 500,
          message: 'ParseError',
        });
      }
    } else {
      response.status = res.ErrCode || 0;
      response.statusText = 'error';
      if (res.ErrCode === -1001) {
        response.data = createHttpResponse({
          success: false,
          code: res.ErrCode,
          message: 'timeout',
        });
      } else if (res.ErrCode === -1002) {
        response.data = createHttpResponse({
          success: false,
          code: res.ErrCode,
          message: 'Network Error',
        });
      } else {
        response.data = createHttpResponse({
          success: false,
          code: res.ErrCode,
          message: res.Reason,
        });
      }
      console.error(
        '[AXIOS]-httpProxy response.data.Result !== 1:',
        config.url,
        response.data
      );
    }
    return response;
  });

  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    if (logConfig.debugMap.httpProxy) {
      result.then((res) => {
        const logList = ['[http]-Proxy', 'after', config.url] as any[];
        logList.push('result:', res.data, res.status, res.statusText);
        if (config.params) {
          logList.push('params:', config.params);
        }
        if (requestData) {
          logList.push('data:', requestData);
        }
        console.log.apply(null, logList);
        return res;
      });
    }
  }

  return result;
}
