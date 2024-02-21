import { EventEmitter } from './EventEmitter';

type ICallMsgReturnData<T> = {
  Result: number;
  data?: T;
  message?: string;
};

export type ICallMsgBase<TInput, TReturnData> = {
  /**
   *  ， methodName
   */
  methodName: string;

  data: TInput;

  /**
   *  callback,
   */
  callback?: IMsgCallbackType<TReturnData>;
};
export type IMsgCallbackType<TReturnData> = (
  returnData: ICallMsgReturnData<TReturnData>
) => void;
type ICallMsg<TInput, TReturnData> = ICallMsgBase<TInput, TReturnData> & {
  isResponse: false;
  /**
   *  id， （ ）
   */
  callId: string;
};

export type IMsg<T> = {
  /**
   *
   */
  isResponse: boolean;

  /**
   *  Id
   */
  callId: string;

  /**
   *
   */
  methodName: string;

  data: T;
};

/**
 *
 */
export type IMsgResponse<T> = {
  /**
   *
   */
  isResponse: true;

  /**
   *  Id
   */
  callId: string;

  /**
   *
   */
  methodName: string;

  data: ICallMsgReturnData<T>;
};

let uniqueId = 1;
export default class GBridgeBase extends EventEmitter {
  protected logName = '[GBridgeBase]';
  protected debug = false;

  /**
   * message
   */
  init() {
    this.onMessage = this.onMessage.bind(this);
    window.addEventListener('message', this.onMessage, false);
  }

  //#region
  private getMethodCallKey(methodName: string) {
    return `method_${methodName}`;
  }

  private getReturnCallbackKey(callId: string) {
    return `return_${callId}`;
  }
  private onMessage(e: { data: string; source: any; origin: string }) {
    const { data } = e;
    let msgJson: IMsg<unknown>;
    try {
      msgJson = JSON.parse(data);
    } catch (ex) {
      console.warn(this.logName, 'MessageParseError', ex, data);
      return;
    }
    // emit

    if (msgJson.isResponse) {
      if (this.debug) {
        console.log(
          this.logName,
          '[onMessage] Response',
          msgJson.methodName,
          msgJson
        );
      }
      this.emit(this.getReturnCallbackKey(msgJson.callId), msgJson);
    } else {
      if (this.debug) {
        console.log(
          this.logName,
          '[onMessage] Call',
          msgJson.methodName,
          msgJson
        );
      }
      this.emit(this.getMethodCallKey(msgJson.methodName), msgJson);
    }
  }

  protected getCallId() {
    return `bridge_msg_` + uniqueId++;
  }

  protected callMethod<TInput, TReturn>(
    msg: ICallMsgBase<TInput, TReturn>,
    windowList: Window[]
  ) {
    const callId = this.getCallId();
    const detailMsg: ICallMsg<TInput, TReturn> = {
      isResponse: false,
      callId,
      data: msg.data,
      methodName: msg.methodName,
      callback: msg.callback,
    };
    const msgStr = JSON.stringify(detailMsg);
    windowList.forEach((win) => {
      win.postMessage(msgStr, '*');
    });
    if (this.debug) {
      console.log(this.logName, 'callMsg', callId, msg.methodName, msg);
    }
    if (msg.callback) {
      this.on(this.getReturnCallbackKey(callId), msg.callback as any, true); //
    }
  }

  //#endregion

  /**
   *
   * @param methodName
   * @param handler handler ，
   */
  addEventHandler<TCallData, TReturn>(
    methodName: string,
    handler: (
      data: TCallData
    ) => Promise<ICallMsgReturnData<TReturn>> | void | Promise<void>
  ) {
    if (this.debug) {
      console.log(this.logName, 'start addEventHandler', methodName);
    }
    this.on(
      this.getMethodCallKey(methodName),
      async (reqMsg: IMsg<TCallData>) => {
        const res = await handler(reqMsg.data);
        if (res) {
          this.emit(this.getReturnCallbackKey(reqMsg.callId), {
            isResponse: true,
            callId: reqMsg.callId,
            methodName: reqMsg.methodName,
            data: res,
          } as IMsgResponse<TReturn>);
        }
        // else {
        //   //
        // }
      },
      false
    );
  }

  destroy() {
    window.removeEventListener('message', this.onMessage);
    this.clearListeners();
    if (this.debug) {
      console.log(this.logName, 'destroy');
    }
  }
}
