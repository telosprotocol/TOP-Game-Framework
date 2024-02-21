import type { RouterNameInappType } from '@/constants/localRoutePath';
import { storeDispatch } from '@/store/util';
import { emitGBus } from '@/utils/GBus';
import type { GBusEventName, IGBusEventPayloadMap } from '@/utils/GBus-type';
import { penetrateDataRaw } from './penetrateDataRaw';

/**
 * store commit + penetrate
 * @param commitType string
 * @param payload any
 * @param to       webview
 */
export function storeCommitAndPenetrate(
  commitType: string,
  payload: any,
  to?: RouterNameInappType
) {
  window.vue205.$ss.commit(commitType, payload);
  penetrateCommitOnly(commitType, payload, to);
}
/**
 *    penetrate
 * @param dispatchType
 * @param payload
 * @param to       webview
 */
export function penetrateCommitOnly(
  commitType: string,
  payload: any,
  to?: RouterNameInappType
) {
  return penetrateDataRaw({
    to: to,
    commitInfo: [
      {
        type: commitType,
        payload: payload,
      },
    ],
  });
}
/**
 * store commit + penetrate
 * @param dispatchType string
 * @param payload any
 * @param to       webview
 */

export function storeDispatchAndPenetrate(
  dispatchType: string,
  payload: any,
  to?: RouterNameInappType
) {
  storeDispatch(dispatchType, payload);
  penetrateDispatchOnly(dispatchType, payload, to);
}
/**
 *    penetrate
 * @param dispatchType
 * @param payload
 * @param to      webview
 */

export function penetrateDispatchOnly(
  dispatchType: string,
  payload: any,
  to?: RouterNameInappType
) {
  return penetrateDataRaw({
    to: to,
    dispatchInfo: [
      {
        type: dispatchType,
        payload: payload,
      },
    ],
  });
}

/**
 *            GBus
 * store commit + penetrate
 * @param commitType string
 * @param payload any
 * @param to       webview
 */
export function gBusEmitAndPenetrate<TEvent extends GBusEventName>(
  eventName: TEvent,
  payload: IGBusEventPayloadMap[TEvent],
  to?: RouterNameInappType
) {
  emitGBus(eventName, payload); //
  if (window.GC.isInApp) {
    penetrateGBusOnly(eventName, payload, to);
  }
}
/**
 *    penetrate  (       )
 * @param dispatchType
 * @param payload
 * @param to       webview
 */
export function penetrateGBusOnly<TEventName extends GBusEventName>(
  eventName: TEventName,
  detail: IGBusEventPayloadMap[TEventName],
  to?: RouterNameInappType
) {
  return penetrateDataRaw({
    to: to,
    gBus: [
      {
        eventName,
        detail,
      },
    ],
  });
}
