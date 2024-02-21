import { standardSafeHttp } from '@/http/http';
import type { MediaCategory, MEDIA_TYPE } from '@/views-remote/Download/data';
import { tryParseArrayAndRemoveEmpty } from '../../utils/string/tryParseArray';

// export enum PFVideoType {
//   Film = 1,
//   TV = 2
// }

export type IMediaListItem = {
  icon: string;
  videoId: string;
  /**
   * MEDIA_TYPE
   */
  videoType: MEDIA_TYPE;
  title: string;
  score: string;
  tags: string[];
  subTags: string[];
  subTitle: string | null;
};
interface IPlayFormModelRaw<T> {
  pfId: string;
  pfTitle: string;
  pfDesc: string;

  /**
   *     key,    ，  playform-pfId
   */
  pfKey: string;
  /**
   *
   */
  pfShareImg: string;
  pfVideoList: T[];
  collectStatus: 1 | 0;
  img2: string;
  collectNum?: number;
}
type IPfVideoItem = {
  videoId: string;
  /**
   *
   */
  videoName: string;
  videoType: MEDIA_TYPE; //       1 2
  videoScore?: string;
  videoYear?: string;
  videoIconImg: string;
  videoUrl?: string;

  videoTag: string[];
  videoCountry: string[];
  videoActor: string[];
};

type IPfVideoItemRaw = Omit<
  IPfVideoItem,
  'videoTag' | 'videoCountry' | 'videoActor'
> & { videoTag?: string; videoCountry?: string; videoActor?: string };
export type IPlayFormModel = IPlayFormModelRaw<IPfVideoItem>;

export function getPlayFormInfo(pfId: string) {
  return standardSafeHttp
    .get<IHttpResponse<IPlayFormModelRaw<IPfVideoItemRaw>>>(
      '/feed/sharePage/playForm/getInfo',
      { noExtraHeader: true, params: { pfId, userId: '' } }
    )
    .then((res) => {
      return res.data;
    })
    .then((res) => {
      if (res.Result === 1) {
        return {
          ...res,
          data: {
            ...res.data,
            pfVideoList: (res.data.pfVideoList || []).map((item) => {
              const { videoTag, videoCountry, videoActor, videoType, ...rest } =
                item;
              return {
                videoTag: tryParseArrayAndRemoveEmpty(videoTag) || [],
                videoCountry: tryParseArrayAndRemoveEmpty(videoCountry) || [],
                videoActor: tryParseArrayAndRemoveEmpty(videoActor) || [],
                videoType: +videoType,
                ...rest,
              } as IPfVideoItem;
            }),
          } as IPlayFormModel,
        };
      }
      return res;
    });
}

export function collectMedia(
  videoId: string,
  category: MediaCategory,
  isCollect: boolean
) {
  return standardSafeHttp
    .post<IHttpResponse<IPlayFormModel>>('/feed/collect/keep', {
      userId: '',
      videoId,
      collectStatus: isCollect ? 1 : 0,
      category,
    })
    .then((res) => {
      return res.data;
    });
}

export interface IPlayFormListItem {
  pfId: number | string;
  img2: string;
  title: string;
  themeColor: string;
  desc: string;
  collectStatus: 1 | 0;
}
export function getPlayformList(
  tag: string,
  pageIndex: number,
  pageSize: number
) {
  return standardSafeHttp
    .get<
      IHttpResponse<{
        records: IPlayFormListItem[];
        current: number;
        size: number;
        total: number;
      }>
    >('/feed/playForm/getH5PlayFormList', {
      // noExtraHeader: true,
      params: {
        userId: '',
        pageIndex: pageIndex + 1, //server  1
        tag,
        pageSize,
      },
    })
    .then((res) => {
      return res.data;
    });
}
