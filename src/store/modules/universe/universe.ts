import {
  SUPPORT_LANG_CODE,
  SUPPORT_LANG_CODE_KEY,
  SUPPORT_LANG_MAP_TYPE,
} from '@/constants/locale';
import { getStore } from '@/store/util';
import {
  formatFloatBase,
  formatNumberInAbbreviationBase,
  IFormatFloatOption,
  IFormatFloatOptionBase,
} from '@/utils/string';
import type { Module } from 'vuex';
import {
  getCountryCodeLs,
  KEY_COUNTRY_CODE_LOCALSTORAGE,
  setCountryCodeLs,
} from '../../../controller/PersistentLocalStorage';
import { getCurrentLang } from '../../../init/i18n';
import type { IStoreStateType } from '../../interface/interface';
import type { IGetterType } from '../../interface/interface.base';
import { UNIVERSE_MUTATIONS_TYPES } from './UNIVERSE_MUTATIONS_TYPES';
//#region initialState

type ILocalContryConfig = {
  /**
   *     , Rp
   */
  moneySymbol: string;

  // /**
  //  *     ，
  //  */
  // estimateRatio: number;
};

// /**
//  *
//  */
// decimalMark: string;

// /**
//  *
//  */
// separator: string;
const LANG_CONFIG_MAP = {
  id: {
    decimalMark: ',',
    separator: '.',
    KMGT: {
      K: 'K',
      M: 'M',
      G: 'B',
      T: 'T',
    },
  },
  default: {
    decimalMark: '.',
    separator: ',',
    KMGT: {
      K: 'K',
      M: 'M',
      G: 'B',
      T: 'T',
    },
  },
};
//
const VERSION_COUNTY_CONFIG_FOR_ID: ILocalContryConfig = {
  //ID
  moneySymbol: 'Rp',
  // estimateRatio: 200,
};
const VERSION_COUNTRY_CONFIG_MAP: {
  [versionCountryCode: string]: ILocalContryConfig;
} = {
  //     ,TODO:      DEFAULT
  US: VERSION_COUNTY_CONFIG_FOR_ID,
  IN: {
    // IN    HI
    moneySymbol: '₹',
    // estimateRatio: 1,
  },
  ID: VERSION_COUNTY_CONFIG_FOR_ID,
};

//#region countryCode
const FALLBACK_COUNTRY = 'US';
function setCountryCodeLocalStorage(contryCode: string) {
  setCountryCodeLs(contryCode);
  document.cookie = `${KEY_COUNTRY_CODE_LOCALSTORAGE}=${contryCode}`;
}

function convertCountryToVersionCountry(countryCode: string) {
  if (!countryCode) {
    return FALLBACK_COUNTRY;
  }
  const c = countryCode.toUpperCase();
  if (VERSION_COUNTRY_CONFIG_MAP[c]) {
    return c;
  }
  return FALLBACK_COUNTRY;
}

//   url  versionCountry
function getCountryCodeBySearch() {
  // 1.search
  let queryCountry = location.search && getCountryQuery(location.search);
  if (queryCountry) {
    setCountryCodeLocalStorage(queryCountry);
    return queryCountry;
  }

  // 2.hash
  queryCountry = location.hash && getCountryQuery(location.hash);
  if (queryCountry) {
    setCountryCodeLocalStorage(queryCountry);
    return queryCountry;
  }
  function getCountryQuery(searchStr: string) {
    const matches = searchStr.match(/[?&]c=(\w+)/);
    if (matches && matches.length > 0) {
      return matches[1];
    }
  }
  // 3.localStorage
  const versionCountry = getCountryCodeLs();
  return versionCountry || FALLBACK_COUNTRY;
}

//#endregion

const initialCountryCode = getCountryCodeBySearch();
const initialVersionCountry =
  convertCountryToVersionCountry(initialCountryCode);

const initialState = {
  ...VERSION_COUNTRY_CONFIG_MAP[initialVersionCountry],

  /**
   *     : IN|ID|US
   */
  versionCountry: initialVersionCountry,

  /**
   *     ， app  ，
   */
  countryCode: initialCountryCode,

  //   //
  //   routeStackCount: 1,
};
export type UniverseState = typeof initialState;

//
export const universe: Module<UniverseState, IStoreStateType> = {
  namespaced: true,
  state: initialState,
  mutations: {
    /**
     *       （    or     or    ）
     * @param state
     * @param regionType
     */
    [UNIVERSE_MUTATIONS_TYPES.setCountryCode](
      state: UniverseState,
      countryCode: string
    ) {
      state.countryCode = countryCode;
      setCountryCodeLocalStorage(countryCode);
      const versionCountry = convertCountryToVersionCountry(countryCode);
      const oldVersionCountry = state.versionCountry;
      if (oldVersionCountry !== versionCountry) {
        //
        state.versionCountry = versionCountry;
        const config = VERSION_COUNTRY_CONFIG_MAP[versionCountry];
        for (const key in config) {
          (state as any)[key] = (config as any)[key];
        }
      }
    },
  },
  getters: {},
};

type ICurrencyOption = IFormatFloatOption & {
  /**
   * {sign} {money}
   */
  template?: string;
};

