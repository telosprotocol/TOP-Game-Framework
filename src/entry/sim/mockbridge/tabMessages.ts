import { EventEmitter } from '../../../controller/EventEmitter';
const LS_KEY = '_MOCK_BRIDGE_MESSAGE';

type IMessageType = {
  type: string;
  payload: unknown;
};

export default class TabMessageChannel {
  private static _ins: TabMessageChannel;
  static get Instance() {
    if (!TabMessageChannel._ins) {
      TabMessageChannel._ins = new TabMessageChannel();
    }
    return TabMessageChannel._ins;
  }

  private _emiter: EventEmitter;
  private constructor() {
    this.registerForMessage();
    this._emiter = new EventEmitter();
  }

  private registerForMessage() {
    window.addEventListener('storage', (ev) => {
      if (ev.key == LS_KEY) {
        // removeItem    storage  ，  ev.newValue
        // if (!ev.newValue)
        //   return;
        const message = JSON.parse(ev.newValue).data as IMessageType;
        this._emiter.emit(message.type, message.payload);
      }
    });
  }

  on<T>(type: string, listener: (payload: T) => void) {
    this._emiter.on(type, listener);
  }

  sendMessage(message: IMessageType) {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        data: message,
        timestamp: new Date().getTime(),
      })
    );
    // localStorage.removeItem(LS_KEY);
  }
}
