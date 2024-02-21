import type {
  IBridgeModelAppInfo,
  IBridgeModelConfig,
  IBridgeModelDeviceInfo,
} from '@/js_bridge/js_call_app.d';
import { wait } from '@/utils/wait';
import { mockUserInfo } from '../model/user.model';

// -------------------  Token（     token，      ）-------------------------
const debugAuth =
  'Bearer eyJraWQiOjIwMDEsImFsZyI6IkhTMjU2IiwiemlwIjoiR1pJUCJ9.H4sIAAAAAAAAAGWPQU_DMAyF_4vPVUnSOIl3m4qEdkNi7MBlSpfAgrS0alLEhPjvuIMbF0v-3nvy8xfEzwk20gpllXPCNZB8_QVGK30DpcAGlBASGijLwIsU1gqnyBndWWvRshLiByvbHFo5GIX4agIaQuo8Ku1IGZQnokF61faPx8ODv8SjD-9LqRxeSpz7Ofoa9-kSb_cl8TBE2jTgp-kQ55LGvDZpqRXtWobx_jqxfS3XwGlccp2v_RgYwe6eHdOYcn1OATbUUYfCSY2InZPWcKDyrZcxr-5tSf7u6ezz29mnv0I7jv379PsHhSn1BjMBAAA.8B_3BoJ3jRS_-DV9OpmHPwpCHnVBZI6gXWtR-TnqPx0';
const isUserLogined = true;
const hashStr = location.hash;
const searchIdx = hashStr.indexOf('?');
const searchStr = hashStr.substr(searchIdx);
let lang = 'en';
let region = 'ID';
let country = 'ID';
if (searchStr) {
  const search = new URLSearchParams(searchStr);
  lang = search.get('l') || 'en';
  region = search.get('r') || 'ID';
  country = search.get('c') || 'ID';
}
const deviceInfo = {
  model: {
    country: country,
    deviceBrand: 'Xiaomi',
    deviceIP: '172.16.200.214',
    deviceMac: 'F4:60:E2:D2:14:C0',
    deviceModel: 'false_Xiaomi_MIX 2S',
    deviceName: 'Xiaomi_MIX 2S',
    deviceOS: 'Android',
    deviceOSVersion: '10',
    deviceUniqId: '54e72c0f6d52fbea0a0657ee3dd2e70e',
    isEmulator: false,
    language: lang,
    serial: 'unknown',
    timeZone: 'Asia/Shanghai',
  },
  clientInfo:
    'eyJpc1NpbXVsYXRvciI6MCwicm9vdGVkIjowLCJjb25uZWN0ZWRWUE4iOjAsImNsaWVudFRpbWUiOjE1OTkxMTIwNjEzMDEsImFwcElkIjoiY29tLnZkLnZpZG5vdy5kbjEiLCJhcHBWZXJzaW9uIjoiMS4yLjAiLCJkZXZpY2VJZCI6IkFuZC41NGU3MmMwZjZkNTJmYmVhMGEwNjU3ZWUzZGQyZTcwZS5BUEswMDEiLCJtYW51ZmFjdHVyZSI6IlhpYW9taSIsInBsYXRmb3JtIjoiQW5kIiwic2VyaWFsTnVtYmVyIjoidW5rbm93biIsIm1hYyI6IkY0OjYwOkUyOkQyOjE0OkMwIiwiZGV2aWNlT3JpZ2luYWxJZCI6IjgzYjg0YTk3Y2YxYWRmZDMiLCJpcCI6IjE3Mi4xNi4yMDAuMjE0In0=',
  deviceId: 'And.54e72c0f6d52fbea0a0657ee3dd2e70e.APK001',
} as IBridgeModelDeviceInfo;

const appInfo = {
  appType: '2001',
  versionName: window.GC.appVersion,
  buildNum: '4718',
  versionCode: 22,
} as IBridgeModelAppInfo;

const config = {
  lang: lang,
  region: region,
  countryCode: country,
} as IBridgeModelConfig;
const userInfo = {
  ...(mockUserInfo as any),
  auth: isUserLogined ? debugAuth || process.env.VUE_APP_ENV_SIM_AUTH : '',
};
console.log('[DEBUG] auth', userInfo.auth);
export const getDeviceInfo = { Result: 1, data: deviceInfo };

export const getAppInfo = {
  Result: 1,
  data: appInfo,
};

export const getConfig = {
  Result: 1,
  data: config,
};

export const getUserInfo = {
  Result: 1,
  data: userInfo,
};

export async function isLoginAsync() {
  await wait(300);
  return {
    Result: 1,
    data: isUserLogined,
  };
}
