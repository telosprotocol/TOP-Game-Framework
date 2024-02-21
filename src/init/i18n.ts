import { setLangLs } from '@/controller/PersistentLocalStorage';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import type { LocaleMessageObject } from 'vue-i18n';
import { getLangLs } from '../controller/PersistentLocalStorage';
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';
import idLang from '@/alias/vant/vantIDLang';
import BrandName from '@/constants/BrandName';

type ILangType = 'en' | 'id';
export const supportedLocalList = ['en', 'id'];

function loadLocaleMessages() {
  // import('@/locales/en').then(_lang => {})
  const messages: Partial<{ [key in ILangType]: any }> = {};
  // supportedLocalList.forEach(local => {
  //   messages[local] = {}
  // })
  const commonLocale = require.context(
    '@/locales/Common',
    true,
    /[A-Za-z0-9-_,\s]+\.(js|ts)$/i
  );
  addPartLocalesToMessages(commonLocale, messages);
  return messages;
}

export function addPartLocalesToMessages(
  locales: __WebpackModuleApi.RequireContext,
  messages: { [local: string]: any }
) {
  //        ，    ？
  locales.keys().forEach((key) => {
    //keys: ./xxx/en.ts
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1]; // en
      if (!messages[locale]) {
        messages[locale] = {};
      }
      const firstIdx = key.indexOf('/');

      const noExtPathList = key
        .substr(firstIdx + 1, key.length - firstIdx - 1 - 3)
        .split('/');
      noExtPathList.pop();

      const moduleName = noExtPathList.join('.');

      const langObj = messages[locale];
      const moduleObj = locales(key);
      langObj[moduleName] = moduleObj.default || moduleObj;
    }
  });
}

const LANG_LOCALSTORAGE_KEY = 'LANG';

function setLangLocalStorage(lang: string) {
  setLangLs(lang);
  document.cookie = `${LANG_LOCALSTORAGE_KEY}=${lang}`;
  return lang;
}

Locale.use('en-US', enUS);
export function setCurrentLang(lang: string) {
  const toLang = normalizeLang(lang);
  console.log('SetCurrentLang', lang, toLang);
  getVueIns().$i18n.locale = toLang;
  setLangLocalStorage(toLang);
  if (lang === 'id') {
    Locale.use('id', idLang);
  } else {
    Locale.use('en-US', enUS);
  }
  return toLang;
}

function normalizeLang(lang: string) {
  const toLang = (lang || '').toLowerCase();
  // if (toLang === 'in') {
  //   return 'hi';
  // }
  return toLang;
}

function getVueIns() {
  return window.vue205;
}
export function getCurrentLang() {
  const locale = getVueIns()?.$i18n?.locale;
  if (locale) {
    return locale as ILangType;
  }
  return getLangLs() as ILangType;
}

let curI18nIns: VueI18n;
export function getI18nIns() {
  return curI18nIns;
}

export function createVueI18nByQuery() {
  function getQueryLang() {
    // 1.search
    let queryLang = location.search && getLangQuery(location.search);
    if (queryLang) {
      return queryLang;
    }

    // 2.hash
    queryLang = location.hash && getLangQuery(location.hash);
    if (queryLang) {
      return queryLang;
    }

    function getLangQuery(searchStr: string) {
      const matches = searchStr.match(/[?&]l=(\w+)/);
      if (matches && matches.length > 0) {
        return matches[1] && matches[1].toLowerCase();
      }
    }
    // 3.localStorage
    queryLang = getLangLs();
    if (queryLang) {
      return queryLang;
    }
    // 4. fallback
    return 'en';
  }
  let lang = getQueryLang();
  lang = normalizeLang(lang);
  setLangLocalStorage(lang);

  /**
   *
   * @param {*} locale
   * @param {*} gpName GP003/GP002
   */
  function createVueI18n(locale: string) {
    Vue.use(VueI18n);

    const messages = loadLocaleMessages();
    console.log('[I18N]', locale);

    for (const locale in messages) {
      const msgObj = (messages as any)[locale];
      if (msgObj) {
        msgObj.BrandName = BrandName;
      }
    }
    const toLocale = (locale || 'en').substr(0, 2);
    const rtlList = ['ar', 'ur'];
    const dir = rtlList.indexOf(toLocale) > -1 ? 'rtl' : 'ltr';
    try {
      document.getElementsByTagName('body')[0].style.direction = dir;
    } catch {}
    const i18n = new VueI18n({
      locale: toLocale,
      fallbackLocale: 'en',
      messages: messages,
      silentFallbackWarn: /^{\w+}\./,
      dateTimeFormats: {
        en: {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          },
          long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
          },
        },
      },
    });
    return i18n;
  }
  curI18nIns = createVueI18n(lang);
  return curI18nIns;
}

export class TransTool {
  static _Instance: TransTool;
  static get Instance() {
    if (!TransTool._Instance) {
      TransTool._Instance = new TransTool();
    }
    return TransTool._Instance;
  }
  mergeMessages(
    locale: string,
    namespaceName: string,
    message: LocaleMessageObject
  ) {
    getI18nIns().mergeLocaleMessage(locale, {
      [namespaceName]: message,
    });
  }
  mergeMessagesHasNamespace(locale: string, message: LocaleMessageObject) {
    getI18nIns().mergeLocaleMessage(locale, message);
  }

  $t: typeof window.vue205.$i18n.t;
  $tc: typeof window.vue205.$i18n.tc;
  private constructor() {
    const vue205 = getVueIns();
    this.$t = vue205.$t.bind(vue205);
    this.$tc = vue205.$tc.bind(vue205);
  }
}
