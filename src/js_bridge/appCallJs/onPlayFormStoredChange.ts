import { emitGBus } from '@/utils/GBus';
import type { IGBusEventPayloadMap } from '@/utils/GBus-type';
import { tryInitRegisterHandler } from './appCallJsBaseUtils';

export function tryInitPfStoredChangeHandler() {
  tryInitRegisterHandler<IGBusEventPayloadMap['onPlayFormStoredChange'], null>(
    'onPlayFormStoredChange',
    (_str, json) => {
      emitGBus('onPlayFormStoredChange', json);
      return null;
    }
  );
}
