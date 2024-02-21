import { storeDispatch } from '../util';

/**
 *            ready（auth  ）
 * @returns
 */
function waitUserIsLoginedRaw(option?: {
  /**
   *       AuthReady
   */
  waitAuthReady?: boolean;
}) {
  return storeDispatch('user/waitUserIsLogined', option) as Promise<boolean>;
}
/**
 *            ready（auth  ）
 * @returns
 */
export function waitUserIsLoginedAuth() {
  return waitUserIsLoginedRaw({
    waitAuthReady: true,
  });
}

/**
 *            （   auth  ）
 * @returns
 */
export function waitUserIsLoginedOnly() {
  return waitUserIsLoginedRaw({
    waitAuthReady: false,
  });
}
