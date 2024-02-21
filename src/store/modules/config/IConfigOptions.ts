import type ThrottleController from '@/controller/ThrottleController';
import type { ConfigState } from './IConfigState';

export type IConfigOptions<T> = {
  throttleIns: ThrottleController;
  /**
   *
   */
  getConfig: () => Promise<IHttpResponse<T>>;

  /**
   *       mode
   * never:
   * default:                httpFlag   （       ）    ，      ，
   * clear:  default    ,
   */
  initMode: 'never' | 'default' | 'clear';

  /**
   *
   *       updateTime  overtimems
   *  0
   */
  overtimeMs: number;

  /**
   *   config       setConfigObj
   * string:  setConfigObj  payload={configNum,data}
   * function:   commit  ，payload data
   */
  setConfig?: string | ((state: ConfigState, payload: T) => void);
};
