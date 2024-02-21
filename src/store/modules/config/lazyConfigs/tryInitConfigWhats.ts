import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

export interface IConfigWhats {
  guideUrl: string;
  guidePoster: string;
}

export const CONFIGNUM_WHATS = 120;

/**
 *     
 * @returns
 */
export default function tryInitConfigWhats() {
  return tryInitConfigCommon(CONFIGNUM_WHATS, {
    initialValue: {} as Partial<IConfigWhats>,
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfigWhats>(CONFIGNUM_WHATS);
    },
  });
}
