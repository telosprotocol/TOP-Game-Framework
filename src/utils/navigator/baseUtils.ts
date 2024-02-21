import { ROUTENAME_INAPP_NOTFOUND } from '@/constants/localRoutePath';
import { startsWith } from 'lodash-es';
import { convert2QueryStr } from '../url';

//#region url convert
/**
 *   url
 * @param path e.g: /xxx/xxx?xxx
 * @returns
 */
function getEntryHtmlName(path: string) {
  const routeItem = window.vue205.$router.resolve(path);
  const isNotFound =
    !routeItem || routeItem.route.name === ROUTENAME_INAPP_NOTFOUND;
  if (isNotFound) {
    const firstPathPart = ((path || '').split('/')[1] || '').toLowerCase();
    if (firstPathPart === 'dialog') {
      return 'dialog';
    } else if (firstPathPart === 'mix') {
      return 'mix';
    } else if (firstPathPart === 'mix2') {
      return 'mix2';
    } else if (firstPathPart === 'wallet' || firstPathPart === 'v') {
      return 'index';
    }
    // else if (firstPathPart === 'r') {
    //   return 'remote';
    // }
    const entryHtmlName = window.GC.entryHtmlName;
    if (process.env.VUE_APP_ENV_SERVER !== 'production') {
      if (entryHtmlName !== 'index' && entryHtmlName !== 'remote') {
        console.warn('Warning,Should declare entryName!!!');
      }
    }
    if (entryHtmlName === 'remote') {
      return 'index';
    } else {
      return 'remote';
    }
  }
  return window.GC.entryHtmlName;
}
/**
 * url  l,r,c    （ ：        ）
 * @param url
 */
function tryAddCommonStatesToUrl(url: string) {
  return url;
  // const matches = url.match(/[?&]l=(\w+)/);
  // if (matches && matches.length > 0) {
  //   return url;
  // }
  // const store = getStore();
  // const querySign = url.indexOf('?') > -1 ? '&' : '?';
  // return `${url}${querySign}l=${getCurrentLang()}&r=${
  //   store.state.base.region
  // }&c=${store.state.universe.versionCountry}`; //&_t=
}
/**
 * noramlize url
 * @param urlOrPath    http  | vv: | /
 * @param entryName       ( ：     ，          ，   remote index,   )
 */

export function normalizeUrlOrPath(
  urlOrPath: string,
  entryName?: IEntryHtmlName
) {
  if (urlOrPath[0] === '/') {
    const hasHash = urlOrPath.indexOf('#') >= 0; //  /index.html#/Wallet/zzz
    let url = '';
    if (hasHash) {
      url = `${location.origin}${urlOrPath}`;
    } else {
      if (urlOrPath.split('?')[0].indexOf('.html') >= 0) {
        url = `${location.origin}${urlOrPath}`;
      } else {
        let pathname =
          '/' +
          (entryName
            ? entryName + '.html'
            : getEntryHtmlName(urlOrPath) + '.html');
        if (pathname === 'index.html') {
          pathname = '/';
        }
        url = `${location.origin}${pathname}#${urlOrPath}`;
      }
    }
    // path
    url = tryAddCommonStatesToUrl(url);
    return url;
  } else if (startsWith(urlOrPath, 'vv:')) {
    return urlOrPath;
  } else {
    //(urlOrPath.substr(0, 4) === 'http')
    return tryAddCommonStatesToUrl(urlOrPath);
  }
}

export function normalizeUrlWithQuery(
  urlOrPath: string,
  query: Record<string, null | string | number | undefined>,
  entryName?: IEntryHtmlName
) {
  const querySign = urlOrPath.indexOf('?') > 0 ? '&' : '?';
  let url = urlOrPath;
  if (query) {
    url = urlOrPath + querySign + convert2QueryStr(query);
  }
  return normalizeUrlOrPath(url, entryName);
}
