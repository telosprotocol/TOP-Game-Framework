import { onGBus } from '@/utils/GBus';
import type { IGBusEventPayloadMap } from '@/utils/GBus-type';
import { getLastGameGuideFinish } from './registerForMainActivity';

let isLasstGameGuideFinishConsumed = false;
export type GameGuideEndInfo = IGBusEventPayloadMap['onAppGameGuideFinish'];
export function onAppGameGuideFinish(
  callback: (info: GameGuideEndInfo) => void
) {
  if (!isLasstGameGuideFinishConsumed) {
    const lastGameGuideFinishData = getLastGameGuideFinish();
    if (lastGameGuideFinishData) {
      callback(lastGameGuideFinishData);
    }
  }
  isLasstGameGuideFinishConsumed = true;
  onGBus('onAppGameGuideFinish', (info) => {
    if (info) {
      callback(info);
    }
  });
}
