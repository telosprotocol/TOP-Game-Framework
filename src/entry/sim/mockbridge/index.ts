import { wait } from '../../../utils/wait';
import jsCallAppSimMap from './mockCallbridge';

const TAG = '[SIM]';

async function callHandler(
  methodName: string,
  jsonStr: string,
  cb?: (rlt: string) => void
) {
  const payload =
    methodName === 'addPushListener' || methodName === 'penetrateData'
      ? jsonStr
      : JSON.parse(jsonStr);

  const item = jsCallAppSimMap[methodName as keyof typeof jsCallAppSimMap];
  await wait(50);
  if (item) {
    let res = item;
    if (typeof item === 'function') {
      res = (await item(payload)) as any;
    }
    console.log(
      `%c${TAG} ${methodName}`,
      'color:#ff7a2c',
      'payload',
      payload,
      'Result=',
      res
    );
    if (cb) {
      cb(JSON.stringify(res));
    }
  } else {
    console.warn(
      TAG,
      methodName,
      'Method not mocked,return common result',
      payload
    );
    if (cb) {
      cb(JSON.stringify({ Result: 1 }));
    }
  }
}

function onWebviewReady(WebViewJavascriptBridge: IWebViewJavascriptBridge) {
  // WebViewJavascriptBridge._fetchQueue
  // const oldCallHandler = WebViewJavascriptBridge.callHandler;
  WebViewJavascriptBridge.callHandler = callHandler;
}

export function initMockPlugin() {
  if (window.WebViewJavascriptBridge) {
    onWebviewReady(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      function () {
        onWebviewReady(window.WebViewJavascriptBridge);
      },
      false
    );
  }
}

setTimeout(() => {
  window.vue205.$ss.commit('bridge/setAppActiveTab', {
    name: 'bounds',
  });
}, 1000);
