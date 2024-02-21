import { EventEmitter } from '@/controller/EventEmitter';
import type { GBusEventName, IGBusEventPayloadMap } from './GBus-type';
const GBus = new EventEmitter();
// export default GBus;

if (process.env.VUE_APP_ENV_SERVER === 'development') {
  (window as any).GBus = GBus;
}

/**
 * GBus     ，  off
 * @param eventName
 * @param callback
 * @returns
 */
export function onGBus<TEvent extends GBusEventName>(
  eventName: TEvent,
  callback: (payload: IGBusEventPayloadMap[TEvent]) => void,
  isOnce?: boolean
) {
  GBus.on(eventName, callback, isOnce);
  return () => {
    GBus.off(eventName, callback);
  };
}
export function emitGBus<TEvent extends GBusEventName>(
  eventName: TEvent,
  payload: IGBusEventPayloadMap[TEvent]
) {
  GBus.emit(eventName, payload);
}