export const universeGetters = {
  moneySymbol(state: IStoreStateType) {
    return state.universe.moneySymbol;
  },
  /**
   *
   * @returns
   */
  langConfig() {
    const lang = getCurrentLang();
    const langConfig =
      LANG_CONFIG_MAP[lang as 'id' | 'default'] || LANG_CONFIG_MAP.default;
    return langConfig;
  },
  //#region base currency

  /**
   *
   * @param state
   * @returns
   */
  formatFloat: function (
    _state: IStoreStateType,
    getters: { langConfig: typeof LANG_CONFIG_MAP.default }
  ) {
    const langConfig = getters.langConfig;
    const decimalMark = langConfig.decimalMark;
    const separator = langConfig.separator;
    /**
     *   float （     ）
     */
    return function (
      floatNum: number,
      option?: IFormatFloatOptionBase & {
        /**
         *
         */
        separator?: string;
      }
    ) {
      return formatFloatBase(floatNum, {
        separator: option?.separator ?? (separator || ''),
        decimalMark: decimalMark,
        precision: option?.precision,
        reserveZeroDecimal: option?.reserveZeroDecimal,
        round: option?.round,
      });
    };
  },

  //#endregion

  /**
   *
   */
  translateImage: function () {
    /**
     *        (    en   )
     * @param assetMap {[local:string]:string}
     * @example:getters.translateImage({
     * en:require('@/assets/xxx/a-en.png'),
     * hi:require('@/assets/xxx/a-hi.png'),
     * id:require('@/assets/xxx/a-id.png')
     * },'en')
     */
    return function (
      assetMap: SUPPORT_LANG_MAP_TYPE,
      _defaultLang?: SUPPORT_LANG_CODE_KEY
    ) {
      return (
        assetMap[getCurrentLang() as keyof typeof assetMap] ||
        assetMap[
          (_defaultLang || SUPPORT_LANG_CODE.en) as keyof typeof assetMap
        ]
      );
    };
  },

  // translateCountryImage: function (state: IStoreStateType) {
  //   const versionCountry = state.universe.versionCountry;
  //   /**
  //    *         （    IN/ID）,  ID）
  //    */
  //   return function (
  //     assetMap: VERSION_CONTRY_MAP_TYPE,
  //     _defaultCountryCode?: VERSION_CONTRY_CODE_KEY
  //   ) {
  //     return (
  //       assetMap[versionCountry as keyof typeof assetMap] ||
  //       assetMap[
  //         (_defaultCountryCode ||
  //           VERSION_CONTRY_CODE.ID) as keyof typeof assetMap
  //       ]
  //     );
  //   };
  // },
  realHttpLocalFlag: function (state: IStoreStateType) {
    return `${state.universe.countryCode}|${getCurrentLang()}`;
  },
};

export type IUniverseRootGetter = IGetterType<typeof universeGetters>;

// /**
//  *     Rp （  ）
//  * @param coinCount
//  * @returns
//  */
// export function formatCoinRpNum(coinCount: number | null) {
//   if (coinCount == null || isNaN(coinCount)) {
//     return null;
//   }
//   const rpCount = Math.floor(coinCount / 10);
//   return rpCount;
// }

// /**
//  *     Rp （     ）
//  * @param coinCount
//  * @param options
//  * @returns string | null
//  */
// export function formatCoinRp(
//   coinCount: number | null,
//   options?: {
//     prefix: string;
//   }
// ) {
//   const rpCount = formatCoinRpNum(coinCount);
//   return formatFloatG(rpCount, options);
// }

// /**
//  *          Rp
//  * coinCount-->coinCount coin or Rp CoinCount
//  * @param coinCount
//  * @returns string| null
//  */
// export function formatCoinRpAuto(coinCount: number | null) {
//   if (process.env.VUE_CPL_ENV_USE_RP) {
//     return formatCoinRp(coinCount, { prefix: 'Rp' });
//   } else {
//     if (coinCount == null) {
//       return null;
//     }
//     return TransTool.Instance.$tc('Base.xCoins', coinCount, {
//       n: formatFloatG(coinCount),
//     });
//   }
// }

export type IFormatFloatGOption = IFormatFloatOptionBase & {
  prefix?: string;
};
/**
 *       formatFloat(   null,  null)
 * @param count
 * @param options
 * @returns string|null
 */
export function formatFloatG(
  count: number | null,
  options?: IFormatFloatGOption
) {
  if (count == null) {
    return null;
  }
  const { prefix = '', ...rest } = options || {};
  const store = getStore();
  return prefix + store.getters.formatFloat(count, rest);
}
/**
 *
 * @param num
 * @param maxLength
 * @param maxPrecision
 * @param langOption
 * @returns
 */
export function formatNumberInAbbreviation(
  num: number,
  maxLength: number,
  maxPrecision: number
) {
  const store = getStore();
  const langConfig = store.getters.langConfig;
  return formatNumberInAbbreviationBase(
    num,
    maxLength,
    maxPrecision,
    langConfig
  );
}

export function formatNumberInAbbreviationWithoutId(
  num: number,
  maxLength: number,
  maxPrecision: number
) {
  return formatNumberInAbbreviationBase(
    num,
    maxLength,
    maxPrecision,
    LANG_CONFIG_MAP.default
  );
}
