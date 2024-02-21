//#region apkChannelList

import { MS_DAY } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

type IApkChannelItem = {
  // tp?: number;
  // pf: number;
  key: string;
  url: string;
};
export type IConfig8Model = {
  [key: string | 'DEFAULT']: IApkChannelItem; //| IApkChannelItem[]
};
export const CONFIGNUM_APKCHANNELLIST = 8;

export default function tryInitConfigApkChannelList() {
  return tryInitConfigCommon(CONFIGNUM_APKCHANNELLIST, {
    initialValue: {},
    initMode: 'default',
    overtimeMs: MS_DAY,
    getConfig: function () {
      return getJsonConfigByRemote<IConfig8Model>(CONFIGNUM_APKCHANNELLIST);
    },
  });
}
