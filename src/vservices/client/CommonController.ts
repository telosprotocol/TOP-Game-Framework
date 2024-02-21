// @ts-ignore
/* eslint-disable */
import { requestVRaw as request } from '@/http/http';

/** get upload config POST /v1/upload/config */
export async function uploadConfigCommonController(
  body: API.UploadConfigAO,
  options?: { [key: string]: any },
) {
  return request<API.ObjectVOUploadConfigVO>('/v1/upload/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
