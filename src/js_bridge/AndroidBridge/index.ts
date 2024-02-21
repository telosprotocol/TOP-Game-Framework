import { uniqueId } from 'lodash-es';

type IResponse<T> =
  | {
      Result: 1;
      data: T;
    }
  | {
      Result: 0;
      Reason?: string;
    };
type RawResponse<T> = IResponse<T> & {
  requestId: string;
  methodName: string;
};
const cbHandlerMap: {
  [reqId: string]: (res: IResponse<any>) => void;
} = {};

const JBridge = {
  onMethodCb: function (response: RawResponse<any>) {
    const { requestId, methodName, ...rest } = response;
    const cb = cbHandlerMap[requestId];
    if (cb) {
      cb(rest);
      delete cbHandlerMap[requestId];
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log(
          '[Bridge]',
          methodName,
          requestId,
          response.Result,
          response
        );
      }
    } else {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log(
          '[Bridge]-Ignored',
          methodName,
          requestId,
          response.Result,
          response
        );
      }
    }
  },
};

window.JBridge = JBridge;

function createAndroidResponse<T>(methodName: string) {
  const method = (window.Android as any)?.[methodName];
  if (!method) {
    return {
      resultPromise: Promise.resolve({
        Result: 0,
        Reason: 'NotSupport',
      } as IResponse<T>),
    };
  }
  const reqId = uniqueId('req_');

  const resultPromise = new Promise<IResponse<T>>((resolve) => {
    cbHandlerMap[reqId] = resolve;
  });

  return {
    reqId,
    resultPromise,
  };
}
export function saveShareImageBridge(byteArray: Uint8Array, imageUrl: string) {
  const { reqId, resultPromise } = createAndroidResponse<{ picUrl: string }>(
    'savePic'
  );
  try {
    window.Android.savePic(reqId, byteArray, imageUrl);
  } catch (ex) {
    console.error('savePic', reqId, ex);
    delete cbHandlerMap[reqId];
  }

  return resultPromise;
}
