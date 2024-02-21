export interface IPushDeviceRegister {
  userId: string;
  auth: string;
  point: number;
  avatar: string;
}
export interface IPushUpdateMemberInfo {
  point: number;
  /**
   * @deprecated
   */
  signInCount?: number;
}
export interface IPushUpdateTaskInfo {
  /**
   *     （   subCategory)
   */
  subCategory: number;

  /**
   *
   * e.g: 30        30s
   */
  interval?: number;

  /**
   *
   * e.g:1       1
   */
  count?: number;
  /**
   *
   *  44，
   */
  subType?: string;

  /**
   *  h5
   */
  from: string;

  /**
   *       （h5              ）
   */
  needReport: boolean;
}

export type UserOperateSituationType =
  | 'siteCenter'
  | 'recommended'
  | 'music'
  | 'movie'
  | 'funny'
  | 'trending'
  | 'gameing'
  | 'news'
  | 'subscriptions'
  | 'sports'
  | 'channel'
  | '_ALL';

export enum UserOperateType {
  /**
   *
   */
  LikeMedia = 1,

  /**
   *     、
   */
  ShareMedia = 2,
}
export interface IUserOperateInfo {
  /**
   *     (Int)
   */
  operateType: UserOperateType;

  /**
   *     (String)（   tab  ）
   */
  sitution: UserOperateSituationType;
}

export interface IPushChangeH5Tab {
  type: string;
  index: number;
  // h5
  from?: string;
}
