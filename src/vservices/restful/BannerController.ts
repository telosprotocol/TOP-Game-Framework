// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** Get the banner list interface GET /v1/banner/list */
export async function bannerListBannerController(
  //      Param   ( body  swagger        )
  params: RAPI.bannerListBannerControllerParams,
  options?: { [key: string]: any }
) {
  return request<RAPI.ListVOBannerListVO>('/v1/banner/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
