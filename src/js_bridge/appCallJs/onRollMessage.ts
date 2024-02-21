import { emitGBus } from '@/utils/GBus';
import type { IGBusEventPayloadMap } from '@/utils/GBus-type';
import { tryInitRegisterHandler } from './appCallJsBaseUtils';

/**
 * for bounds tab
 * @returns
 */
export function tryInitRollMessage() {
  return tryInitRegisterHandler<IGBusEventPayloadMap['onRollMessage'], null>(
    'rollMessage',
    (_str, json) => {
      emitGBus('onRollMessage', json);
      return null;
    }
  );
}
