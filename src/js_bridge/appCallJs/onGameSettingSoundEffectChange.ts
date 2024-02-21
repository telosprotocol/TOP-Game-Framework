import { tryInitRegisterHandler } from './appCallJsBaseUtils';

export function tryInitOnGameSettingSoundEffectChange(
  cb: (isOpen: boolean) => void
) {
  tryInitRegisterHandler<{ isOpen: boolean }, null>(
    'gameSettingSoundEffect',
    (_str, json) => {
      cb(json.isOpen);
      return null;
    }
  );
}
