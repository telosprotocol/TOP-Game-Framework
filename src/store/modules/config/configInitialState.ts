import type { ConfigKey } from './IConfigState';

export type IConfigStatusInfo = {
  /**
   *         httpAuthFlag,     httpAuthFlag  ，
   */
  httpFlag: string;

  /**
   *
   */
  updateTime: number;

  /**
   *     (     ) httpFlag
   */
  currentHttpFlag: string;
  /**
   *        promise,
   *
   */
  currentPromise?: Promise<boolean>;

  /**
   *
   *     false,  tryUpdate
   *     true,
   */
  isInitedByLocal?: boolean;
};

//   status
export const configStatusMap = {} as {
  [configNum in ConfigKey]: IConfigStatusInfo;
};
