import type { IBridgeModelAdInfo } from '@/js_bridge/js_call_app.d';
import { hideLoading, showLoading } from '@/utils/loadingTool';
import axios from 'axios';
import { Toast } from 'vant';
import { wait } from '../../../utils/wait';
import { createSignForSim } from './mockSign';
import * as InfoBridges from './mockUserBridge';

// const TAG = "[SIM]"
const COMMON_RESULT = { Result: 1 };
function toast(msg: string) {
  Toast({ message: msg });
}

let curIsUserOpenPush = false;
let statusBarEl: HTMLDivElement;
export default {
  openSimpleWebBridge: COMMON_RESULT,
  openExternalBrowser: COMMON_RESULT,
  setStatusColor: async (payload: { color: string; isDark: boolean }) => {
    if (!statusBarEl) {
      statusBarEl = document.createElement('div');
      // statusBarEl.style.position = 'absolute';
      // statusBarEl.style.top = '0';
      // statusBarEl.style.left = '0';
      // statusBarEl.style.right = '0';
      // statusBarEl.style.height = '10px';
      statusBarEl.style.zIndex = '1000000';
      statusBarEl.style.fontSize = '8px';
      statusBarEl.style.width = '80px';
      statusBarEl.style.textAlign = 'center';
      statusBarEl.style.borderLeft = '1px solid red';
      statusBarEl.innerHTML = 'MockStatusBar';

      statusBarEl.className =
        'fixed right-0 top-0 h-[25px]  flex items-center pointer-events-none';
      // statusBarEl.innerHTML =
      //   '<div class="fixed right-0 top-0 bottom-0 w-20 flex items-end" style="z-index:1000000;background:rgba(0,0,0,0.3);outline:1px solid rgba(0,0,0,0.3)">  StatusBar</div>';
      document.body.append(statusBarEl);
    }
    statusBarEl.style.color = payload.isDark ? '#fff' : '#000';
    statusBarEl.style.background = payload.color;
    return COMMON_RESULT;
  },
  updateCoins: async () => {
    return COMMON_RESULT;
  },
  async getTopPageName() {
    return {
      Result: 1,
      data: 'bounds',
    };
  },
  showToast: async (payload: { content: string }) => {
    toast(payload.content);
    return COMMON_RESULT;
  },
  showLoading: async (payload: { canCancel: boolean }) => {
    showLoading(!payload.canCancel);
    return COMMON_RESULT;
  },
  dismissLoading: async () => {
    hideLoading();
    return COMMON_RESULT;
  },
  getIsAPKListInstalledBatch: async (payload: { apkList: string[] }) => {
    return {
      Result: 1,
      data: payload.apkList,
    };
  },
  getClipboardStr: async () => {
    return {
      Result: 1,
      data: 'test12222',
    };
  },
  async startAppByPackageName() {
    return {
      Result: 1,
      data: true,
    };
  },
  ...InfoBridges,
  getAdvertisingInfo: {
    Result: 1,
    data: {
      androidId: '',
      gaid: 'sdfsdffds',
      imei: '',
      mac: '',
      udid: '',
    } as IBridgeModelAdInfo,
  },
  //
  async getInfo(params: Record<string, string>) {
    return {
      Result: 1,
      data: JSON.stringify(createSignForSim(params)),
    };
  },
  getStatusBarHeight: {
    Result: 1,
    data: (window.innerWidth / 360) * 25 * window.devicePixelRatio,
  },
  async navigation(payload: { url: string }) {
    const url = payload.url;
    if (url.substr(0, 7) !== 'vv:') {
      if (url.substr(0, location.href.length) === location.href) {
        //router path
        location.href = url;
      } else {
        //globle url
        location.href = url;
        // window.open(url, '_blank', 'modal=yes,width=360,height=702')
      }
    } else {
      toast('Native open url:' + url);
    }
    console.log('navigation sim action.', url);

    return COMMON_RESULT;
  },
  async showDialog(payload: { content: string }) {
    const url = payload.content;
    Toast('Start Show Dialog');
    location.href = url;
    console.log('showDialog  sim action', url);

    return COMMON_RESULT;
  },
  async closeActivity() {
    toast(`Native close current web after  1s later`);
    await wait(1000);
    window.close();
    return {
      Result: 1,
      data: true,
    };
  },
  dotting: COMMON_RESULT,
  setLocalLog: COMMON_RESULT,
  share: COMMON_RESULT,
  updateTaskInfo: COMMON_RESULT,
  async penetrateData() {
    return COMMON_RESULT;
  },
  async checkVersion() {
    toast('Native try checkVersion');
    return {
      Result: 1,
      data: false,
    };
  },
  async openSystemEmail(payload: { emailAddress: string }) {
    toast('Native openSystemEmail:' + payload.emailAddress);
    return {
      Result: 1,
    };
  },
  async openNativeApp(payload: {
    appNativeUri: string;
    appWebViewUri: string;
  }) {
    toast(
      `Native openNativeApp:uri=${payload.appNativeUri} weburl=${payload.appWebViewUri}`
    );
    return {
      Result: 1,
    };
  },
  async paste(payload: { content: string }) {
    toast(`Native paste:${payload.content}`);
    return {
      Result: true,
      data: true,
    };
  },
  async preDownloadPic(payload: { url: string }) {
    toast(`Native preDownloadPic:${payload.url}`);
    return {
      Result: 1,
      data: true,
    };
  },
  async shareWhatsApp(payload: {
    url: string;
    content: string;
    picUrl: string;
    profile: {
      /**
       *
       */
      useCache: boolean;
      /**
       *
       */
      spanMS: number;
    };
  }) {
    toast(`Native shareWhatsApp:${payload.content} ${payload.url}`);
    return {
      Result: 1,
    };
  },
  async addPushListener(type: string) {
    //        ，    json
    toast(`Native addPushListener:${type} `);
    return {
      Result: 1,
    };
  },
  async shareWithAddressBook(data: {
    shareLink: string;
    content: string;
    /**
     *
     */
    traceParam: Record<string, number | string>;
  }) {
    toast(`Native subscribeChannel:${data.content} ${data.shareLink}`);
    return {
      Result: 1,
      data: true,
    };
  },
  async getIsUserOpenPush() {
    return {
      Result: 1,
      data: curIsUserOpenPush,
    };
  },
  async openUserPush() {
    toast(`Native OPEN USERPUSH`);
    curIsUserOpenPush = true;
    return COMMON_RESULT;
  },
  async closeDialog() {
    return COMMON_RESULT;
  },
  async requestDownloadAPK(payload: {
    /**
     *
     */
    packageName: string;

    /**
     *
     */
    url: string;

    /**
     *   ,
     */
    icon?: string;

    /**
     *
     */
    title: string;
  }) {
    toast(`requestDownloadAPK ${payload.packageName} ${payload.title}`);
    return { Result: 1 };
  },
  async httpProxy(payload: {
    method: 'GET' | 'POST';
    url: string; //http://xxxxxx
    /**
     * POST
     */
    data?: string;
    headers: Record<string, string>;
    timeout: number; //    ，  :ms
  }) {
    const res = await axios.request(payload).then((res) => {
      return res.data;
    });
    return {
      Result: 1,
      data: JSON.stringify(res),
    };
  },
};
