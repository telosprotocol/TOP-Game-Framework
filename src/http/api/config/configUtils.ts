import { getStore } from '@/store/util';
import { getCurrentLang } from '@/init/i18n';
import { Base64 } from 'js-base64';
import { standardSafeHttp } from '../../index';
import { HttpLocalStorage } from '../../../controller/HttpLocalStorage';
import { waitHttpParamsInited } from '@/store/modules/base';

const CONFIG_API_PATH = '/vu/common/v2/config';
const REQUEST_DEFAULT_COUNTRY_CODE = 'US';
function getJsonConfigParams(
  configType: number,
  optional?: { countryCode?: string; lang?: string }
) {
  const { countryCode, lang } = optional || {};
  const store = getStore();
  const params = {
    countryCode:
      countryCode ||
      store.state.universe.countryCode ||
      REQUEST_DEFAULT_COUNTRY_CODE,
    lang: lang || getCurrentLang(),
    configType: configType,
  };
  return params;
}

export function getJsonConfigByCache<T>(configType: number) {
  const params = getJsonConfigParams(configType);
  return HttpLocalStorage.Instance.getCache<IHttpResponse<T>>(
    CONFIG_API_PATH,
    params
  );
}
/**
 *       Json
 * @param {{configType:number,lang?:string}} params
 */

export async function getJsonConfigByRemote<T>(configType: number) {
  const store = getStore();
  const queryParams = {
    configType,
    deviceId: '',
    lang: '',
    countryCode:
      store.state.universe.countryCode || REQUEST_DEFAULT_COUNTRY_CODE,
    appType: store.state.app.appType,
  };
  await waitHttpParamsInited();
  const res = await standardSafeHttp.get<IHttpResponse<string>>(
    CONFIG_API_PATH,
    {
      params: queryParams,
    }
  );
  const { data } = res;
  const result: IHttpResponse<T> = {
    ...data,
    data: null,
  };
  if (data.Result === 1) {
    if (data.data) {
      const str: string = Base64.decode(data.data);
      result.data = JSON.parse(str);
      //   config
      HttpLocalStorage.Instance.setCache(
        CONFIG_API_PATH,
        getJsonConfigParams(queryParams.configType, {
          countryCode: queryParams.countryCode,
          lang: queryParams.lang,
        }),
        result
      );
    } else {
      result.data = {} as T;
      // result.Result = 0
      // result.Reason = 'No Data'
    }
  } else {
    console.log('[Warn] ConfigGetError', queryParams, res);
  }
  return result;
}
