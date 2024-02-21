import { API_SHARELINK_SERVER } from '@/config/server';
import { standardSafeHttp } from '../index';
import { createHttpResponse } from '../createHttpResponse';

/**
 *   A
 */
export function getReferInviteCode() {
  return standardSafeHttp
    .request<IHttpResponse<string>>({
      url: '/vu/invite/link',
      method: 'POST',
      data: {
        userId: '',
        deviceId: '',
      },
    })
    .then((res) => {
      console.debug('link', res.data);
      return res.data;
    });
}

/**
 *   Nodejs   shareLink
 * @param shareParams
 * @returns
 */
export function getNodeShareLink(shareParams: {
  campaignPid: number;
  shareNumber: number;
}): Promise<IHttpResponse<string>> {
  return standardSafeHttp
    .request<{
      // 1
      Result: 1 | 0;
      message: string;
      data: {
        shareLink: string;
        //   shareNumber: '10103'
      };
    }>({
      noExtraHeader: true,
      baseURL: API_SHARELINK_SERVER,
      url: '/api/share/getShareLink',
      method: 'GET',
      params: shareParams,
    })
    .then((res) => {
      const response = res.data;
      if (response.Result === 1) {
        return createHttpResponse({
          success: true,
          code: 200,
          data: response.data.shareLink,
        });
      } else {
        return createHttpResponse({
          success: false,
          message: response.message,
        });
      }
    });
}

/**
 *
 * @param data
 * @returns
 */
export function getAndPreloadShareLinkExt(data: {
  campaignPid: number;
  shareNumber: number;
  id: string;
  title?: string;
  description?: string;
  iconUrl: string;
}) {
  const { campaignPid, shareNumber, ...rest } = data;
  return standardSafeHttp
    .request<{
      // 1
      code: number;
      message: string;
      data: boolean;
    }>({
      noExtraHeader: true,
      baseURL: API_SHARELINK_SERVER,
      url: '/api/share/getShareLinkExt',
      method: 'POST',
      params: {
        campaignPid: campaignPid,
        shareNumber: shareNumber,
      },
      data: rest,
    })
    .then((res) => {
      if (res.data.code === 1) {
        return {
          Result: 1,
          success: true,
          code: res.status,
          data: res.data,
          status: res.status,
          servertime: res.__updateAt,
        };
      } else {
        return {
          Result: 0,
          success: false,
          code: res.status,
          ErrCode: res.data.code,
          status: res.status,
          servertime: res.__updateAt,
        };
      }
    });
}
