import { tryInitRegisterHandler } from './appCallJsBaseUtils';
import type { IGBusEventPayloadMap } from '@/utils/GBus-type';
import { emitGBus, onGBus } from '@/utils/GBus';

let curOnceCb: (payload: IGBusEventPayloadMap['onPayActivityEnd']) => void;
export async function tryInitPayActivityEnd() {
  const isInited = await tryInitRegisterHandler<
    IGBusEventPayloadMap['onPayActivityEnd'],
    null
  >('onPayActivityEnd', (_str, json) => {
    emitGBus('onPayActivityEnd', json);
    return null;
  });
  if (isInited) {
    onGBus('onPayActivityEnd', (payload) => {
      if (curOnceCb) {
        curOnceCb(payload);
      }
      curOnceCb = null;
    });
  }
}

export function waitNextPayActivityEndCb(
  cb: (payload: IGBusEventPayloadMap['onPayActivityEnd']) => void
) {
  const lastCb = curOnceCb;
  if (lastCb) {
    lastCb({
      type: 'Canceled',
      isRechargeTriggered: false,
    });
  }
  curOnceCb = cb;
}

export function waitNextPayActivityEndPromise() {
  const lastCb = curOnceCb;
  if (lastCb) {
    lastCb({
      type: 'Canceled',
      isRechargeTriggered: false,
    });
  }
  return new Promise<IGBusEventPayloadMap['onPayActivityEnd']>((resolve) => {
    curOnceCb = resolve;
  });
}
