import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IHttpError {
  Result: number;
  Reason: string;
  status: number;
  res?: AxiosResponse;
  err?: Error;
}

export default class SimpleHttp {
  private static _ins: SimpleHttp;
  static get Instance() {
    if (!SimpleHttp._ins) {
      SimpleHttp._ins = new SimpleHttp();
    }
    return SimpleHttp._ins;
  }

  private _axioIns: AxiosInstance;
  private constructor() {
    let baseURL = process.env.VUE_APP_BASEURL_API;
    const ary = baseURL.split('/');
    baseURL = ary.slice(0, ary.length - 1).join('/');
    this._axioIns = axios.create({
      baseURL,
    });
  }

  private _initConfig(config: AxiosRequestConfig) {
    if (!config.headers) {
      config.headers = {};
    }
    // if (!config.headers.countryCode) {
    //   config.headers.countryCode = store.state.universe.countryCode
    // }
  }

  requestSuccess<T>(config: AxiosRequestConfig) {
    this._initConfig(config);
    //     Error
    return this._axioIns
      .request(config)
      .then((res) => {
        if (res.status === 200) {
          const ret = res.data as IHttpResponse<T>;
          if (ret.Result === 1) {
            return ret;
          } else {
            const err = {
              Result: ret.Result,
              Reason: ret.Reason,
              res: res,
              status: res.status,
            } as IHttpError;
            throw err;
          }
        } else {
          const err = {
            Result: -1,
            Reason: 'HttpError',
            res: res,
            status: res.status,
          } as IHttpError;
          throw err;
        }
      })
      .catch((e) => {
        const err = {
          Result: -2,
          Reason: 'HttpError',
          err: e,
          status: 500,
        } as IHttpError;
        throw err;
      });
  }

  getSuccess<T>(url: string, config?: AxiosRequestConfig) {
    return this.requestSuccess<T>({
      url: url,
      method: 'GET',
      ...config,
    });
  }
}
