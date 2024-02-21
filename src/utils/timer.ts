import { setAppInterval } from '../js_bridge/jsCallApp/appInterval';
export function bridgeWait(ms: number) {
  return new Promise<void>((resolve) => {
    setAppInterval(() => {
      resolve();
      return true;
    }, ms);
  });
}
