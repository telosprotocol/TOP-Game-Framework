import type { IConfig20Model } from './../globalConfigs/Config20CountryCodeConfig';
import type {
  CONFIGNUM_APKCHANNELLIST,
  IConfig8Model,
} from './tryInitConfigApkChannelList';
import type {
  CONFIGNUM_BANNER,
  CONFIGNUM_VBANNER,
  IConfigBannerModel,
} from './tryInitConfigBanner';
import type { CONFIGNUM_LOTTERY, IConfig60Model } from './tryInitConfigLottery';
import type {
  CONFIGNUM_PLAYFORMCATEGORY,
  IConfig107Model,
} from './tryInitConfigPlayformCategory';
import type {
  CONFIGNUM_PROPCONFIG,
  IConfigPropModel,
} from './tryInitConfigPropConfig';
import type {
  CONFIGNUM_REPORTOPTION,
  IConfigReportOptionModel,
} from './tryInitConfigReportOptionList';
import type {
  CONFIGNUM_REDEEMINFO,
  IConfig13Model,
} from './tryInitConfigRedeemInfo';
import type {
  CONFIGNUM_GAMELIST,
  IConfigGameListModel,
} from './tryInitConfigGameList';
import type {
  CONFIGNUM_UserInfoCompleteOptions,
  IConfigUserInfoCompleteOptions,
} from './tryInitConfigUserInfoCompleteOptions';
import type {
  CONFIGNUM_ADCONFIG,
  IConfigAdModel,
} from './tryInitConfigAdConfig';
import type {
  CONFIGNUM_REFERAINFO,
  IConfig14Model,
} from './tryInitConfigRefer';

import { CONFIGNUM_WHATS, IConfigWhats } from './tryInitConfigWhats';
import type { CONFIGNUM_20 } from './tryInitConfig20';

//#endregion

export type ILazyConofigMapType = Partial<{
  /**
   * redeemTip  （tryInitConfig13   ）
   */
  [CONFIGNUM_REDEEMINFO]: IConfig13Model;
  [CONFIGNUM_GAMELIST]: IConfigGameListModel;
  [CONFIGNUM_REPORTOPTION]: IConfigReportOptionModel;
  [CONFIGNUM_UserInfoCompleteOptions]: IConfigUserInfoCompleteOptions;
  [CONFIGNUM_BANNER]: IConfigBannerModel;
  [CONFIGNUM_APKCHANNELLIST]: IConfig8Model;
  [CONFIGNUM_LOTTERY]: Partial<IConfig60Model>;
  [CONFIGNUM_PLAYFORMCATEGORY]: Partial<IConfig107Model>;
  [CONFIGNUM_PROPCONFIG]: Partial<IConfigPropModel>;
  [CONFIGNUM_REFERAINFO]: Partial<IConfig14Model>;
  [CONFIGNUM_ADCONFIG]: Partial<IConfigAdModel>;
  [CONFIGNUM_WHATS]: Partial<IConfigWhats>;
  [CONFIGNUM_20]: IConfig20Model;

  [CONFIGNUM_VBANNER]: IConfigBannerModel;
}>;
export type IConfigLazyKey = keyof ILazyConofigMapType;
