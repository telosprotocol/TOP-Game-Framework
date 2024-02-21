type Listener<TEvent, TEvent2 = unknown> =
  | ((arg: TEvent) => void)
  | ((arg1: TEvent, arg2: TEvent2) => void);
export class EventEmitter {
  private _emap: {
    [eventName: string]: {
      listeners: {
        listener: Listener<any, any>;
        once: boolean;
      }[];
    };
  } = {};
  on<TEvent, TEvent2>(
    eventName: string,
    listener: Listener<TEvent, TEvent2>,
    isOnce?: boolean
  ) {
    this.on2(eventName, listener, isOnce);
    return this;
  }

  /**
   * on2  on  ，
   * @param eventName
   * @param listener
   * @param isOnce
   * @returns listener
   */
  on2<TEvent, TEvent2>(
    eventName: string,
    listener: Listener<TEvent, TEvent2>,
    isOnce?: boolean
  ) {
    let eventObj = this._emap[eventName];
    if (!eventObj) {
      eventObj = {
        listeners: [],
      };
      this._emap[eventName] = eventObj;
    }
    eventObj.listeners.push({
      listener: listener,
      once: !!isOnce,
    });
    return listener;
  }

  once<TEvent, TEvent2>(
    eventName: string,
    listener: Listener<TEvent, TEvent2>
  ) {
    return this.on(eventName, listener, true);
  }

  off<TEvent, TEvent2>(
    eventName: string,
    listener?: Listener<TEvent, TEvent2>
  ) {
    const eventObj = this._emap[eventName];
    if (!eventObj) {
      return this;
    }
    if (!listener) {
      //
      eventObj.listeners = [];
      return this;
    }
    for (let i = 0; i < eventObj.listeners.length; i++) {
      const item = eventObj.listeners[i];
      if (item.listener === listener) {
        eventObj.listeners.splice(i, 1);
        return this;
      }
    }

    return this;
  }

  emit(eventName: string, ...args: unknown[]) {
    const eventObj = this._emap[eventName];
    if (!eventObj) {
      return this;
    }
    eventObj.listeners.forEach((item) => {
      if (item.once) {
        this.off(eventName, item.listener);
      }
      (item.listener as any).apply(this, args);
    });
    return this;
  }

  getListeners(eventName: string) {
    const obj = this._emap[eventName];
    if (obj) {
      return [...obj.listeners].map((item) => {
        return item.listener;
      });
    }
    return [];
  }

  clearListeners() {
    this._emap = {};
  }
}
