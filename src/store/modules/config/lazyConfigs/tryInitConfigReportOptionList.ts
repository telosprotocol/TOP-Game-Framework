//#region      45

import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

/**
 *     
 */
export interface IConfigReportOptionModel {
  options: { label: string; value: string }[];
}
export const CONFIGNUM_REPORTOPTION = 45;
/**
 *     
 * @returns
 */
export default function tryInitConfigReportOptionList() {
  return tryInitConfigCommon(CONFIGNUM_REPORTOPTION, {
    initialValue: {
      options: [],
    },
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfigReportOptionModel>(
        CONFIGNUM_REPORTOPTION
      );
    },
  });
}
//#endregion
